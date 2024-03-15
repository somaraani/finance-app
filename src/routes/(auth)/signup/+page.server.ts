import { db } from '$lib/server/util/db';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { users } from '../../../schemas/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/util/auth';
import { logger } from '$lib/util/logs';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const firstname = data.get('firstname')?.toString();
		const lastname = data.get('lastname')?.toString();

		if (!username || !password || !firstname || !lastname) {
			return fail(400, { message: 'Missing required fields' });
		}

		const existingUser = await db.select().from(users).where(eq(users.username, username));
		if (existingUser.length) {
			return fail(400, { usernameExists: true });
		}

		const hashedPassword = await new Argon2id().hash(password);

		const [user] = await db
			.insert(users)
			.values({
				password: hashedPassword,
				username,
				firstname,
				lastname
			})
			.returning();

		logger.info('Created new user', username, firstname, lastname);

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
} satisfies Actions;
