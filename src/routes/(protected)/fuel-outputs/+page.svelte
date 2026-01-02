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
	import { FuelTypeLabels } from '../vehicles/types.js';
	import { getFuelPriceAtDate } from '../base-info/fuel-price/fuelPrice.remote.js';
	import { createFuelOutput, deleteFuelOutput, updateFuelOutput } from './fuelOutputs.remote.js';
	import { ownerUnitSelect, plateShower } from '$lib/utils.js';
	import { getVehicleById } from '../vehicles/vehicles.remote.js';
	import type { CalendarDate } from '@internationalized/date';
	import { NumericFormat } from 'svelte-number-format';

	interface defaultValuesT {
		id: null | string;
		date: null | CalendarDate;
		vehicleId: null | string;
		DelivererPersonId: null | string;
		ReceiverPersonId: null | string;
		amount: null | number;
		kilometer: null | number;
		location: null | number;
		description: null | string;
	}

	let defaultValues = {
		id: null,
		date: null,
		vehicleId: null,
		DelivererPersonId: null,
		ReceiverPersonId: null,
		amount: null,
		kilometer: null,
		location: null,
		description: null,
	};

	let { data, form } = $props();

	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state<defaultValuesT>(defaultValues);

	let computedPrice = $derived.by(async () => {
		const selectedDate = formData.date?.toString();
		const selectedFuelAmount = formData.amount;

		if (formData.vehicleId === null) {
			return null;
		}

		const vehicle = await getVehicleById(formData.vehicleId);

		console.log(222, vehicle);

		//! bug in here
		if (selectedDate && selectedFuelAmount) {
			let basePrice = await getFuelPriceAtDate({ date: selectedDate, fuelType: vehicle?.fuelType });

			if (basePrice) {
				let price = basePrice * selectedFuelAmount;
				return price;
			}

			return null;
		} else {
			return null;
		}
	});

	async function getFn(id: string) {
		const value = data.fuelOutputs.find((item) => item.id == id);

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

		if (formData.date === null) {
			toast.success('لطفا فرم را تکمیل کنید');
		} else {
			let date = formData.date.toString();

			$inspect('FORM DATA ON SUBMIT', formData);

			if (formStatus === 'create') {
				try {
					await createFuelOutput({
						date: date,
						vehicleId: formData.vehicleId,
						DelivererPersonId: formData.DelivererPersonId,
						ReceiverPersonId: formData.ReceiverPersonId,
						amount: formData.amount,
						kilometer: formData.kilometer,
						location: formData.kilometer,
						description: formData.description,
					});
					formData = defaultValues;
					toast.success('با موفقیت ثبت شد');
				} catch (err) {
					console.log(err);
					toast.error('خطا در هنگام ثبت');
				} finally {
					await invalidateAll();
				}
			} else {
				if (formData.id === null) {
					toast.success('خطا در هنگام ویرایش');
					console.error('no id to send the update to fuelOutputs');
				} else {
					try {
						await updateFuelOutput({
							id: formData.id,
							date: date,
							vehicleId: formData.vehicleId,
							DelivererPersonId: formData.DelivererPersonId,
							ReceiverPersonId: formData.ReceiverPersonId,
							amount: formData.amount,
							kilometer: formData.kilometer,
							location: formData.kilometer,
							description: formData.description,
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
		}
	}

	async function deleteFn(id: string) {
		const toDelete = confirm('آیا از حذف رکورد اطمینان دارید؟');

		if (toDelete) {
			try {
				await deleteFuelOutput(id);
				toast.info('با موفقیت حذف شد');
			} catch (err) {
				console.log(err);
				toast.error('خطا در هنگام حذف');
			} finally {
				await invalidateAll();
			}
		}
	}
</script>

<div class="grid-cols-2 gap-2 space-y-2 xl:grid xl:space-y-0">
	<div>
		<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
			<Card.Header>
				<Card.Title>ثبت تحویل سوخت</Card.Title>
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
							bind:value={formData.ReceiverPersonId}
							required={true}
							options={data.ReceiverPersons}
						/>
					</div>

					<!-- لیست افرادی که مسئول واحد سوخت گیری هستند (فعلا آماد) از اطلاعات پایه بیاد -->
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="DelivererId">تحویل دهنده</Label>
						<Combobox
							name="DelivererId"
							bind:value={formData.DelivererPersonId}
							required={true}
							options={data.DelivererPersons}
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
						<Label for="kilometer">کیلومتر</Label>
						<Input
							type="number"
							id="kilometer"
							name="kilometer"
							bind:value={formData.kilometer}
							required={true}
						/>
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="location">محل سوخت گیری</Label>
						<Combobox
							bind:value={formData.location}
							required={true}
							name="location"
							options={[
								{ label: 'داخل پادگان', value: 1 },
								{ label: 'خارج پادگان - آزاد', value: 2 },
								{ label: 'خارج پادگان - رایگان', value: 3 },
							]}
						/>
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="description">توضیحات</Label>
						<textarea
							id="description"
							bind:value={formData.description}
							class="rounded-md border border-gray-300"
						></textarea>
					</div>

					<div class="col-span-2 mt-2 flex items-end justify-between gap-2">
						<div class="flex gap-2">
							<Button class=" min-w-16 cursor-pointer" type="submit">ثبت</Button>

							<Button
								onclick={resetForm}
								class="cursor-pointer bg-blue-500 hover:bg-blue-600"
								type="submit"
								title="ریست فرم"><RotateCcw /></Button
							>
						</div>

						<div class="flex">
							<div class="w-48 rounded-r-md bg-red-400 p-2 text-center">
								<div>هزینه سوختگیری (تومان):</div>
								<div class="">
									{#await computedPrice then val}
										<NumericFormat
											value={val}
											options={{ precision: 0 }}
											disabled
											class="w-full! text-center"
										/>
									{/await}
								</div>
							</div>

							<div class="rounded-l-md bg-blue-400 p-2 text-center">
								<div>موجودی (لیتر):</div>
								<div>xxxxx</div>
							</div>
						</div>
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
						<Table.Head class="text-center">وسیله نقلیه</Table.Head>
						<Table.Head class="text-center">تحویل گیرنده</Table.Head>
						<Table.Head class="text-center">تحویل دهنده</Table.Head>
						<Table.Head class="text-center">نوع سوخت</Table.Head>
						<Table.Head class="text-center">مقدار</Table.Head>
						<Table.Head class="text-center">توضیحات</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.fuelOutputs as record (record)}
						{@const vehicle = data.vehicles.find((item) => item.id === record.vehicleId)}
						<Table.Row>
							<Table.Cell>{new Date(record.date).toLocaleDateString('fa-IR')}</Table.Cell>
							<Table.Cell
								>{vehicle?.title}-{ownerUnitSelect(vehicle?.ownerUnit)}
								<span class="">{plateShower(vehicle?.plate)}</span></Table.Cell
							>
							<Table.Cell
								>{data.ReceiverPersons.find((item) => item.value === record.ReceiverPersonId)
									?.label}</Table.Cell
							>
							<Table.Cell
								>{data.DelivererPersons.find((item) => item.value === record.DelivererPersonId)
									?.label}</Table.Cell
							>
							<Table.Cell
								>{FuelTypeLabels?.[
									data.vehicles.find((item) => item.id === record.vehicleId)?.fuelType
								]}</Table.Cell
							>
							<Table.Cell>{record.amount}</Table.Cell>
							<Table.Cell>{record.description}</Table.Cell>
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
