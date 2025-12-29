<script lang="ts">
	import { Trash, Pen } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { FuelTypeLabels, VehicleLabels } from './types.js';
	import { createVehicle, deleteVehicle, updateVehicle } from './vehicles.remote.js';
	import { toast } from 'svelte-sonner';
	import { anyNull } from '$lib/utils.js';

	let { data, form } = $props();

	let defaultValues = {
		id: null,
		title: null,
		type: null,
		plateA: null,
		plateB: null,
		plateC: null,
		plateD: null,
		fuelType: null,
		ownerUnit: null,
	};

	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state(defaultValues);

	async function getFn(id: string) {
		const value = data.vehicles.find((item) => item.id == id);

		const { plate, ...rest } = value;

		const plateSplitted = plate.split('_');
		const plateA = plateSplitted?.[0];
		const plateB = plateSplitted?.[1];
		const plateC = plateSplitted?.[2];
		const plateD = plateSplitted?.[3];

		if (value) {
			formData = { plateA, plateB, plateC, plateD, ...rest };

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

		let { id, ...restOfObj } = formData;

		if (anyNull(restOfObj)) {
			toast.success('لطفا فرم را تکمیل کنید');
		} else {
			let fullPlate = `${restOfObj.plateA}_${restOfObj.plateB}_${restOfObj.plateC}_${restOfObj.plateD}`;

			if (formStatus === 'create') {
				try {
					await createVehicle({
						title: formData.title,
						type: formData.type,
						plate: fullPlate,
						fuelType: formData.fuelType,
						ownerUnit: formData.ownerUnit,
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
					console.error('no id to send the update to Vehicle');
				} else {
					try {
						await updateVehicle({
							id: formData.id,
							title: formData.title,
							type: formData.type,
							plate: fullPlate,
							fuelType: formData.fuelType,
							ownerUnit: formData.ownerUnit,
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
				await deleteVehicle(id);
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
	<Card.Root>
		<Card.Header>
			<Card.Title>ثبت اطلاعات</Card.Title>
		</Card.Header>
		<Card.Content>
			<form onsubmit={submitFn} autocomplete="off" class="grid h-full grid-cols-2 gap-2 rounded-sm">
				<label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
					hidden={true}
				>
					<p>شناسه یکتا:</p>
					<input name="id" type="text" class="col-span-2" bind:value={formData.id} />
				</label>

				<!-- اینجا به سلکت آپشن تغییر پیدا کند به گونه که از اطلاعات پایه داده ها دریافت شود -->
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="title">عنوان</Label>
					<Input
						required={true}
						type="text"
						id="title"
						name="title"
						placeholder="سمند، پراید و ..."
						bind:value={formData.title}
					/>
				</div>

				<!-- با توجه به اینکه اطلاعات نوع خودرو، موتور و ... از اطلاعات پایه دریافت میشود. این قسمت نیز غلط و اتوماتیک یا به صورت دستی از آنجا انتخاب شود -->
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع وسیله نقلیه</Label>
					<Combobox
						required={true}
						name="type"
						bind:value={formData.type}
						options={[
							{ label: 'سواری', value: 1 },
							{ label: 'مینی بوس', value: 2 },
							{ label: 'اتوبوس', value: 3 },
							{ label: 'موتور سیکلت', value: 4 },
						]}
					/>
				</div>

				<!-- <div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="title">شماره پلاک</Label>
					<Input
						required={true}
						type="text"
						id="plate"
						name="plate"
						placeholder="۷۷ب۱۵۹"
						bind:value={formData.plate}
					/>
				</div> -->

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="title">شماره پلاک</Label>
					<div class="grid grid-cols-4" style="direction: ltr;">
						<Input
							class="rounded-r-none"
							required={true}
							type="number"
							maxlength={2}
							id="plate"
							name="plate"
							placeholder="۷۷"
							bind:value={formData.plateA}
						/>
						<Input
							class="rounded-l-none rounded-r-none"
							required={true}
							type="text"
							maxlength={1}
							id="plate"
							name="plate"
							placeholder="ب"
							bind:value={formData.plateB}
						/>
						<Input
							class="rounded-l-none rounded-r-none"
							required={true}
							type="number"
							maxlength={3}
							id="plate"
							name="plate"
							placeholder="۱۵۹"
							bind:value={formData.plateC}
						/>
						<Input
							class="rounded-l-none"
							required={true}
							type="text"
							maxlength={2}
							id="plate"
							name="plate"
							placeholder="۶۴"
							bind:value={formData.plateD}
						/>
					</div>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع سوخت</Label>
					<Combobox
						required={true}
						name="fuelType"
						bind:value={formData.fuelType}
						options={[
							{ label: 'بنزین', value: 1 },
							{ label: 'گازوییل', value: 2 },
						]}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">واحد</Label>
					<Combobox
						required={true}
						name="ownerUnit"
						bind:value={formData.ownerUnit}
						options={[
							{ label: 'فرماندهی', value: 1 },
							{ label: 'حفاظت', value: 2 },
							{ label: 'حوزه', value: 3 },
							{ label: 'ایمنی', value: 4 },
							{ label: 'بازرسی', value: 5 },
							{ label: 'نیرو انسانی', value: 6 },
							{ label: 'طرح و برنامه', value: 7 },
							{ label: 'قرارگاه', value: 8 },
							{ label: 'مهندسی', value: 9 },
							{ label: 'آماد و پشتیبانی', value: 10 },
							{ label: 'آموزش', value: 11 },
							{ label: 'بهداری', value: 12 },
							{ label: 'فرهنگی', value: 13 },
							{ label: 'تربیت بدنی', value: 14 },
							{ label: 'تیپ آموزش-گردان اول', value: 15 },
							{ label: 'تیپ آموزش-گردان دوم', value: 16 },
							{ label: 'فاوا', value: 17 },
						]}
					/>
				</div>

				<Button class="col-span-2 mx-20 mt-2 cursor-pointer" type="submit">ثبت</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>اطلاعات ثبت شده</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root class="text-center">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">عنوان</Table.Head>
						<Table.Head class="text-center">نوع وسیله نقلیه</Table.Head>
						<Table.Head class="text-center">پلاک</Table.Head>
						<Table.Head class="text-center">نوع سوخت</Table.Head>
						<Table.Head class="text-center">واحد</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.vehicles as vehicle (vehicle)}
						{@const plateSplitted = vehicle.plate.split('_')}
						<Table.Row>
							<Table.Cell>{vehicle.title}</Table.Cell>
							<Table.Cell>{VehicleLabels?.[vehicle.type]}</Table.Cell>
							<Table.Cell class=""
								><div class="ltr_dir grid grid-cols-4 gap-1 text-center">
									<div>{plateSplitted?.[0]}</div>
									<div>{plateSplitted?.[1]}</div>
									<div>{plateSplitted?.[2]}</div>
									<div>{plateSplitted?.[3]}</div>
								</div></Table.Cell
							>
							<Table.Cell>{FuelTypeLabels?.[vehicle.fuelType]}</Table.Cell>
							<Table.Cell>{vehicle.ownerUnit}</Table.Cell>
							<Table.Cell
								><div class="space-x-2">
									<button onclick={() => getFn(vehicle.id)} class="hover:text-yellow-500"
										><Pen /></button
									>
									<button onclick={() => deleteFn(vehicle.id)} class="hover:text-red-500"
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
