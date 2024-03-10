import { db } from '$lib/server/db';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { users } from '../../schemas/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';
import { generateId } from 'lucia';

type LoginEvent = {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const firstName = data.get('firstname')?.toString();
		const lastName = data.get('lastname')?.toString();

		if (!username || !password || !firstName || !lastName) {
			return fail(400, { message: 'Missing required fields' });
		}

		const user = await db.select().from(users).where(eq(users.username, username));

		if (user.length) {
			return fail(400, { usernameExists: true });
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);

		await db.insert(users).values({
			id: userId,
			password: hashedPassword,
			username,
			firstName,
			lastName
		});

		console.log('Created new user', userId, username, firstName, lastName);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
} satisfies Actions<LoginEvent>;
