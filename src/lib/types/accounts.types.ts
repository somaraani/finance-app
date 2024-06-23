export type AccountMedata = {
	id: number;
	name: string;
	type: AccountType;
	institutionId: number;
	institutionName: string;
};

export type AccountBalance = AccountMedata & {
	balance: number | null;
	lastUpdated: Date | null;
};

export type AccountType = 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
