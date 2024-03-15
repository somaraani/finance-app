import { z } from 'zod';

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

export const RangesSchema = z.enum(['month', 'halfYear', 'year', 'all']);

export const rangeText: { [key: string]: string } = {
	month: 'in last month',
	halfYear: 'in last 6 Months',
	year: 'in last year',
	all: 'all time'
};

export type Ranges = keyof typeof ranges;
