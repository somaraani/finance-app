import type { Ranges } from '$lib/types';
import type { Transaction } from '$lib/types/transactions.types';

export class TransactionsService {
	static async getUserTransactions(
		userId: number,
		options?: {
			/**
			 * Date to start on
			 */

			startDate?: Date;

			/**
			 * Date to end on
			 */
			endDate?: Date;

			/**
			 * Range to set, instead of start and end date
			 */
			range?: Ranges;

			/**
			 * The order to return in. Desc is most recent first.
			 */
			order?: 'asc' | 'desc';
		}
	): Promise<Transaction[]> {
		return [];
	}
}
