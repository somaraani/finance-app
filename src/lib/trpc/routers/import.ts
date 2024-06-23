import { ImportService } from '$lib/server/services/import';
import { t } from '../t';
import z from 'zod';

export const importsRouter = t.router({
	verifyFiles: t.procedure
		.input(
			z.object({
				files: z
					.object({
						name: z.string(),
						content: z.string()
					})
					.array()
			})
		)
		.mutation(async ({ input }) => {
			console.log('mutating');
			return ImportService.getAccountsFromCSV(input.files);
		}),
	balances: t.procedure
		.input(
			z.object({
				files: z
					.object({
						name: z.string(),
						content: z.string()
					})
					.array()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.event.locals.user.id;
			return ImportService.importBalances(userId, input.files);
		})
});
