import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { assetsRouter } from './routers/assets';
import { spendingRouter } from './routers/spending';
import { accountsRouter } from './routers/accounts';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	accounts: accountsRouter,
	assets: assetsRouter,
	spending: spendingRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
