<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import TestDatePicker from '$lib/test/TestDatePicker.svelte';
	import { plateShower } from '$lib/utils.js';
	import {
		endOfMonth,
		getLocalTimeZone,
		PersianCalendar,
		startOfMonth,
		toCalendar,
		today,
		type CalendarDate,
	} from '@internationalized/date';
	import { CircleChevronLeft, CircleChevronRight, Pen, RotateCcw, Trash } from '@lucide/svelte';
	import { NumericFormat } from 'svelte-number-format';
	import { toast } from 'svelte-sonner';
	import { getFuelPriceAtDate } from '../base-info/fuel-price/fuelPrice.remote.js';
	import { getVehicleById } from '../vehicles/vehicles.remote.js';
	import {
		createFuelOutput,
		deleteFuelOutput,
		getFuelOutputsPagination,
		updateFuelOutput,
	} from './fuelOutputs.remote.js';

	interface defaultValuesT {
		id: null | string;
		date: null | CalendarDate;
		vehicleId: null | string;
		DelivererPersonId: null | string;
		ReceiverPersonId: null | string;
		amount: null | number;
		kilometer: null | number;
		locationId: null | number;
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
		locationId: null,
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

			console.log('basePrice', basePrice);

			if (basePrice) {
				let price = basePrice * selectedFuelAmount;
				console.log('price', price);
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

			console.log('FORM DATA ON SUBMIT', formData);

			if (formStatus === 'create') {
				try {
					await createFuelOutput({
						date: date,
						vehicleId: formData.vehicleId,
						DelivererPersonId: formData.DelivererPersonId,
						ReceiverPersonId: formData.ReceiverPersonId,
						amount: formData.amount,
						kilometer: formData.kilometer,
						locationId: formData.locationId,
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
							locationId: formData.locationId,
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

	const todayInGregorian = today(getLocalTimeZone());
	let todayInPersianCalendar = toCalendar(todayInGregorian, new PersianCalendar());

	//  First day of this Persian month
	const firstDayOfPersianMonth = startOfMonth(todayInPersianCalendar);

	//  Last day of this Persian month
	const lastDayOfPersianMonth = endOfMonth(todayInPersianCalendar);

	let searchStartDate = $state<string>(firstDayOfPersianMonth.toString());
	let searchEndDate = $state<string>(lastDayOfPersianMonth.toString());
	let searchPageNumber = $state<number>(1);
	// function PaginationFn(e: SubmitEvent) {
	// 	e.preventDefault();

	// 	const form = e.currentTarget;
	// 	const formData = new FormData(form);

	// 	const startDate = formData.get('startDate');
	// 	const endDate = formData.get('endDate');

	// 	console.log('FF', startDate);
	// 	console.log('FF', endDate);
	// }

	let tableData = $state(
		await getFuelOutputsPagination({
			startDate: searchStartDate?.toString(),
			endDate: searchEndDate?.toString(),
			pageNumber: 1,
			pageSize: 10,
		}),
	);
</script>

<div class="gap-2 space-y-2 xl:grid xl:h-[calc(100vh-8rem)] xl:grid-cols-2 xl:space-y-0">
	<div>
		<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
			<Card.Header>
				<Card.Title>ثبت تحویل سوخت</Card.Title>
			</Card.Header>
			<Card.Content class="h-full"
				><form onsubmit={submitFn} autocomplete="off" class="grid h-full grid-cols-2 gap-2 rounded-sm">
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
							options={data.vehicles?.map((item) => {
								return { label: `${item.title}-${item.plate}`, value: item.id };
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
							max={2000}
							min={0}
							step={0.1}
						/>
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="kilometer">کیلومتر</Label>
						<Input type="number" id="kilometer" name="kilometer" bind:value={formData.kilometer} />
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="locationId">محل سوخت گیری</Label>
						<Combobox
							bind:value={formData.locationId}
							required={true}
							name="locationId"
							options={data.FuelingLocations?.map((item) => {
								return { label: item.persianTitle, value: item.id };
							})}
						/>
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="description">توضیحات</Label>
						<textarea id="description" bind:value={formData.description} class="rounded-md border border-gray-300"
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
										<NumericFormat value={val} options={{ precision: 0 }} disabled class="w-full! text-center" />
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

	<div class="xl:h-[calc(100vh-8rem)]">
		<Card.Root class="xl:grid xl:h-full xl:grid-rows-[auto_1fr]">
			<Card.Header>
				<Card.Title>جدول سوخت‌های دریافت شده</Card.Title>
				<form class="grid grid-cols-4 items-end gap-2 rounded-md p-2">
					<label>
						تاریخ شروع
						<TestDatePicker id="searchStartDate" name="searchStartDate" bind:date={searchStartDate} />
					</label>

					<label>
						تاریخ پایان
						<TestDatePicker id="searchEndDate" name="searchEndDate" bind:date={searchEndDate} />
					</label>
					<Button
						class=""
						onclick={async () => {
							tableData = await getFuelOutputsPagination({
								startDate: searchStartDate?.toString(),
								endDate: searchEndDate?.toString(),
								pageNumber: 1,
								pageSize: 10,
							});
						}}>جستجو</Button
					>
				</form>
			</Card.Header>
			<Card.Content class="overflow-y-auto">
				<Table.Root class="table-auto text-center">
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-center">تاریخ</Table.Head>
							<Table.Head class="w-50 text-center">وسیله نقلیه</Table.Head>
							<Table.Head class="text-center">تحویل گیرنده</Table.Head>
							<Table.Head class="text-center">تحویل دهنده</Table.Head>
							<Table.Head class="text-center">نوع سوخت</Table.Head>
							<Table.Head class="text-center">مقدار</Table.Head>
							<Table.Head class="text-center">کیلومتر</Table.Head>
							<Table.Head class="text-center">محل سوختگیری</Table.Head>
							<!-- <Table.Head class="text-center">هزینه</Table.Head> -->
							<Table.Head class="text-center">توضیحات</Table.Head>
							<Table.Head class="text-center">-</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each tableData.items as record (record)}
							{@const vehicle = data.vehicles.find((item) => item.id === record.vehicleId)}
							<Table.Row>
								<Table.Cell>{new Date(record.date).toLocaleDateString('fa-IR')}</Table.Cell>
								<Table.Cell>
									<p class="max-w-50 truncate">
										{vehicle?.title}-{data.Departments?.find((item) => item.id === vehicle?.ownerUnit)?.persianTitle}
										<span class="">{plateShower(vehicle?.plate)}</span>
									</p>
								</Table.Cell>
								<Table.Cell
									>{data.ReceiverPersons.find((item) => item.value === record.ReceiverPersonId)?.label}</Table.Cell
								>
								<Table.Cell
									>{data.DelivererPersons.find((item) => item.value === record.DelivererPersonId)?.label}</Table.Cell
								>
								<Table.Cell>{data.FuelTypes?.find((item) => item.id === vehicle?.fuelType)?.persianTitle}</Table.Cell>
								<Table.Cell>{record.amount}</Table.Cell>
								<Table.Cell>{record.kilometer}</Table.Cell>
								<Table.Cell
									>{data.FuelingLocations?.find((item) => item.id === record.locationId)?.persianTitle}</Table.Cell
								>
								<!-- <Table.Cell>{record.price}</Table.Cell> -->
								<Table.Cell><p class="max-w-20 truncate">{record.description}</p></Table.Cell>
								<Table.Cell
									><div class="space-x-2">
										<button onclick={() => getFn(record.id)} class="hover:text-yellow-500"><Pen /></button>
										<button onclick={() => deleteFn(record.id)} class="hover:text-red-500"><Trash /></button>
									</div></Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
			<Card.Footer class="mx-auto ">
				<div class="flex items-center gap-4 rounded-xl bg-blue-300 p-2">
					<button
						title="صفحه بعد"
						disabled={searchPageNumber >= Math.ceil(tableData.totalCount / 10)}
						onclick={async () => {
							searchPageNumber += 1;
							tableData = await getFuelOutputsPagination({
								startDate: searchStartDate?.toString(),
								endDate: searchEndDate?.toString(),
								pageNumber: searchPageNumber,
								pageSize: 10,
							});
						}}
						class="cursor-pointer rounded-full p-1 hover:bg-blue-500 hover:text-black"><CircleChevronRight /></button
					>
					<div>
						<div>صفحه {tableData.currentPageNumber} از {Math.ceil(tableData.totalCount / 10)}</div>
					</div>

					<button
						title="صفحه قبل"
						onclick={async () => {
							searchPageNumber -= 1;

							if (searchPageNumber <= 0) {
								searchPageNumber = 1;
							}

							tableData = await getFuelOutputsPagination({
								startDate: searchStartDate?.toString(),
								endDate: searchEndDate?.toString(),
								pageNumber: searchPageNumber,
								pageSize: 10,
							});
						}}
						class="rounded-full p-1 hover:bg-blue-500 hover:text-black"><CircleChevronLeft /></button
					>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
