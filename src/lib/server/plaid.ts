import { PLAID_SECRET, PLAID_CLIENT_ID } from '$env/static/private';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';

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

export async function linkUserItem(userId: string, publicToken: string, metadata: any) {
	const result = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken,
		client_id: PLAID_CLIENT_ID,
		secret: PLAID_SECRET
	});

	const { access_token, item_id } = result.data;

	console.log('linkUserItem', userId, access_token, item_id);

	//TODO init accounts from metadta
	console.log(metadata);
}
