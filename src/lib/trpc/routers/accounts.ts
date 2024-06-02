import { AccountsService } from '$lib/server/services/accounts';
import { TransactionsService } from '$lib/server/services/transactions';
import { z } from 'zod';
import { t } from '../t';

export const accountsRouter = t.router({
	getAccounts: t.procedure.query(async ({ ctx }) => {
		const userId = ctx.event.locals.user.id;
		return AccountsService.getUserAccountBalances(userId);
	}),
	refresh: t.procedure.mutation(async ({ ctx }) => {
		const userId = ctx.event.locals.user.id;
		const result = await AccountsService.syncAccountBalances(userId);
		return result;
	}),
	createAccount: t.procedure
		.input(
			z.object({
				name: z.string(),
				type: z.enum(['checking', 'savings', 'credit']),
				institutionName: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.event.locals.user.id;
			await AccountsService.createAccount(
				userId,
				input.name,
				input.type,
				input.institutionName
			).catch((err) => {
				console.log(err);
			});
			return { success: true };
		})
});
