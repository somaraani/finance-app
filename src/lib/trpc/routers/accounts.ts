import { AccountsService } from '$lib/server/services/accounts';
import { TransactionsService } from '$lib/server/services/transactions';
import { t } from '../t';

export const accountsRouter = t.router({
	getAccounts: t.procedure.query(async ({ ctx }) => {
		const userId = ctx.event.locals.user.id;
		return AccountsService.getUserAccountBalances(userId);
	}),
	refresh: t.procedure.mutation(async ({ ctx }) => {
		const userId = ctx.event.locals.user.id;
		const result = await AccountsService.syncAccountBalances(userId);
		await TransactionsService.syncUserTransactions(userId);
		return result;
	})
});
