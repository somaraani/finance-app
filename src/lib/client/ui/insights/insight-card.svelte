<script lang="ts">
	import { formatMoney } from '$lib/util';
	import * as Card from '../card';
	import { cn } from '../utils.js';

	export let title: string;
	export let current: number;
	export let text: string | undefined = undefined;
	export let textClass: string | undefined = undefined;
	export let loading = false;
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{title}</Card.Title>
		<slot name="filters" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{formatMoney(current)}</div>
		<p class={cn('mt-2 text-sm', textClass)}>{text}</p>
		<slot />
	</Card.Content>
</Card.Root>
