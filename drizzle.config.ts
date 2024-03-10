import type { Config } from 'drizzle-kit';

export default {
	schema: './src/schemas/schema.ts',
	out: './migrations',
	driver: 'pg',
	dbCredentials: {
		uri: process.env.DATABASE_URL
	},
	verbose: true,
	strict: true
} as Config;
