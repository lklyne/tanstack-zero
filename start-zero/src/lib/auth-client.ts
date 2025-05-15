import { authAtom } from '@/lib/zero-setup'
import { clearJwt, decodeAuthJwt } from '@/server/auth/jwt'
import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { useCallback, useEffect, useRef } from 'react'

// Use a dedicated channel for cross-tab communication
const SIGNOUT_CHANNEL_NAME = 'better-auth.signout-channel'
const SIGNOUT_EVENT_FALLBACK = 'better-auth.signout-event'
const AUTH_CHECK_EVENT = 'better-auth.auth-check'

// Setup BroadcastChannel for cross-tab signout
let signoutChannel: BroadcastChannel | null = null

// Initialize cross-tab communication
if (typeof window !== 'undefined') {
	// Try to use BroadcastChannel API (more reliable and doesn't use localStorage)
	try {
		signoutChannel = new BroadcastChannel(SIGNOUT_CHANNEL_NAME)
		signoutChannel.onmessage = (event) => {
			if (event.data === 'signout') {
				console.log('Cross-tab signout event received via BroadcastChannel')
				// Clear local auth state
				authAtom.value = undefined
				// Clear cookies
				clearJwt()
				// Force page reload to clear any in-memory state and redirect to login
				window.location.href = '/auth/login'
			} else if (event.data === AUTH_CHECK_EVENT) {
				console.log('Auth check event received from another tab')
				checkSessionAndUpdateAtom(true)
			}
		}
	} catch (err) {
		// Fallback for browsers that don't support BroadcastChannel
		console.warn(
			'BroadcastChannel not supported, falling back to localStorage for signout events',
		)
		window.addEventListener('storage', (event) => {
			if (event.key === SIGNOUT_EVENT_FALLBACK && event.newValue) {
				console.log('Cross-tab signout detected via localStorage')
				// Clear local auth state
				authAtom.value = undefined
				// Clear cookies
				clearJwt()
				// Force page reload to clear any in-memory state and redirect to login
				window.location.href = '/auth/login'
			} else if (event.key === AUTH_CHECK_EVENT && event.newValue) {
				console.log('Auth check event received via localStorage')
				checkSessionAndUpdateAtom(true)
			}
		})
	}
}

export const authClient = createAuthClient({
	plugins: [magicLinkClient()],
})

export const signInWithGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: 'google',
		callbackURL: '/app',
	})

	return data
}

export const signInWithMagicLink = async (email: string) => {
	return await authClient.signIn.magicLink({
		email,
		callbackURL: '/app',
	})
}

// Send cross-tab signout message using available mechanisms
function broadcastSignout() {
	// Try BroadcastChannel first (modern, preferred approach)
	if (signoutChannel) {
		try {
			signoutChannel.postMessage('signout')
		} catch (err) {
			console.warn('Error using BroadcastChannel for signout:', err)
		}
	}

	// Fallback to localStorage for older browsers
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(SIGNOUT_EVENT_FALLBACK, Date.now().toString())
			// Clean up after a moment
			setTimeout(() => {
				localStorage.removeItem(SIGNOUT_EVENT_FALLBACK)
			}, 1000)
		}
	} catch (err) {
		console.warn('Error using localStorage fallback for signout:', err)
	}
}

// Broadcast auth check request to all tabs
export function broadcastAuthCheck() {
	// Try BroadcastChannel first
	if (signoutChannel) {
		try {
			signoutChannel.postMessage(AUTH_CHECK_EVENT)
		} catch (err) {
			console.warn('Error using BroadcastChannel for auth check:', err)
		}
	}

	// Fallback to localStorage
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(AUTH_CHECK_EVENT, Date.now().toString())
			// Clean up after a moment
			setTimeout(() => {
				localStorage.removeItem(AUTH_CHECK_EVENT)
			}, 1000)
		}
	} catch (err) {
		console.warn('Error using localStorage fallback for auth check:', err)
	}
}

// Enhanced signOut that also clears cookies and logs out all tabs
export const enhancedSignOut = async () => {
	try {
		// Call Better Auth signOut to invalidate the session
		await authClient.signOut()

		// Clear the auth atom
		authAtom.value = undefined

		// Broadcast signout to other tabs - this will cause them to redirect to login
		broadcastSignout()

		// Redirect the current tab to login page
		// Small timeout to ensure broadcast happens first
		setTimeout(() => {
			window.location.href = '/auth/login'
		}, 50)

		return true
	} catch (error) {
		console.error('Error during sign out:', error)
		return false
	}
}

// Export the original functions
export const { signIn, signUp, useSession } = authClient

// Wrap getSession to update our authAtom
export async function getSession(
	options?: Parameters<typeof authClient.getSession>[0],
) {
	const result = await authClient.getSession(options)

	// If we have a session, update the authAtom
	if (result && 'user' in result && result.user) {
		// Get JWT from header if available (won't be in offline mode)
		const jwt = options?.fetchOptions?.onSuccess
			? undefined // Custom handler will deal with it
			: undefined // No direct access to response headers in result

		if (jwt) {
			const decoded = decodeAuthJwt(jwt)
			if (decoded) {
				authAtom.value = { encoded: jwt, decoded }
			}
		}
	}

	return result
}

// Export our enhanced signOut instead of the original
export const signOut = enhancedSignOut

// Check session and update authAtom
async function checkSessionAndUpdateAtom(
	forceNetwork = false,
): Promise<boolean> {
	// First check if we already have auth in the atom (for offline support)
	if (authAtom.value?.decoded?.sub) {
		console.log('[checkSessionAndUpdateAtom] Using existing auth from atom')
		return true
	}

	// Skip network request in offline mode unless forced
	if (!forceNetwork && !navigator.onLine) {
		return false
	}

	try {
		const session = await getSession({
			fetchOptions: {
				onSuccess: (ctx) => {
					// Get JWT from header in the context
					const jwt = ctx.response.headers.get('set-auth-jwt')
					if (jwt) {
						const decoded = decodeAuthJwt(jwt)
						if (decoded) {
							authAtom.value = { encoded: jwt, decoded }
						}
					}
				},
			},
		})

		return !!(session && 'user' in session && session.user)
	} catch (err) {
		console.warn('Error checking session:', err)
		// If we're offline, consider existing auth valid
		if (!navigator.onLine && authAtom.value?.decoded?.sub) {
			return true
		}
		return false
	}
}

// Hook to handle auth sync across tabs
export function useAuthSync() {
	// Keep track of whether we're already handling a logout
	const isHandlingLogout = useRef(false)

	// Function to manually check auth status
	const checkAuth = useCallback(async (forceNetwork = false) => {
		if (isHandlingLogout.current) return false

		const isAuthenticated = await checkSessionAndUpdateAtom(forceNetwork)
		if (!isAuthenticated && forceNetwork) {
			isHandlingLogout.current = true
			window.location.href = '/auth/login'
		}
		return isAuthenticated
	}, [])

	// Function to request auth check across all tabs
	const requestCrossTabAuthCheck = useCallback(() => {
		console.log('Requesting cross-tab auth check')
		broadcastAuthCheck()
		return checkAuth()
	}, [checkAuth])

	useEffect(() => {
		// Set up interval to periodically check auth status
		const intervalId = setInterval(() => {
			// Only check auth if we're not already handling logout and we're online
			if (!isHandlingLogout.current && navigator.onLine) {
				checkSessionAndUpdateAtom(true).then((isAuthenticated) => {
					if (!isAuthenticated && !isHandlingLogout.current) {
						console.log('Periodic auth check failed, redirecting to login')
						isHandlingLogout.current = true
						window.location.href = '/auth/login'
					}
				})
			}
		}, 60000) // Check every minute

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	return {
		checkAuth,
		requestCrossTabAuthCheck,
	}
}
