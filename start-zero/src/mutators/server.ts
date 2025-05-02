import type { AuthData, ZeroSchema } from '@/db/schema.zero'
import type { CustomMutatorDefs } from '@rocicorp/zero/pg'
import { createMutators } from './client'

/**
 * Wrap client mutators, adding any server-only logic or postCommitTasks.
 */
export function createServerMutators(
	authData: AuthData,
): CustomMutatorDefs<ZeroSchema, unknown> {
	const clientMutators = createMutators(authData)
	return {
		...clientMutators,
		// You can override or extend here:
		persons: {
			...clientMutators.persons,
			// e.g. add audit logging inside the same transaction
			async insert(tx, args) {
				if (!clientMutators.persons?.insert)
					throw new Error('Missing insert mutator')
				await clientMutators.persons.insert(tx, args)
				// server-side-only: await tx.mutate.auditLog.insert({ ... })
			},
			// Override deleteMany to delete each id within the transaction
			async deleteMany(tx, args: { ids: string[] }) {
				if (!authData.sub) throw new Error('Not authenticated')
				for (const id of args.ids) {
					await tx.mutate.persons.delete({ id })
				}
			},
		},
	}
}
