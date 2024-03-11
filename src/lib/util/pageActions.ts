import { deserialize } from '$app/forms';

export async function pageAction<ResponseType>(
	path: string,
	body: object
): Promise<ResponseType | undefined> {
	const response = await fetch(path, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	const result: { data?: unknown } = deserialize(await response.text()) as object;
	return result?.data as ResponseType;
}
