import {
	boolean,
	doublePrecision,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';

// TODO change to indentity instead of serial once supported by drizzle

export const schema = pgSchema('finance');

export const users = schema.table('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	firstname: text('firstName').notNull(),
	lastname: text('lastName').notNull(),
	password: text('password').notNull()
});

export const sessions = schema.table('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const userInstitutions = schema.table('user_institutions', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name')
		.notNull(), 
	connectorMetadata: text('connector_metadata'), 
	connectorType: text('connector_type'),
});

// TODO should we retain accounts & balances when institution is unlinked?

export const accounts = schema.table('accounts', {
	id: serial('id').primaryKey(),
	institutionId: integer('institution_id')
		.notNull()
		.references(() => userInstitutions.id),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	connectorMetadata: text('connector_metadata'),
	type: text('type').notNull()
});

export const balances = schema.table('balances', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	accountId: integer('account_id')
		.notNull()
		.references(() => accounts.id, {
			onDelete: 'cascade'
		}),
	balance: doublePrecision('balance').notNull(),
	currencyCode: text('currency_code').notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull()
});

export const categories = schema.table('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const subcategories = schema.table('subcategories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	parent: integer('parent')
		.notNull()
		.references(() => categories.id),
	description: text('description').notNull()
});

export const transactions = schema.table('transactions', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	accountId: integer('account_id')
		.notNull()
		.references(() => accounts.id, {
			onDelete: 'cascade'
		}),
	amount: doublePrecision('amount').notNull(),
	currencyCode: text('currency_code'),
	timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull(),
	category: integer('category').references(() => categories.id),
	subcategory: integer('subcategory').references(() => subcategories.id),
	pending: boolean('boolean'),
	channel: text('channel').notNull(),
	iconUrl: text('icon_url')
});
