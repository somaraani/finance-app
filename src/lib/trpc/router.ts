import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { networthRouter } from './routes/networth';
import { spendingRouter } from './routes/spending';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	networth: networthRouter,
	spending: spendingRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
