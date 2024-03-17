import type { Ranges } from '$lib/types';

export function getDatesFromRange(range: Ranges) {
	if (range === 'all') return { startDate: undefined, endDate: new Date() };

	const startDate = new Date();

	switch (range) {
		case 'month':
			startDate.setMonth(new Date().getMonth() - 1);
			break;
		case 'halfYear':
			startDate.setMonth(new Date().getMonth() - 6);
			break;
		case 'year':
			startDate.setFullYear(new Date().getFullYear() - 1);
			break;
	}

	return { startDate, endDate: new Date() };
}
