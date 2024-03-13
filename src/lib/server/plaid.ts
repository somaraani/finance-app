import { PLAID_CLIENT_ID, PLAID_SECRET } from '$env/static/private';
import type { PlaidLinkMetadata } from '$lib/types';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { accounts, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { and, eq } from 'drizzle-orm';
import { updateAccountBalances } from './accounts';

const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET
		}
	}
});

export const plaidClient = new PlaidApi(configuration);

export async function createLinkToken(userId: number) {
	const result = await plaidClient.linkTokenCreate({
		user: {
			client_user_id: userId.toString()
		},
		client_id: PLAID_CLIENT_ID,
		secret: PLAID_SECRET,
		client_name: 'Finance App',
		products: [Products.Auth, Products.Transactions],
		country_codes: [CountryCode.Ca, CountryCode.Us],
		language: 'en'
	});

	return result.data;
}

export async function unlinkItem(userId: number, institutionId: number) {
	const [{ accessToken }] = await db
		.select()
		.from(userInstitutions)
		.where(
			and(eq(userInstitutions.userId, userId), eq(userInstitutions.institutionId, institutionId))
		);

	const result = await plaidClient.itemRemove({
		access_token: accessToken
	});

	// TODO what to do with balances and transactions when account is unlinked?

	if (result.status === 200) {
		await db
			.delete(userInstitutions)
			.where(
				and(eq(userInstitutions.userId, userId), eq(userInstitutions.institutionId, institutionId))
			);

		await db
			.delete(accounts)
			.where(and(eq(accounts.userId, userId), eq(accounts.institutionId, institutionId)));
	}

	return result.status === 200 ? { success: true } : { success: false, error: result.data };
}

export async function linkUserItem(
	userId: number,
	publicToken: string,
	metadata: PlaidLinkMetadata
) {
	const result = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken
	});

	if (result.status !== 200) {
		return { success: false, error: result.data };
	}

	const { access_token, item_id } = result.data;

	// check if institution exists, if not add it
	let [institution] = await db
		.select()
		.from(instituations)
		.where(eq(instituations.plaidId, metadata.institution.institution_id));

	if (!institution) {
		[institution] = await db
			.insert(instituations)
			.values({
				plaidId: metadata.institution.institution_id,
				name: metadata.institution.name
			})
			.returning();
	}

	await db.insert(userInstitutions).values({
		userId,
		accessToken: access_token,
		institutionId: institution.id,
		itemId: item_id
	});

	// get persistant account ids and initial balances
	const accountsResponse = await plaidClient.accountsBalanceGet({
		access_token: access_token
	});

	await db.insert(accounts).values(
		accountsResponse.data.accounts.map((account) => ({
			userId,
			institutionId: institution.id,
			name: account.name,
			type: account.type,
			subtype: account.subtype as string,
			plaidAccountId: account.account_id,
			plaidPersistantAccountId: account.persistent_account_id
		}))
	);

	await updateAccountBalances(userId);

	console.log(`user ${userId} linked to account ${metadata.institution.name}`);
	return { success: true };
}
