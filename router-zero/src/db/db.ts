import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export async function createDb(
	database_url: string,
	schema: Record<string, unknown>,
) {
	const pool = new Pool({
		connectionString: database_url,
	})
	return drizzle(pool, {
		schema: schema,
	})
}
