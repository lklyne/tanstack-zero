import { authAtom } from '@/lib/zero-setup'
import { clearJwt } from '@/server/auth/jwt'
import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { useEffect } from 'react'

// Use a dedicated channel for cross-tab communication
const SIGNOUT_CHANNEL_NAME = 'better-auth.signout-channel'
const SIGNOUT_EVENT_FALLBACK = 'better-auth.signout-event'

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
				// Force page reload to clear any in-memory state
				window.location.href = '/auth/login'
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
				// Force page reload to clear any in-memory state
				window.location.href = '/auth/login'
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

// Enhanced signOut that also clears cookies
export const enhancedSignOut = async () => {
	try {
		// Call Better Auth signOut to invalidate the session
		await authClient.signOut()

		// Clear our cookies
		clearJwt()

		// Clear the auth atom
		authAtom.value = undefined

		// Broadcast signout to other tabs
		broadcastSignout()

		return true
	} catch (error) {
		console.error('Error during sign out:', error)
		return false
	}
}

// Export the original functions
export const { signIn, signUp, getSession, useSession } = authClient

// Export our enhanced signOut instead of the original
export const signOut = enhancedSignOut

// Hook to handle auth sync across tabs
export function useAuthSync() {
	useEffect(() => {
		// BroadcastChannel setup is already handled at the module level
		// This hook can be used in top-level components to ensure auth syncing is active

		// No additional setup needed for BroadcastChannel
		// Return empty cleanup function
		return () => {}
	}, [])
}
