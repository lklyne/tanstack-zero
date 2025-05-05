// https://github.com/BriefHQ/drizzle-zero
import {
	ANYONE_CAN,
	type ExpressionBuilder,
	type InsertValue,
	type PermissionsConfig,
	type Row,
	// type Schema,
	definePermissions,
} from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'
import * as drizzleSchema from './schema'

// AuthData is the JWT sub claim plus the users row (email & name)
export type AuthData = { sub: User['id'] | null } & Partial<
	Pick<User, 'email' | 'name'>
>

export const zeroSchema = createZeroSchema(drizzleSchema, {
	// version: 1,
	// Specify which tables and columns to include in the Zero schema.
	// This allows for the "expand/migrate/contract" pattern recommended in the Zero docs.
	// When a column is first added, it should be set to false, and then changed to true
	// once the migration has been run.
	tables: {
		persons: {
			id: true,
			name: true,
		},
		users: {
			id: true,
			email: true,
			name: true,
		},
	},
})

// Must export `schema`
export const schema = zeroSchema

// Define permissions with explicit types
export type ZeroSchema = typeof zeroSchema

export type Person = Row<typeof zeroSchema.tables.persons>
export type User = Row<typeof zeroSchema.tables.users>
export type InsertPerson = InsertValue<typeof zeroSchema.tables.persons>
export type InsertUser = InsertValue<typeof zeroSchema.tables.users>
export const permissions = definePermissions<AuthData, ZeroSchema>(
	zeroSchema,
	() => {
		const allowIfLoggedIn = (
			authData: AuthData,
			{ cmpLit }: ExpressionBuilder<ZeroSchema, 'persons'>,
		) => cmpLit(authData.sub, 'IS NOT', null)

		const allowIfSelf = (
			authData: AuthData,
			{ cmp }: ExpressionBuilder<ZeroSchema, 'users'>,
		) => cmp('id', authData.sub as string)

		return {
			persons: {
				row: {
					select: ANYONE_CAN,
					insert: ANYONE_CAN,
					delete: [allowIfLoggedIn],
				},
			},
			users: {
				row: {
					select: ANYONE_CAN,
					insert: ANYONE_CAN,
					delete: [allowIfSelf],
				},
			},
		} satisfies PermissionsConfig<AuthData, ZeroSchema>
	},
)
