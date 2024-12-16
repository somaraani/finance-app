import { db } from '../util/db';
import { users } from '../../../schemas/schema';
import { eq } from 'drizzle-orm';

export class UsersService {
	static async getUserCurrency(userId: number): Promise<string | undefined> {
		const result = await db
			.select({ currency: users.currency })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (result.length === 0) {
			return 'CAD';
		}

		return result[0].currency;
	}

	static async setUserCurrency(userId: number, currency: string): Promise<void> {
		await db.update(users).set({ currency }).where(eq(users.id, userId));
	}
}
