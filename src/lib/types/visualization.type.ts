export type ChartData = {
	date: Date;
	value: unknown;
};

export const ranges = {
	month: '1 Month',
	halfYear: '6 Months',
	year: '1 Year',
	all: 'All time'
};

export const rangeText = {
	month: 'in last month',
	halfYear: 'in last 6 Months',
	year: 'in last year',
	all: 'all time'
};

export type Ranges = keyof typeof ranges;
