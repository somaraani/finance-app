export type SpendingData = {
	history: SpendingEntry[];
	current: number;
	monthDelta: number;
};

export type SpendingEntry = {
	date: Date;
	value: number;
};
