export type SpendingData = {
	history: SpendingEntry[];
};

export type SpendingCategory = {
	label: string;
	value: number;
};

export type SpendingCategories = SpendingCategory[];

export type SpendingEntry = {
	date: Date;
	value: number;
};
