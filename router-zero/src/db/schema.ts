import { pgTable, varchar } from 'drizzle-orm/pg-core'

// Collection of related data to a workspace aka project
export const persons = pgTable('persons', {
	id: varchar('id').primaryKey(),
	name: varchar('name').notNull(),
})
