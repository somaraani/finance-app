import { exec } from 'child_process';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error('Missing database url in .env');
}

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

export async function migrateDb() {
	console.log('Running drizzle generation ...');
	exec('npx drizzle-kit generate:pg first', async (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);

		console.log('Start db migration...');
		await migrate(drizzle(migrationClient), { migrationsFolder: './migrations' });
		console.log('Db migration complete.');

		process.exit(0);
	});
}

migrateDb();
