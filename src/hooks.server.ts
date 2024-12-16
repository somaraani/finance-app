// src/hooks.server.ts
import { lucia } from '$lib/server/util/auth';
import { db } from '$lib/server/util/db';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { eq } from 'drizzle-orm';
import { createTRPCHandle } from 'trpc-sveltekit';
import { users } from './schemas/schema';

const unProtectedRoutes = ['/signup', '/login'];

const authHandle: Handle = async ({ event, resolve }) => {
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
			lastname: users.lastname,
			currency: users.currency
		})
		.from(users)
		.where(eq(users.id, user.id));

	event.locals.user = dbUser;
	event.locals.session = session;
	return resolve(event);
};

const trpcHandle: Handle = createTRPCHandle({ router, createContext });

export const handle = sequence(authHandle, trpcHandle);
