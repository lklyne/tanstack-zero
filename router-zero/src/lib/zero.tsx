import type { schema } from '@/db/schema.zero'
import { useZero as _useZero } from '@rocicorp/zero/react'

import { zeroSchema } from '@/db/schema.zero'
import { Zero } from '@rocicorp/zero'
import { ZeroProvider as ZeroProviderBase } from '@rocicorp/zero/react'

export const useZero = _useZero<typeof schema>

const z = new Zero({
	userID: 'guest',
	schema: zeroSchema,
	kvStore: 'mem',
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	server: import.meta.env.VITE_PUBLIC_SERVER!,
})

export function ZeroProvider({ children }: { children: React.ReactNode }) {
	return <ZeroProviderBase zero={z}>{children}</ZeroProviderBase>
}
