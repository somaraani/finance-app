import type { AccountMedata } from '.';

export type NetworthData = {
	currency: string;
	data: {
		date: Date;
		value: number;
	}[];
};

export type AccountHistory = {
	currency: string;
	accounts: AccountMedata[];
	history: {
		date: Date;
		value: number[];
	}[];
};
