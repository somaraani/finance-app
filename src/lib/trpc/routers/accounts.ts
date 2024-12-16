import { AccountsService } from '$lib/server/services/accounts';
import { ConnectorsService, type ConnectorType } from '$lib/server/services/connectors';
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
	connectToInstitution: t.procedure
		.input(
			z.object({
				connector: z.string(),
				metadata: z.any()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.event.locals.user.id;
			await ConnectorsService.initializeConnector(
				userId,
				input.connector as ConnectorType,
				input.metadata
			);
			return { success: true };
		}),
	createAccount: t.procedure
		.input(
			z.object({
				name: z.string(),
				type: z.enum(['checking', 'savings', 'credit']),
				institutionName: z.string(),
				currencyCode: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.event.locals.user.id;
			const institution = await AccountsService.getOrCreateUserInstitution(
				userId,
				input.institutionName
			);
			await AccountsService.createAccount(
				userId,
				institution.id,
				input.name,
				input.type,
				input.currencyCode
			).catch((err) => {
				console.log(err);
			});
			return { success: true };
		})
});
