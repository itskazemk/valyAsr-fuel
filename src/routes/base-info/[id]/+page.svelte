<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();
</script>

<Table.Root class="text-center">
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-center">ردیف</Table.Head>
			<Table.Head class="text-center">عنوان</Table.Head>
			<Table.Head class="text-center">فعال</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.baseInfos as baseInfo, i (baseInfo)}
			<Table.Row>
				<Table.Cell>{i + 1}</Table.Cell>
				<Table.Cell>{baseInfo.title}</Table.Cell>
				<Table.Cell>{!baseInfo.disabled}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
