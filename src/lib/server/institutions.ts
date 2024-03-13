import type { UserInstitute } from '$lib/types/institutions.types';
import { getUserAccountBlances } from './accounts';

/**
 * Returns a list of institutions and their accounts for a user.
 * The accounts will include the most recent balance we have.
 * @param userId user id to query for
 * @returns user institutions
 */
export async function getUserInstitutions(userId: number): Promise<UserInstitute[]> {
	const userAccounts = await getUserAccountBlances(userId);
	const institutionMap: { [key: string]: UserInstitute } = {};

	userAccounts.forEach((account) => {
		const institutionId = account.institutionId;
		if (!institutionMap[institutionId]) {
			institutionMap[institutionId] = {
				id: account.institutionId,
				name: account.institutionName,
				accounts: []
			};
		}
		institutionMap[institutionId].accounts.push(account);
	});

	return Object.values(institutionMap);
}
