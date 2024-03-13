<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import TransactionName from '$lib/components/app/transactions/table/transaction-name.svelte';
	import TransactionCategory from '$lib/components/app/transactions/table/transaction-category.svelte';

	export let data;

	const table = createTable(readable(data.transactions));
	const columns = table.createColumns([
		table.column({
			id: 'name',
			accessor: (data) => ({
				name: data.name,
				icon: data.iconUrl
			}),
			cell: ({ value }) =>
				createRender(TransactionName, {
					data: value
				}),
			header: 'Name'
		}),
		table.column({
			id: 'date',
			header: 'Date',
			accessor: 'timestamp',
			cell: ({ value }) => {
				return value.toLocaleDateString();
			}
		}),
		table.column({
			accessor: (data) => data,
			id: 'category',
			header: 'Category',
			cell: ({ value }) =>
				createRender(TransactionCategory, {
					category: value.categoryName,
					subcategory: value.subcategoryName
				})
		}),
		table.column({
			accessor: 'accountName',
			header: 'Account'
		}),
		table.column({
			accessor: 'amount',
			header: 'Amount',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(value);
				return formatted;
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
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
