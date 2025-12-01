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
	import { Pen, RotateCcw, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { FuelTypeLabels } from '../vehicles/types.js';
	import { getFuelPriceAtDate } from '../base-info/fuel-price/fuelPrice.remote.js';

	let defaultValues = {
		id: null,
		date: null,
		amount: null,
		vehicleId: null,
		DelivererId: null,
		ReceiverId: null,
	};

	let { data, form } = $props();

	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state(defaultValues);

	let computedPrice = $derived.by(async () => {
		const selectedDate = formData.date;

		if (selectedDate) {
			let val = await getFuelPriceAtDate('2026-01-01');

			console.log(111, val);

			return val;
		} else {
			return null;
		}
	});

	async function getFn(id: string) {
		// const req = await fetch(`/vehicles/${id}`);

		// const res = await req.json();

		const value = data.fuelOutputs.find((item) => item.id == id);

		if (value) {
			formData = { ...value };

			formStatus = 'update';
		}
	}

	async function deleteFn(id: string) {
		const isSure = confirm('آیا از حذف اطمینان دارید؟');
		if (isSure) {
			const form = new FormData();
			form.append('id', id);
			fetch('?/delete', {
				method: 'POST',
				body: form,
			});

			await invalidateAll();
			toast.success('با موفقیت حذف شد');
		}
	}

	function resetForm(e) {
		e.preventDefault();
		formStatus = 'create';
		formData = defaultValues;
	}

	$inspect(data.fuelOutputs);
</script>

{#await computedPrice then value}
	<div class="bg-red-400 p-3">{value}</div>
{/await}

<div class="grid-cols-2 gap-2 space-y-2 xl:grid xl:space-y-0">
	<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
		<Card.Header>
			<Card.Title>ثبت تحویل سوخت</Card.Title>
		</Card.Header>
		<Card.Content class="h-full"
			><form
				method="POST"
				action={formData.id ? '?/update' : '?/create'}
				use:enhance={() => {
					return async (aaa) => {
						// console.log(Object.fromEntries(aaa.formData));
						// console.log(aaa.action);
						// console.log(aaa.formElement);
						// console.log(aaa.result);
						await aaa.update();

						formData = { id: null, date: null, type: null, amount: null };
						formStatus = 'create';

						toast.success('با موفقیت ثبت شد');
					};
				}}
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
					<Label for="vehicleId">وسیله نقلیه</Label>
					<Combobox
						name="vehicleId"
						bind:value={formData.vehicleId}
						required={true}
						options={data.vehicles.map((item) => {
							return { label: `${item.title}-${item.ownerUnit}-${item.plate}`, value: item.id };
						})}
					/>
				</div>

				<!-- لیست افرادی از کل پادگان که از قسمت اطلاعات پایه قابل تنظیم باشد -->
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="ReceiverId">تحویل گیرنده</Label>
					<Combobox
						name="ReceiverId"
						bind:value={formData.ReceiverId}
						required={true}
						options={[
							{ label: 'شخص یک', value: 1 },
							{ label: 'شخص دو', value: 2 },
							{ label: 'شخص سه', value: 3 },
							{ label: 'شخص چهار', value: 4 },
							{ label: 'شخص پنج', value: 5 },
						]}
					/>
				</div>

				<!-- لیست افرادی که مسئول واحد سوخت گیری هستند (فعلا آماد) از اطلاعات پایه بیاد -->
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="DelivererId">تحویل دهنده</Label>
					<Combobox
						name="DelivererId"
						bind:value={formData.DelivererId}
						required={true}
						options={[
							{ label: 'شخص یک', value: 1 },
							{ label: 'شخص دو', value: 2 },
							{ label: 'شخص سه', value: 3 },
							{ label: 'شخص چهار', value: 4 },
							{ label: 'شخص پنج', value: 5 },
						]}
					/>
				</div>

				<!-- بر اساس اینکه بنزین باشد یا گازوییل محدودیت داریم -->
				<!-- بنزین ۱۵۰ لیتر بیشترین -->
				<!-- گازوییل ۲۰۰۰ بیشترین -->
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="amount">مقدار</Label>
					<Input
						type="number"
						id="amount"
						name="amount"
						bind:value={formData.amount}
						required={true}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="amount">کیلومتر</Label>
					<Input
						type="number"
						id="amount"
						name="amount"
						bind:value={formData.amount}
						required={true}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">محل سوخت گیری</Label>
					<Combobox
						required={true}
						name="ownerUnit"
						options={[
							{ label: 'داخل پادگان', value: 1 },
							{ label: 'خارج پادگان - آزاد', value: 2 },
							{ label: 'خارج پادگان - رایگان', value: 3 },
						]}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="description">توضیحات</Label>
					<textarea id="description" class="rounded-md border border-gray-300"></textarea>
				</div>

				<div class="col-span-2 mt-2 flex items-end gap-2">
					<Button class="w-1/5 min-w-16 cursor-pointer" type="submit">ثبت (0)</Button>
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
			<Card.Title>جدول سوخت‌های دریافت شده</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root class="text-center">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">تاریخ</Table.Head>
						<Table.Head class="text-center">وسیله نقلیه</Table.Head>
						<Table.Head class="text-center">تحویل گیرنده</Table.Head>
						<Table.Head class="text-center">تحویل دهنده</Table.Head>
						<Table.Head class="text-center">نوع سوخت</Table.Head>
						<Table.Head class="text-center">مقدار</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.fuelOutputs as record (record)}
						{@const vehicle = data.vehicles.find((item) => item.id === record.vehicleId)}
						<Table.Row>
							<Table.Cell>{new Date(record.date).toLocaleDateString('fa-IR')}</Table.Cell>
							<Table.Cell>{vehicle?.title}-{vehicle?.ownerUnit}-{vehicle?.plate}</Table.Cell>
							<Table.Cell>{record.ReceiverId}</Table.Cell>
							<Table.Cell>{record.DelivererId}</Table.Cell>
							<Table.Cell>{FuelTypeLabels?.[record.fuelType]}</Table.Cell>
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
