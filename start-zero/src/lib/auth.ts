import { authDb } from '@/db/auth-db'
import * as authSchema from '@/db/auth-schema'
import { deleteUserFromZero } from '@/lib/delete-user-from-zero'
import { sql } from '@/routes/api/push'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt } from 'better-auth/plugins'
import { createAuthMiddleware } from 'better-auth/plugins'
import type { User } from 'better-auth/types'
import * as dotenv from 'dotenv'
import type { TransactionSql } from 'postgres'

dotenv.config()

const requiredEnvVars = [
	'AUTH_DATABASE_URL',
	'BETTER_AUTH_SECRET',
	'BETTER_AUTH_URL',
] as const

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`)
	}
}

const secret = process.env.BETTER_AUTH_SECRET
const origin = process.env.BETTER_AUTH_URL

if (!secret || !origin) {
	throw new Error('Required environment variables are not set')
}

export const auth = betterAuth({
	secret,

	basePath: '/api/auth',
	database: drizzleAdapter(authDb, {
		schema: authSchema,
		provider: 'pg',
	}),

	plugins: [
		jwt({
			jwt: {
				expirationTime: '1w',
			},
		}),
	],

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
		},
	},

	emailAndPassword: {
		enabled: true,
		minPasswordLength: 2,
		autoSignIn: true,
	},

	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},

	// to do: add additional verification step during delete flow
	// https://www.better-auth.com/docs/concepts/users-accounts#adding-verification-before-deletion

	user: {
		deleteUser: {
			enabled: true,
			beforeDelete: async (user) => {
				// Delete user data from Zero before removing auth record
				await deleteUserFromZero(user.id)
			},
		},
	},

	hooks: {
		// middleware to sync user to Zero after sign-in
		after: createAuthMiddleware(async (ctx) => {
			const returned = ctx.context.returned as { user?: User }
			const u = returned.user
			if (!u) return

			console.log('🟦 🟦 🟦after hook runs')

			// Skip the processor.process() complexity
			try {
				// Get a database connection
				if (!sql) {
					console.error('Database client not initialized')
					return
				}

				// Use SQL transaction directly
				await sql.begin(async (tx: TransactionSql<Record<string, unknown>>) => {
					// Direct SQL upsert instead of using server transaction
					await tx`
						INSERT INTO users (id, email, name)
						VALUES (${u.id}, ${u.email ?? ''}, ${u.name ?? ''})
						ON CONFLICT (id) DO NOTHING
					`
				})

				console.log('✅ User synced to Zero DB:', u.id)
			} catch (error) {
				console.error('Failed to sync user to Zero:', error)
			}
		}),
	},
})
