<script lang="ts">
	import { browser } from '$app/environment';
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { ChartData, NetworthData, Ranges } from '$lib/types';
	import { onMount } from 'svelte';

	let range: Ranges = 'month';
	let loading = false;
	let error: string | undefined;

	let data: NetworthData = [];

	$: if (browser) getData(range);
	onMount(() => getData(range));

	const getData = async (range: Ranges) => {
		loading = true;
		const result = await fetch('/api/networth?range=' + range);
		const response = await result.json();
		if (response && result.status === 200) {
			data = (response as NetworthData).map(({ date, value }) => ({
				date: new Date(date),
				value
			}));
		} else {
			error = 'Failed to load data';
		}
		loading = false;
	};

	const y = [(row: ChartData) => row.value];
</script>

<ChartCard {data} title="Networth" {y} />
