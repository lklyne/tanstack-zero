import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	// No baseURL needed when running on same origin
	// plugins: [], // We can add plugins later if needed
})

export const signInWithGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: 'google',
		callbackURL: '/app', // Add redirect URL here
	})

	return data
}

export const { signIn, signUp, signOut, getSession, useSession } = authClient
