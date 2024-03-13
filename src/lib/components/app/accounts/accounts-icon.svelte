<script lang="ts">
	import SavingsIcon from 'lucide-svelte/icons/piggy-bank';
	import ChequeingIcon from 'lucide-svelte/icons/banknote';
	import { AccountSubtype, type AccountType } from 'plaid';

	export let type: AccountType;
	export let subtype: AccountSubtype | null;
</script>

<div class="big-icons mr-2 text-primary">
	{#if subtype === AccountSubtype.Savings}
		<SavingsIcon size={30} />
	{:else}
		<ChequeingIcon size={30} />
	{/if}
</div>
