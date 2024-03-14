<script lang="ts">
	import { createTransactionsTable } from '$lib/components/app/transactions/table/createTransactionsTable.js';
	import * as Table from '$lib/components/ui/table';
	import { Render, Subscribe } from 'svelte-headless-table';
	import { writable } from 'svelte/store';

	export let data;

	// Updates the table when our data changes
	const transactions = writable(data.transactions);
	$: transactions.set(data.transactions);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		createTransactionsTable(transactions);
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Transactions</h2>
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									{#if cell.id === 'amount'}
										<div class="text-right font-medium">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'status'}
										<div class="capitalize">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'account'}
										<Render of={cell.render()} />
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
