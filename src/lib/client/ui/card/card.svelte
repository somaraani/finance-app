<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/client/ui/utils.js.js';

	type $$Props = HTMLAttributes<HTMLDivElement> & { clickable?: boolean };

	let className: $$Props['class'] = undefined;
	let clickable = false;

	export { className as class, clickable };
</script>

<div
	class={cn(
		'rounded-lg border bg-card text-card-foreground shadow-sm',
		clickable ? 'cursor-pointer duration-150 hover:bg-secondary' : '',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
