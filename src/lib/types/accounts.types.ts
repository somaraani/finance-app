import type { AccountSubtype, AccountType } from 'plaid';

export type Account = {
	name: string;
	id: string;
	balance: number | null;
	lastUpdated: Date | null;
	type: AccountType;
	subtype: AccountSubtype | null;
	institutionName?: string;
};
