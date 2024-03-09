<script>
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';

	const data = [
		{ id: 1, average: 400, today: 240 },
		{ id: 2, average: 300, today: 139 },
		{ id: 3, average: 200, today: 980 },
		{ id: 4, average: 278, today: 390 },
		{ id: 5, average: 189, today: 480 },
		{ id: 6, average: 239, today: 380 },
		{ id: 7, average: 349, today: 430 }
	];

	const networth = 4215.64;
	const delta = 13;
</script>

<ChartCard
	title="Spending"
	value={networth}
	{delta}
	{data}
	x={(row) => row.id}
	y={[(row) => row.today, (row) => row.average]}
/>
