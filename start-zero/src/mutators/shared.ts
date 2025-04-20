import type { AuthData, ZeroSchema } from '@/db/schema.zero'
import type { CustomMutatorDefs } from '@rocicorp/zero/pg'

/**
 * Define client-side mutators (optimistic updates + permissions).
 */
export function createMutators(
	authData: AuthData,
): CustomMutatorDefs<ZeroSchema, unknown> {
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
		users: {
			async create(tx, u: { id: string; email: string; name: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				// Check if user already exists
				if (await tx.query.users.where('id', u.id).one().run()) return
				await tx.mutate.users.insert(u)
			},
		},
	}
}
