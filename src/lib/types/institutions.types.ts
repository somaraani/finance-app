import type { Account } from './accounts.types';

export type UserInstitute = {
	id: number;
	name: string;
	accounts: Account[];
};
