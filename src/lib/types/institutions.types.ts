import type { AccountBalance } from './accounts.types';

export type ConnectorTypes = 'manual' | 'questrade';

export type UserInstitute = {
	id: number;
	name: string;
	accounts: AccountBalance[];
};
