import { pgSchema, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const schema = pgSchema('finance');

export const users = schema.table('users', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	firstname: varchar('firstName', { length: 255 }).notNull(),
	lastname: varchar('lastName', { length: 255 }).notNull(),
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

export const userInstitutions = schema.table('user_institutions', {
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	institutionId: text('institution_id').notNull(),
	accessToken: text('access_token').notNull(),
	itemId: text('item_id').notNull()
});

export const instituations = schema.table('institutions', {
	id: text('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	logo: text('logo')
});

export const accounts = schema.table('accounts', {
	id: text('id').primaryKey(),
	institutionId: text('institution_id').notNull(),
	userId: text('user_id').notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	subtype: varchar('subtype', { length: 255 }).notNull(),
	plaidAccountId: text('account_id').notNull().unique()
});
