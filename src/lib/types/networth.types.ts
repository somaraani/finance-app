export type NetworthData = {
	history: Map<number, number>;
	current: number;
	delta: number;
	deltaSince: Date;
};

export type NetworthEntry = {
	date: Date;
	value: number;
};
