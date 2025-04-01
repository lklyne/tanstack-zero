import type { schema } from '@/db/schema.zero'
import { useZero as _useZero } from '@rocicorp/zero/react'

import { zeroSchema } from '@/db/schema.zero'
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

	const z = new Zero({
		userID: 'guest',
		schema: zeroSchema,
		auth: undefined,
		kvStore: import.meta.client ? 'idb' : 'mem',
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		server: import.meta.env.VITE_PUBLIC_SERVER!,
	})

	return z
}
