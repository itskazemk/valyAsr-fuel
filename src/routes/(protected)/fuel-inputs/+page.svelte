<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import TestDatePicker from '$lib/test/TestDatePicker.svelte';
	import { DatePicker } from '@kazemk/svelte-international-datepicker';
	import { Pen, RotateCcw, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { createFuelInput, deleteFuelInput, updateFuelInput } from './fuelInput.remote.js';

	let defaultValues = {
		id: null,
		date: null,
		type: null,
		amount: null,
	};

	let { data, form } = $props();

	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state(defaultValues);

	async function getFn(id: string) {
		// const req = await fetch(`/vehicles/${id}`);

		// const res = await req.json();

		const value = data.fuelInputs.find((item) => item.id == id);

		if (value) {
			formData = { ...value };

			formStatus = 'update';
		}
	}

	async function deleteFn(id: string) {
		const isSure = confirm('آیا از حذف اطمینان دارید؟');
		if (isSure) {
			try {
				await deleteFuelInput(id);

				toast.success('با موفقیت حذف شد');
			} catch (err) {
				console.log(err);
				toast.error('خطا در هنگام حذف');
			} finally {
				await invalidateAll();
			}
		}
	}

	async function submitFn(e: SubmitEvent) {
		e.preventDefault();

		let date = formData.date.toString();

		if (formStatus === 'create') {
			try {
				await createFuelInput({ date: date, type: formData.type, amount: formData.amount });
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
				await updateFuelInput({
					id: formData.id,
					date,
					type: formData.type,
					amount: formData.amount,
				});
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

	function resetForm(e) {
		e.preventDefault();
		formStatus = 'create';
		formData = defaultValues;
	}
</script>

<div class="grid-cols-2 gap-2 space-y-2 xl:grid xl:space-y-0">
	<div>
		<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
			<Card.Header>
				<Card.Title>ثبت دریافت سوخت</Card.Title>
			</Card.Header>
			<Card.Content class="h-full"
				><form
					onsubmit={submitFn}
					autocomplete="off"
					class="grid h-full grid-cols-2 gap-2 rounded-sm"
				>
					<label
						class="center grid grid-cols-3 place-content-center content-center items-center text-center"
						hidden={true}
					>
						<p>شناسه یکتا:</p>
						<input name="id" type="text" class="col-span-2" bind:value={formData.id} />
					</label>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="date">تاریخ</Label>
						<TestDatePicker id="date" name="date" bind:date={formData.date} required={true} />
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="type">نوع سوخت</Label>
						<Combobox
							required={true}
							name="type"
							bind:value={formData.type}
							options={data.FuelTypes?.map((item) => {
								return { label: item.persianTitle, value: item.id };
							})}
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
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>جدول سوخت‌های دریافت شده</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root class="text-center">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">تاریخ</Table.Head>
						<Table.Head class="text-center">نوع سوخت</Table.Head>
						<Table.Head class="text-center">مقدار</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.fuelInputs as record (record)}
						<Table.Row>
							<Table.Cell>{new Date(record.date).toLocaleDateString('fa-IR')}</Table.Cell>
							<Table.Cell>{data.FuelTypes?.find((item) => record.type)?.persianTitle}</Table.Cell>
							<Table.Cell>{record.amount}</Table.Cell>
							<Table.Cell
								><div class="space-x-2">
									<button onclick={() => getFn(record.id)} class="hover:text-yellow-500"
										><Pen /></button
									>
									<button onclick={() => deleteFn(record.id)} class="hover:text-red-500"
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
