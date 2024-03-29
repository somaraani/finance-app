import type { AccountSubtype, AccountType } from 'plaid';

export type AccountMedata = {
	id: number;
	name: string;
	type: AccountType;
	subtype: AccountSubtype | null;
	institutionId: number;
	institutionName: string;
};

export type AccountBalance = AccountMedata & {
	balance: number | null;
	lastUpdated: Date | null;
};
