// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from '$lib/types/users.types';

// Use number user ids
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
	}
}

declare global {
	namespace App {
		interface Locals {
			user: User;
			session: import('lucia').Session | null;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
