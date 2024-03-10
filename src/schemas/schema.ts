import { pgSchema, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const schema = pgSchema('finance');

export const users = schema.table('users', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	firstName: varchar('firstName', { length: 255 }).notNull(),
	lastName: varchar('lastName', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull()
});

export const sessions = schema.table('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
