<script lang="ts">
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { ChartData, SpendingData } from '$lib/types';

	export let data: SpendingData | undefined;
	const y = [(row: ChartData) => row.value];
</script>

{#if data?.history}
	<ChartCard rangeSelector={false} data={data.history} title="Monthly Spending" {y} />
{/if}
