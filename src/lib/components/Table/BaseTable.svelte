<!-- let columns =  [{
   accessorKey: "startDateTime",
   header: <span>تاریخ گزارش</span>,
   cell: (info) => <div>{info}</div>,
 }] -->

<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

	interface columnType {
		accessorKey: string;
		header: HTMLElement;
		cell: () => unknown;
	}

	let { title, columns, data }: { title: string; columns: columnType[]; data: any[] } = $props();
</script>

<Table.Root>
	<Table.Caption>{title}</Table.Caption>
	<Table.Header>
		<Table.Row>
			{#each columns as col (col)}
				<Table.Head>{col.header}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as dataObj, iOjb (dataObj)}
			<Table.Row>
				{#each dataObj as obj, index (obj)}
					{@const column = columns[index]}
					{@const item = obj?.[column.accessorKey]}
					<Table.Cell>{item}</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
	<!-- <Table.Footer>
		<Table.Row>
			<Table.Cell colspan={3}>Total</Table.Cell>
			<Table.Cell class="text-right">$2,500.00</Table.Cell>
		</Table.Row>
	</Table.Footer> -->
</Table.Root>
