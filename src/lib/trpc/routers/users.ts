import { UsersService } from '$lib/server/services/users';
import { z } from 'zod';
import { t } from '../t';

export const usersRouter = t.router({
  getUserCurrency: t.procedure.query(async ({ ctx }) => {
    const userId = ctx.event.locals.user.id;
    return UsersService.getUserCurrency(userId);
  }),
  setUserCurrency: t.procedure
    .input(
      z.object({
        currency: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.event.locals.user.id;
      await UsersService.setUserCurrency(userId, input.currency);
      return { success: true };
    })
});
