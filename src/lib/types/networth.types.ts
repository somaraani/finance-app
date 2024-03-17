import type { AccountMedata } from '.';

export type NetworthData = {
	date: Date;
	value: number;
}[];

export type AccountHistory = {
	accounts: AccountMedata[];
	history: {
		date: Date;
		value: number[];
	}[];
};
