// https://github.com/BriefHQ/drizzle-zero
import {
	ANYONE_CAN,
	ANYONE_CAN_DO_ANYTHING,
	type ExpressionBuilder,
	type InsertValue,
	type PermissionsConfig,
	type Row,
	type Schema,
	definePermissions,
} from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'
import * as drizzleSchema from './schema'

// Define AuthData type explicitly
interface AuthData {
	sub: string // assuming sub is the user identifier
	// Add other authentication-related fields as needed
}

export const zeroSchema = createZeroSchema(drizzleSchema, {
	version: 1,
	// Specify which tables and columns to include in the Zero schema.
	// This allows for the "expand/migrate/contract" pattern recommended in the Zero docs.
	// When a column is first added, it should be set to false, and then changed to true
	// once the migration has been run.
	tables: {
		persons: {
			id: true,
			name: true,
		},
	},
})

// Must export `schema`
export const schema = zeroSchema

// Define permissions with explicit types
export type ZeroSchema = typeof zeroSchema

export type Person = Row<typeof zeroSchema.tables.persons>
export type InsertPerson = InsertValue<typeof zeroSchema.tables.persons>

export const permissions = definePermissions<AuthData, ZeroSchema>(
	zeroSchema,
	() => {
		const allowIfLoggedIn = (
			authData: AuthData,
			{ cmpLit }: ExpressionBuilder<ZeroSchema, 'persons'>,
		) => cmpLit(authData.sub, 'IS NOT', null)

		return {
			persons: {
				row: {
					select: ANYONE_CAN,
					insert: ANYONE_CAN,
					delete: [allowIfLoggedIn],
				},
			},
		} satisfies PermissionsConfig<AuthData, ZeroSchema>
	},
)
