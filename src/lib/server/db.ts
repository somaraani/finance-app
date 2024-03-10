import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../../schemas/schema';

// for migrations
const migrationClient = postgres(DATABASE_URL, { max: 1 });
export async function migrateDb() {
	console.log('Start db migration...');
	await migrate(drizzle(migrationClient), { migrationsFolder: './migrations' });
	console.log('Db migration complete.');
}

// for query purposes
const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });
