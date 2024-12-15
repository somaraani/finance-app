import { userInstitutions } from '../../../schemas/schema';
import { AccountsService } from '../services/accounts';
import { db } from '../util/db';
import { Connector } from './abstract';

export class QuestradeConnector extends Connector {
	private apiServerUrl: string = '';
	private accessToken: string = '';

	private async authenticate(refreshToken: string): Promise<string> {
		const response = await fetch(
			`https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}`
		);
		const data = await response.json().catch(console.error);
		this.apiServerUrl = data.api_server;
		this.accessToken = data.access_token;
		return data.refresh_token;
	}

	async updateAccountBalances(): Promise<void> {
		await this.connect();

		//get all accounts for this insitution
		const accounts = await AccountsService.getInstitutionAccounts(this.userId, this.institutionId!);

		//get all account balances
		for (const account of accounts) {
			const accountNumber = JSON.parse(account.connectorMetadata ?? '{}').accountNumber;
			if (!accountNumber) continue;
			const response = await fetch(`${this.apiServerUrl}v1/accounts/${accountNumber}/balances`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});
			const data = await response.json();
			const balance = data.perCurrencyBalances.find((b: any) => b.currency === 'CAD'); // TODO, multiple currencies
			await AccountsService.createAccountBalance(
				this.userId,
				account.id,
				balance.totalEquity,
				new Date()
			);
		}
	}

	async connect() {
		if (!this.userId || !this.institutionId) {
			throw new Error('User ID or institution ID not set');
		}

		const institution = await AccountsService.getInstitutionById(this.userId, this.institutionId);
		if (!institution) {
			throw new Error('User institution not found');
		}

		const institutionMetadata = JSON.parse(institution.connectorMetadata || '{}');
		const refreshToken = await this.authenticate(institutionMetadata?.refreshToken);

		// update refresh token
		await AccountsService.updateInstitutionMetadata(this.institutionId, { refreshToken });

		if (!this.accessToken) {
			throw new Error('Access token not set');
		}
	}

	async initialize(metadata: any) {
		const refreshToken = await this.authenticate(metadata.apiKey);

		if (this.institutionId) {
			throw new Error('Institution ID already set');
		}

		const institution = await AccountsService.createInstitution(
			this.userId,
			'Questrade',
			'questrade',
			{ refreshToken }
		);

		// get accounts
		const accounts = await this.getAccounts();
		for (const account of accounts) {
			await AccountsService.createAccount(this.userId, institution.id, account.type, 'investment', {
				accountNumber: account.number
			});
		}
	}

	// Method to fetch accounts
	private async getAccounts(): Promise<any> {
		const response = await fetch(`${this.apiServerUrl}v1/accounts`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.accessToken}`
			}
		});
		const data = await response.json();
		return data.accounts;
	}
}
