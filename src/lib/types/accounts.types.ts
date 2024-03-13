import type { AccountSubtype, AccountType } from 'plaid';

export type Account = {
	name: string;
	id: number;
	balance: number | null;
	lastUpdated: Date | null;
	type: AccountType;
	subtype: AccountSubtype | null;
	institutionName: string;
	institutionId: number;
};
