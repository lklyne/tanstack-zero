import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'

// These are just the basic schema tables needed for Better Auth
// The actual schema will be created by the Better Auth CLI

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').default(false),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
})

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata')
})

export const verificationTokens = pgTable('verification_tokens', {
  id: serial('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// This is a placeholder - the Better Auth CLI will generate the actual schema 