import { AccountsService } from '../services/accounts';

export abstract class Connector {
	protected userId: number;
	protected institutionId?: number;

	constructor(userId: number, institutionId?: number) {
		this.userId = userId;
		this.institutionId = institutionId;
	}

	abstract initialize(metadata: any): Promise<void>;
	abstract updateAccountBalances(): Promise<void>;
}
