import { AssetsService } from '$lib/server/services/assets';
import { RangesSchema } from '$lib/types';
import { t } from '../t';
import z from 'zod';

export const assetsRouter = t.router({
	getData: t.procedure.input(z.object({ range: RangesSchema })).query(async ({ ctx, input }) => {
		const userId = ctx.event.locals.user.id;
		return AssetsService.getNetworthData(userId, input.range);
	}),
	getTimeline: t.procedure
		.input(z.object({ range: RangesSchema }))
		.query(async ({ ctx, input }) => {
			const userId = ctx.event.locals.user.id;
			return AssetsService.getAssetTimeline(userId, input.range);
		})
});
