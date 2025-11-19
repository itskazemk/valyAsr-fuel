<script lang="ts">
	import { enhance } from '$app/forms';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { getBaseInfo } from './baseInfos.remote.js';
	import { Pen, Trash } from '@lucide/svelte';

	let { data } = $props();
	let selectedOption = $state(null);

	let valuesOfSelectedOption = $derived.by(() => {
		if (selectedOption) {
			return getBaseInfo(selectedOption);
		} else {
			return [];
		}
	});

	$inspect(111, valuesOfSelectedOption);
</script>

قیمت سوخت تحویل گیرنده تحویل دهنده واحد‌ها

<div>
	<Card.Root class="h-[48em]">
		<Card.Header>اطلاعات پایه</Card.Header>
		<Card.Content class="h-full">
			<div class="flex gap-2">
				<form action="?/create" method="POST" use:enhance class="gap-2">
					<div class="hidden w-full max-w-sm flex-col gap-1.5">
						<Label for="id">id</Label>
						<Input type="text" id="id" name="id" />
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label>مورد</Label>
						<Combobox
							name="subId"
							bind:value={selectedOption}
							options={(await getBaseInfo(null)).map((item) => {
								return { label: item.title, value: item.id };
							})}
						/>

						<!-- <select bind:value={selectedOption}>
							<option selected={true}></option>
							{#each await getBaseInfo(null) as option}
								<option value={option.id}>{option.title}</option>
							{/each}
						</select> -->
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="title">عنوان</Label>
						<Input type="text" id="title" name="title" required={true} />
					</div>

					<Button class="w-1/5 min-w-16 cursor-pointer" type="submit">ثبت</Button>
				</form>

				<Table.Root class="text-center">
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-center">ردیف</Table.Head>
							<Table.Head class="text-center">عنوان</Table.Head>
							<Table.Head class="text-center">فعال غیر فعال</Table.Head>
							<Table.Head class="text-center">عملیات‌ها</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each await valuesOfSelectedOption as baseInfo, index (baseInfo)}
							<!-- {@const vehicle = data.vehicles.find((item) => item.id === record.vehicleId)} -->
							<Table.Row>
								<Table.Cell>{index + 1}</Table.Cell>
								<Table.Cell>{baseInfo.title}</Table.Cell>
								<!-- <Table.Cell
									><button onclick={() => getFn(baseInfo.id)} class="hover:text-yellow-500"
										><Pen /></button
									></Table.Cell
								>
								<Table.Cell
									><button onclick={() => deleteFn(baseInfo.id)} class="hover:text-red-500"
										><Trash /></button
									></Table.Cell
								> -->
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>
</div>
