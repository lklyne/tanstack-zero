import type { schema } from '@/db/schema.zero'
import { useZero as _useZero } from '@rocicorp/zero/react'

import { zeroSchema } from '@/db/schema.zero'
import { authClient } from '@/lib/auth-client'
import { Zero } from '@rocicorp/zero'
export const useZero = _useZero<typeof schema>

// await authClient.getSession({
// 	fetchOptions: {
// 		onSuccess: (ctx) => {
// 			const jwt = ctx.response.headers.get('set-auth-jwt')
// 		},
// 	},
// })

export async function initZero() {
	console.log('🟥 Constructing a new Zero instance!')
	const { data } = await authClient.getSession()
	const zero = new Zero({
		auth: async () => {
			const response = await fetch('/api/auth/token')
			const { token } = await response.json()
			return token
		},
		userID: data?.user.id ?? 'guest',
		schema: zeroSchema,
		kvStore: import.meta.client ? 'idb' : 'mem',
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		server: import.meta.env.VITE_PUBLIC_SERVER!,
	})

	return zero
}
