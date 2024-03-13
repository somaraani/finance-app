// src/hooks.server.ts
import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { db, migrateDb } from '$lib/server/db';
import { building } from '$app/environment';
import { users } from './schemas/schema';
import { eq } from 'drizzle-orm';

// Runs on app startup
if (!building) {
	// Run Migration when server starts
	migrateDb();
}

const unProtectedRoutes = ['/signup', '/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null!;
		event.locals.session = null;

		if (!unProtectedRoutes.includes(event.url.pathname)) {
			redirect(303, '/login');
		}

		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	//TODO , what is this situation and how to handle
	if (!user) {
		redirect(303, '/login');
	}

	const [dbUser] = await db
		.select({
			id: users.id,
			username: users.username,
			firstname: users.firstname,
			lastname: users.lastname
		})
		.from(users)
		.where(eq(users.id, user.id));

	event.locals.user = dbUser;
	event.locals.session = session;
	return resolve(event);
};
