export type AccountMedata = {
	id: number;
	name: string;
	type: AccountType;
	institutionId: number;
	institutionName: string;
	currencyCode: string;
};

export type AccountBalance = AccountMedata & {
	balance: { value: number; currency: string };
	convertedBalance: { value: number; currency: string };
	lastUpdated: Date | null;
};

export type AccountType = 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
