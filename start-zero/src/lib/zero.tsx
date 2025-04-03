import type { schema } from '@/db/schema.zero'
import { useZero as _useZero } from '@rocicorp/zero/react'

import { zeroSchema } from '@/db/schema.zero'
import { authClient } from '@/lib/auth-client'
import { Zero } from '@rocicorp/zero'
export const useZero = _useZero<typeof schema>

async function getAuthToken(): Promise<string | undefined> {
	try {
		const response = await fetch('/api/auth/token')
		if (!response.ok) {
			console.warn('Failed to fetch auth token:', response.statusText)
			return undefined
		}
		const { token } = await response.json()
		return token
	} catch (error) {
		console.warn('Error fetching auth token:', error)
		return undefined
	}
}

export async function initZero() {
	console.log('🟥 Constructing a new Zero instance!')

	const zero = new Zero({
		auth: undefined,
		userID: 'guest',
		schema: zeroSchema,
		kvStore: import.meta.client ? 'idb' : 'mem',
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		server: import.meta.env.VITE_PUBLIC_SERVER!,
	})

	return zero
}
