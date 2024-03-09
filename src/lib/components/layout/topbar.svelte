<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';
	import Separator from '../ui/separator/separator.svelte';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
</script>

<div class="flex h-16 w-full items-center px-4 py-3">
	<DollarSign class="text-primary" />
	<h1 class="font-semibold">Finance App</h1>
	<Separator orientation="vertical" class="m-5" />

	<div class="space-x-4 lg:space-x-6">
		<a href="/dashboard" class="text-sm font-medium transition-colors hover:text-primary">
			Dashboard
		</a>

		<a
			href="/examples/dashboard"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Transactions
		</a>
		<a
			href="/examples/dashboard"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Settings
		</a>
	</div>

	<Button on:click={toggleMode} class="ml-auto" variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
