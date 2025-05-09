import type { AuthData } from '@/server/db/zero-permissions'
import type { Schema } from '@/server/db/zero-schema.gen'
import type { CustomMutatorDefs } from '@rocicorp/zero'

/**
 * Define server-side mutators with direct implementation
 */
export function createServerMutators(
	authData: AuthData,
): CustomMutatorDefs<Schema> {
	return {
		persons: {
			async insert(tx, args: { id: string; name: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.insert(args)
				// Add server-side logging or additional logic here
			},
			async delete(tx, args: { id: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				await tx.mutate.persons.delete(args)
			},
			async deleteMany(tx, args: { ids: string[] }) {
				if (!authData.sub) throw new Error('Not authenticated')
				for (const id of args.ids) {
					await tx.mutate.persons.delete({ id })
				}
			},
		},
		users: {
			async create(tx, u: { id: string; email: string; name: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				// Check if user already exists
				if (await tx.query.users.where('id', u.id).one().run()) return
				await tx.mutate.users.insert(u)
			},
			async delete(tx, args: { id: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				// Ensure users can only delete their own account
				if (args.id !== authData.sub)
					throw new Error("Cannot delete another user's account")
				await tx.mutate.users.delete(args)
			},
			async upsert(tx, args: { id: string; email: string; name: string }) {
				if (!authData.sub) throw new Error('Not authenticated')
				// Check if user already exists
				if (await tx.query.users.where('id', args.id).one().run()) return
				await tx.mutate.users.insert(args)
			},
		},
	}
}
