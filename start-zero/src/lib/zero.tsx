import type { schema } from '@/db/schema.zero'
import { useZero as _useZero } from '@rocicorp/zero/react'

import { zeroSchema } from '@/db/schema.zero'
import { signOut } from '@/lib/auth-client'
import { Zero } from '@rocicorp/zero'

export const useZero = _useZero<typeof schema>

async function fetchAuthData() {
	try {
		const response = await fetch('/api/auth/token')
		const authJwt = response.headers.get('set-auth-jwt')
		if (authJwt) {
			return { jwt: authJwt }
		}
		const tokenData = await response.json()
		return { jwt: tokenData.token }
	} catch (err) {
		console.error('Error fetching JWT:', err)
		return { jwt: null }
	}
}

export async function initZero() {
	console.log('🟥 Starting Zero initialization...')

	const serverUrl = import.meta.env.VITE_PUBLIC_SERVER
	if (!serverUrl) {
		throw new Error(
			'VITE_PUBLIC_SERVER environment variable is not set. Zero cannot connect.',
		)
	}

	// Fetch auth data during initialization
	const { jwt } = await fetchAuthData()
	const userId = jwt ? getUserIdFromJwt(jwt) : 'guest'

	// Log initialization state
	console.log('🔐 Zero Auth State:', {
		isAuthenticated: !!jwt,
		userMode: userId === 'guest' ? 'Guest Mode' : 'Authenticated User',
		userId,
		hasJwt: !!jwt,
	})

	const zero = new Zero({
		auth: (error?: 'invalid-token') => {
			if (error === 'invalid-token') {
				console.error('❌ Zero reported invalid token. Attempting sign out.')
				signOut().catch((err) => console.error('Sign out failed:', err))
				return undefined
			}
			console.log('🔑 Zero requested auth token.')
			return jwt ?? undefined
		},
		userID: userId,
		schema: zeroSchema,
		kvStore: import.meta.client ? 'idb' : 'mem',
		server: serverUrl,
	})

	console.log('✅ Zero initialization complete!')
	return zero
}

// Helper function to extract userId from JWT
function getUserIdFromJwt(jwt: string): string {
	try {
		const [, payload] = jwt.split('.')
		const decoded = JSON.parse(atob(payload))
		return decoded.sub || 'guest'
	} catch (err) {
		console.error('Error decoding JWT:', err)
		return 'guest'
	}
}
