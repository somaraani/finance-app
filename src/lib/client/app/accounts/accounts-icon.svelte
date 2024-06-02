<script lang="ts">
	import SavingsIcon from 'lucide-svelte/icons/piggy-bank';
	import ChequeingIcon from 'lucide-svelte/icons/banknote';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import type { AccountType } from '$lib/types';

	export let type: AccountType;
</script>

<div class="big-icons mr-2 text-primary">
	{#if type === 'savings'}
		<SavingsIcon size={30} />
	{:else if type === 'credit'}
		<CreditCardIcon size={30} />
	{:else}
		<ChequeingIcon size={30} />
	{/if}
</div>
