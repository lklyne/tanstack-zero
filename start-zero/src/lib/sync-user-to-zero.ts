import type { AuthData } from '@/db/schema.zero'
import type { User } from 'better-auth/types' // adjust path if different
import postgres from 'postgres'

export async function syncUserToZero(user: User) {
	console.log('🔄 Syncing auth user to Zero DB:', user.id)

	const dbUrl = process.env.ZERO_UPSTREAM_DB ?? ''
	const sql = postgres(dbUrl, {
		max: 1,
		ssl: false,
		idle_timeout: 20,
	})

	try {
		// Use sql.begin for automatic transaction handling
		await sql.begin(async (tx) => {
			// Prepare user data
			const userData = {
				id: user.id,
				email: user.email ?? '', // Ensure email is not null
				name: user.name ?? '', // Ensure name is not null
			}

			// Directly execute SQL insert, checking for existence first
			// Use ON CONFLICT DO NOTHING to handle potential races or existing users
			await tx`
        INSERT INTO public.users (id, email, name)
        VALUES (${userData.id}, ${userData.email}, ${userData.name})
        ON CONFLICT (id) DO NOTHING
      `
		})

		console.log('✅ Auth user synced:', user.id)
	} catch (error) {
		console.error('❌ Auth sync failed:', user.id, error)
		throw error // Re-throw error after logging
	} finally {
		// Ensure the connection is closed
		await sql.end({ timeout: 5 })
	}
}
