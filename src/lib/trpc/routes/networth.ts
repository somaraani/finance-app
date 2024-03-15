import { NetworthService } from '$lib/server/services/networth';
import { RangesSchema } from '$lib/types';
import { t } from '../t';
import z from 'zod';

export const networthRouter = t.router({
	getData: t.procedure.input(z.object({ range: RangesSchema })).query(async ({ ctx, input }) => {
		const userId = ctx.event.locals.user.id;
		return NetworthService.getNetworthData(userId, input.range);
	})
});
