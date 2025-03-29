import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/auth-schema-generated.ts',
  out: './src/db/auth-migrations',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.BETTER_AUTH_DATABASE!,
  },
} satisfies Config 