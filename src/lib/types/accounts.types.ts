import type { AccountSubtype, AccountType } from 'plaid';

export type Account = {
	name: string;
	id: string;
	balance: number | null;
	type: AccountType;
	subtype: AccountSubtype | null;
};
