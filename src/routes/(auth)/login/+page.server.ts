import { db } from '$lib/server/db';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { users } from '../../../schemas/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { message: 'Missing required fields' });
		}

		const [user] = await db.select().from(users).where(eq(users.username, username));

		//TODO protect against bruteforce attacks
		if (!user) {
			return fail(400, { username, invalidCredentials: true });
		}

		const validPassword = await new Argon2id().verify(user.password, password);
		if (!validPassword) {
			return fail(400, { username, invalidCredentials: true });
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
} satisfies Actions;
