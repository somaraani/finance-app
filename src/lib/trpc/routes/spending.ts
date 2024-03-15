import { SpendingService } from '$lib/server/services/spending';
import { RangesSchema } from '$lib/types';
import { t } from '../t';
import z from 'zod';

export const spendingRouter = t.router({
	getCategories: t.procedure
		.input(z.object({ range: RangesSchema }))
		.query(async ({ ctx, input }) => {
			const userId = ctx.event.locals.user.id;
			return SpendingService.getSpendingCategories(userId, input.range);
		})
});
