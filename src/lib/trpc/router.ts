import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { networthRouter } from './routers/networth';
import { spendingRouter } from './routers/spending';
import { accountsRouter } from './routers/accounts';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	accounts: accountsRouter,
	networth: networthRouter,
	spending: spendingRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
