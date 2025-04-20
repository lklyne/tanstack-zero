import type { AuthData, ZeroSchema } from '@/db/schema.zero'
import type { CustomMutatorDefs } from '@rocicorp/zero/pg'
import { createMutators } from './shared'

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
		},
	}
}
