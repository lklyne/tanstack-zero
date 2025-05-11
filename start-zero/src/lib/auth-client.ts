import { authAtom } from '@/lib/zero-setup'
import { clearJwt } from '@/server/auth/jwt'
import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { useEffect } from 'react'

// Setup storage event listener for cross-tab signout
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === 'better-auth.signout') {
			console.log('Cross-tab signout detected')
			// Clear local auth state
			authAtom.value = undefined
			// Force page reload to clear any in-memory state
			window.location.href = '/auth/login'
		}
	})
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

// Enhanced signOut that also clears cookies and localStorage
export const enhancedSignOut = async () => {
	try {
		// Call Better Auth signOut to invalidate the session
		await authClient.signOut()

		// Clear our custom JWT storage
		clearJwt()

		// Clear the auth atom
		authAtom.value = undefined

		// Trigger cross-tab signout
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('better-auth.signout', Date.now().toString())
		}

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
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === 'better-auth.signout') {
				console.log('Cross-tab signout detected')
				// Clear local auth state
				authAtom.value = undefined
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])
}
