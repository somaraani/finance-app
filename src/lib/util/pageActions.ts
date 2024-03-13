import { deserialize } from '$app/forms';

export async function pageAction<ResponseType>(
	first?: string | object,
	body?: object
): Promise<ResponseType | undefined> {
	const path = typeof first === 'string' ? first : location.pathname;
	const requestBody = typeof first === 'object' ? first : body;

	const response = await fetch(path, {
		method: 'POST',
		body: JSON.stringify(requestBody)
	});
	try {
		const result: { data?: unknown } = deserialize(await response.text()) as object;
		return result?.data as ResponseType;
	} catch (e) {
		console.error(e);
		return undefined;
	}
}
