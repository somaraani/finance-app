import type { SpendingData } from '$lib/types';

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const data: SpendingData = {
	current: 4214.32,
	monthDelta: 123.45,
	history: []
};

const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
	data.history.push({
		date: new Date(d),
		value: getRandomInt(100, 500)
	});
}

export function getSpendingTimeline(userId: string) {
	return data;
}
