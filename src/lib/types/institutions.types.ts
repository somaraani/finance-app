import type { AccountBalance } from './accounts.types';

export type UserInstitute = {
	id: number;
	name: string;
	accounts: AccountBalance[];
};
