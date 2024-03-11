import type { NetworthData } from '$lib/types';

const data: NetworthData = {
	current: 45231.89,
	monthDelta: 1234.56,
	history: [
		{ date: new Date(2021, 0, 1), value: 40000 },
		{ date: new Date(2021, 1, 1), value: 42000 },
		{ date: new Date(2021, 2, 1), value: 43000 },
		{ date: new Date(2021, 3, 1), value: 44000 },
		{ date: new Date(2021, 4, 1), value: 45000 },
		{ date: new Date(2021, 5, 1), value: 45231.89 }
	]
};

export async function getNetworthData(userId: string) {
	return data;
}
