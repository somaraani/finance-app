import TransactionCategory from '$lib/components/app/transactions/table/transaction-category.svelte';
import TransactionName from '$lib/components/app/transactions/table/transaction-name.svelte';
import type { Transaction } from '$lib/types/transactions.types';
import { createRender, createTable, type ReadOrWritable } from 'svelte-headless-table';

export function createTransactionsTable(data: ReadOrWritable<Transaction[]>) {
	const table = createTable(data);
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
	return table.createViewModel(columns);
}
