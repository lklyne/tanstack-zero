import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './auth-schema-generated'

// Environment variables
const connectionString = process.env.BETTER_AUTH_DATABASE

// Create a postgres client with the connection string
const client = postgres(connectionString as string)

// Create a drizzle instance using the postgres client
export const authDb = drizzle(client, { schema }) 