import { schema } from '@/db/schema.zero'
import type { AuthData, ZeroSchema } from '@/db/schema.zero'
import { Atom } from '@/lib/atom'
import { clearJwt, getJwt, getRawJwt } from '@/lib/jwt'
import { type Mutators, createMutators } from '@/mutators/shared'
import { Zero } from '@rocicorp/zero'
import { CACHE_FOREVER } from './query-cache-policy'

export type LoginState = {
	encoded: string
	decoded: AuthData
}

const zeroAtom = new Atom<Zero<ZeroSchema, Mutators>>()
const authAtom = new Atom<LoginState>()

// Initialize auth state from cookie
const rawJwt = getRawJwt()
const decodedJwt = getJwt()
authAtom.value =
	rawJwt && decodedJwt ? { encoded: rawJwt, decoded: decodedJwt } : undefined

console.log(authAtom.value)

let didPreload = false

export function preload(z: Zero<ZeroSchema, Mutators>) {
	if (didPreload) {
		return
	}
	didPreload = true

	// Preload all users and persons with CACHE_FOREVER policy
	z.query.users.preload(CACHE_FOREVER)
	z.query.persons.preload(CACHE_FOREVER)
}

// Re-create Zero whenever auth changes
authAtom.onChange((auth) => {
	// Close existing instance if any
	zeroAtom.value?.close()
	console.log('🟪 Creating new Zero instance')

	// Ensure server URL is provided
	const server = import.meta.env.VITE_PUBLIC_SERVER
	if (!server) {
		throw new Error(
			'VITE_PUBLIC_SERVER environment variable is not set. Zero cannot connect.',
		)
	}

	console.log(auth?.decoded)

	const authData = auth?.decoded
	const zero = new Zero<ZeroSchema, Mutators>({
		schema,
		server,
		userID: authData?.sub ?? 'anon',
		mutators: createMutators(authData ?? { sub: null }),
		auth: (error?: 'invalid-token') => {
			if (error === 'invalid-token') {
				clearJwt()
				authAtom.value = undefined
				return undefined
			}
			return auth?.encoded
		},
	})

	zeroAtom.value = zero

	// Call preload after zero instance is created
	preload(zero)

	// Expose zero instance in dev tools
	// if (import.meta.env.DEV) {
	// 	const devWindow = window as { zero?: typeof zero }
	// 	devWindow.zero = zero
	// }
})

export { zeroAtom, authAtom }
