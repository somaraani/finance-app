import csv from 'csv-parser';
import { Readable } from 'stream';
import { AccountsService } from './accounts';
import type { AccountMedata, AccountType } from '$lib/types';
import { UsersService } from './users';

export class ImportService {
	static async getAccountsFromCSV(files: { name: string; content: string }[]): Promise<string[]> {
		const accountNamesSet = new Set<string>();

		for (const file of files) {
			const { content } = file; // No need to decode from base64
			const stream = Readable.from(content);
			await new Promise((resolve, reject) => {
				stream
					.pipe(csv())
					.on('data', (data) => {
						accountNamesSet.add(data['Account Name']?.trim());
					})
					.on('end', resolve)
					.on('error', (error) => {
						console.error(error); // Log the error
						reject(error);
					});
			});
		}

		return Array.from(accountNamesSet);
	}

	static getAccountTypeFromName(name: string): AccountType | undefined {
		const typeMapping: { [key in AccountType]: string[] } = {
			investment: ['rrsp'],
			checking: ['checking', 'chequing'],
			savings: ['savings'],
			credit: ['credit', 'visa', 'american express'],
			loan: ['loan', 'property']
		};

		let type: AccountType | undefined;
		const lowerCaseName = name.toLowerCase();

		for (const accountType in typeMapping) {
			if (
				typeMapping[accountType as AccountType].some((keyword) => lowerCaseName.includes(keyword))
			) {
				type = accountType as AccountType;
				break;
			}
		}

		return type;
	}

	static async importBalances(userId: number, files: { name: string; content: string }[]) {
		const userAccounts = await AccountsService.getUserAccounts(userId);
		const userCurrency = await UsersService.getUserCurrency(userId);

		for (const file of files) {
			const { content, name } = file;

			const parts = name.split('-');

			const accountName = parts[0].trim();
			const institutionName = parts[1].replace('.csv', '').trim();

			let account: AccountMedata | undefined = userAccounts.find(
				(account) => account.name === accountName && account.institutionName === institutionName
			);

			if (!account) {
				const institution = await AccountsService.getOrCreateUserInstitution(
					userId,
					institutionName
				);
				account = await AccountsService.createAccount(
					userId,
					institution.id,
					accountName,
					ImportService.getAccountTypeFromName(accountName) ||
						ImportService.getAccountTypeFromName(institutionName) ||
						'investment',
					userCurrency
				);
			}

			const stream = Readable.from(content);
			const balances: { balance: number; date: Date }[] = [];
			await new Promise((resolve, reject) => {
				stream
					.pipe(csv())
					.on('data', (data) => {
						const b = data['Amount'];
						if (b) {
							balances.push({
								balance: parseFloat(b),
								date: new Date(data['Date'])
							});
						}
					})
					.on('end', resolve)
					.on('error', (error) => {
						console.error(error);
						reject(error);
					});
			});

			await AccountsService.createAccountBalances(userId, account.id, balances);
		}
	}
}
