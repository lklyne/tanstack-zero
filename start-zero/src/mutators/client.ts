import type { AuthData, ZeroSchema } from '@/db/schema.zero'
import type { CustomMutatorDefs, Transaction } from '@rocicorp/zero'

/**
 * Define client-side mutators
 */
export function createMutators(authData: AuthData) {
	return {
		persons: {
			async insert(
				tx: Transaction<ZeroSchema>,
				args: { id: string; name: string },
			) {
				// e.g. permission check: only logged-in users can insert
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.insert(args)
			},
			async delete(tx: Transaction<ZeroSchema>, args: { id: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.delete(args)
			},
			async deleteMany(tx: Transaction<ZeroSchema>, args: { ids: string[] }) {
				if (!authData.sub) throw new Error('Not authenticated')
				for (const id of args.ids) {
					await tx.mutate.persons.delete({ id })
				}
			},
		},
		users: {
			async create(
				tx: Transaction<ZeroSchema>,
				u: { id: string; email: string; name: string },
			) {
				if (!authData.sub) throw new Error('Not authenticated')

				// Check if user already exists
				if (await tx.query.users.where('id', u.id).one().run()) return
				await tx.mutate.users.insert(u)
			},
			async delete(tx: Transaction<ZeroSchema>, args: { id: string }) {
				if (!authData.sub) throw new Error('Not authenticated')

				// Ensure users can only delete their own account
				if (args.id !== authData.sub)
					throw new Error("Cannot delete another user's account")
				await tx.mutate.users.delete(args)
			},
			async upsert(
				tx: Transaction<ZeroSchema>,
				args: { id: string; email: string; name: string },
			) {
				if (!authData.sub) throw new Error('Not authenticated')

				// Check if user already exists
				if (await tx.query.users.where('id', args.id).one().run()) return
				await tx.mutate.users.insert(args)
			},
		},
	} as const satisfies CustomMutatorDefs<ZeroSchema>
}

export type Mutators = ReturnType<typeof createMutators>
