<script lang="ts">
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { SpendingData, SpendingEntry } from '$lib/types';

	export let data: SpendingData;

	const x = (row: SpendingEntry) => row.date.getTime();
	const y = [(row: SpendingEntry) => row.value];
</script>

<ChartCard
	title="Spending"
	data={data.history}
	value={data.current}
	delta={data.monthDelta}
	{x}
	{y}
/>
