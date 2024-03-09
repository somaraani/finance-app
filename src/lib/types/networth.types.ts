export type NetworthData = {
	history: NetworthEntry[];
	current: number;
	monthDelta: number;
};

export type NetworthEntry = {
	date: Date;
	value: number;
};
