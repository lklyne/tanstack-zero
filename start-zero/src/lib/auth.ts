import { authDb } from '@/db/auth-db'
import * as authSchema from '@/db/auth-schema'
import { syncUserToZero } from '@/lib/sync-user-to-zero'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt } from 'better-auth/plugins'
import { createAuthMiddleware } from 'better-auth/plugins'
import * as dotenv from 'dotenv'

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

// After the check above, we know these exist
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

	plugins: [jwt()],

	serverConfig: {
		origin,
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
			callbackUrl: '/app',
		},
	},

	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			// console.log('🔥 after‐hook fired, ctx.path=', ctx.path)
			// Runs for *all* auth endpoints
			if (
				ctx.path.startsWith('/sign-up') ||
				ctx.path.startsWith('/sign-in') ||
				ctx.path.startsWith('/callback')
			) {
				console.log('🔥 after‐hook fired, ctx.path=', ctx.path)
				const u = ctx.context.newSession?.user
				if (u) await syncUserToZero(u) // fire-and-forget
			}
		}),
	},
})
