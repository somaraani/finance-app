import { PLAID_CLIENT_ID, PLAID_SECRET } from '$env/static/private';
import type { PlaidLinkMetadata } from '$lib/types';
import { generateId } from 'lucia';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { accounts, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { and, eq } from 'drizzle-orm';

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

export async function createLinkToken(userId: string) {
	const result = await plaidClient.linkTokenCreate({
		user: {
			client_user_id: userId
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

export async function unlinkItem(userId: string, institutionId: string) {
	const [{ accessToken }] = await db
		.select()
		.from(userInstitutions)
		.where(
			and(eq(userInstitutions.userId, userId), eq(userInstitutions.institutionId, institutionId))
		);

	const result = await plaidClient.itemRemove({
		access_token: accessToken
	});

	if (result.status === 200) {
		await db
			.delete(userInstitutions)
			.where(
				and(eq(userInstitutions.userId, userId), eq(userInstitutions.institutionId, institutionId))
			);
	}

	return result.status === 200 ? true : false;
}

export async function linkUserItem(
	userId: string,
	publicToken: string,
	metadata: PlaidLinkMetadata
) {
	const result = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken
	});

	const { access_token, item_id } = result.data;

	// check if institution exists, if not add it
	const [institution] = await db
		.select()
		.from(instituations)
		.where(eq(instituations.id, metadata.institution.institution_id));

	if (!institution) {
		await db.insert(instituations).values({
			id: metadata.institution.institution_id,
			name: metadata.institution.name
		});
	}

	await db.insert(userInstitutions).values({
		id: generateId(15),
		accessToken: access_token,
		institutionId: metadata.institution.institution_id,
		itemId: item_id,
		userId
	});

	await db.insert(accounts).values(
		metadata.accounts.map((account) => ({
			userId,
			id: generateId(15),
			institutionId: metadata.institution.institution_id,
			name: account.name,
			type: account.type,
			subtype: account.subtype,
			plaidAccountId: account.id
		}))
	);

	console.log(`user ${userId} linked to account ${metadata.institution.name}`);
}
