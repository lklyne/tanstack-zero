import { createAuthClient } from 'better-auth/react' // Use the React-specific client

// Initialize the client
export const authClient = createAuthClient({
	// No baseURL needed when running on same origin
	// plugins: [], // We can add plugins later if needed
})

// sign in with google
export const signInWithGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: 'google',
	})

	return data
}

// Re-export commonly used methods and hooks for cleaner imports
export const {
	signIn,
	signUp,
	signOut,
	getSession,
	useSession, // React hook for session management
} = authClient
