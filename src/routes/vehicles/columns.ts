import { renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';

export type Vehicle = {
	id: string;
	title: string;
	type: number;
	plate: string;
	fuelType: number;
	ownerUnit: number;
};

export const columns: ColumnDef<Vehicle>[] = [
	{
		accessorKey: 'title',
		header: 'title',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="">${info.getValue()}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	{
		accessorKey: 'type',
		header: 'type',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="">${info.getValue()}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	{
		accessorKey: 'plate',
		header: 'plate',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="">${info.getValue()}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	{
		accessorKey: 'fuelType',
		header: 'fuelType',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="">${info.getValue()}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	{
		accessorKey: 'ownerUnit',
		header: 'ownerUnit',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="">${info.getValue()}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	{
		accessorKey: 'action',
		header: '-',
		cell: (info) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div class="space-x-2">
									<button  class="hover:text-yellow-500"
										></button
									>
									<button class="hover:text-red-500"
										></button
									>
								</div>`
			}));
			return renderSnippet(snippet);
		}
	}
];
