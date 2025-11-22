<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import TestDatePicker from '$lib/test/TestDatePicker.svelte';

	import { Pen, RotateCcw, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let defaultValues = {
		id: null,
		startDate: null,
		endDate: null,
		type: null,
		amount: null,
	};

	let { data, form } = $props();

	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state(defaultValues);

	async function getFn(id: string) {
		const value = data.fuelPrices.find((item) => item.id == id);

		if (value) {
			formData = { ...value };

			formStatus = 'update';
		}
	}

	function resetForm(e) {
		e.preventDefault();
		formStatus = 'create';
		formData = defaultValues;
	}

	async function submitFn(e: SubmitEvent) {
		e.preventDefault();

		if (formStatus === 'create') {
			try {
				// await createBaseInfo({ subId: page.params.id, title: formData.title });
				formData = defaultValues;
				toast.success('با موفقیت ثبت شد');
			} catch (err) {
				console.log(err);
				toast.error('خطا در هنگام ثبت');
			} finally {
				await invalidateAll();
			}
		} else {
			try {
				// await updateBaseInfo({ id: formData.id, title: formData.title });
				toast.warning('با موفقیت ویرایش شد');
				formStatus = 'create';
				formData = defaultValues;
			} catch (err) {
				console.log(err);
				toast.error('خطا در هنگام ویرایش');
			} finally {
				await invalidateAll();
			}
		}
	}

	async function deleteFn(id: string) {
		try {
			// await toggleDisableBaseInfo(id);
			toast.info('با موفقیت ثبت شد');
		} catch (err) {
			console.log(err);
			toast.error('خطا در هنگام ثبت');
		} finally {
			await invalidateAll();
		}
	}
</script>

<div class="grid-cols-2 gap-2 space-y-2 xl:grid xl:space-y-0">
	<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
		<Card.Header>
			<Card.Title>ثبت دریافت سوخت</Card.Title>
		</Card.Header>
		<Card.Content class="h-full"
			><form class="grid h-full grid-cols-2 gap-2 rounded-sm">
				<label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
					hidden={true}
				>
					<p>شناسه یکتا:</p>
					<input name="id" type="text" class="col-span-2" bind:value={formData.id} />
				</label>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="startDate">تاریخ پایان</Label>
					<TestDatePicker
						id="startDate"
						name="startDate"
						bind:date={formData.startDate}
						required={true}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="endDate">تاریخ شروع</Label>
					<TestDatePicker
						id="endDate"
						name="endDate"
						bind:date={formData.endDate}
						required={true}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع سوخت</Label>
					<Combobox
						required={true}
						name="type"
						bind:value={formData.type}
						options={[
							{ label: 'بنزین', value: 1 },
							{ label: 'گازوییل', value: 2 },
						]}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">مقدار</Label>
					<Input
						type="number"
						id="amount"
						name="amount"
						bind:value={formData.amount}
						required={true}
					/>
				</div>

				<div class="col-span-2 mt-2 flex items-end gap-2">
					<Button class="w-1/5 min-w-16 cursor-pointer" type="submit">ثبت</Button>
					<Button
						onclick={resetForm}
						class="cursor-pointer bg-blue-500 hover:bg-blue-600"
						type="submit"
						title="ریست فرم"><RotateCcw /></Button
					>
				</div>
			</form></Card.Content
		>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>جدول قیمت سوخت‌ها</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root class="text-center">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">ردیف</Table.Head>
						<Table.Head class="text-center">تاریخ شروع</Table.Head>
						<Table.Head class="text-center">تاریخ پایان</Table.Head>
						<Table.Head class="text-center">نوع</Table.Head>
						<Table.Head class="text-center">مقدار</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.fuelPrices as item, index (item)}
						<Table.Row>
							<Table.Cell>{index + 1}</Table.Cell>
							<Table.Cell>{new Date(item.startDate).toLocaleDateString('fa-IR')}</Table.Cell>
							<Table.Cell>{new Date(item.endDate).toLocaleDateString('fa-IR')}</Table.Cell>
							<Table.Cell>{item.type}</Table.Cell>
							<Table.Cell>{item.amount}</Table.Cell>
							<Table.Cell
								><div class="space-x-2">
									<button onclick={() => getFn(item.id)} class="hover:text-yellow-500"
										><Pen /></button
									>
									<button onclick={() => deleteFn(item.id)} class="hover:text-red-500"
										><Trash /></button
									>
								</div></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
