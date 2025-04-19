import { type AuthData, schema } from '@/db/schema.zero'
import type { CustomMutatorDefs } from '@rocicorp/zero/pg'

/**
 * Define client-side mutators (optimistic updates + permissions).
 */
export function createMutators(
	authData: AuthData,
): CustomMutatorDefs<typeof schema, unknown> {
	return {
		persons: {
			async insert(tx, args: { id: string; name: string }) {
				// e.g. permission check: only logged-in users can insert
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.insert(args)
			},
			async delete(tx, args: { id: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.delete(args)
			},
		},
	}
}
