export type SpendingData = {
	index: number;
	current?: number;
	last?: number;
}[];

export type SpendingCategory = {
	label: string;
	value: number;
};

export type SpendingCategories = SpendingCategory[];
