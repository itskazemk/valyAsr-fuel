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

	let { data, form } = $props();

	let formData = $state({
		id: null,
		title: null,
		type: null,
		plateA: null,
		plateB: null,
		plateC: null,
		plateD: null,
		fuelType: null,
		ownerUnit: null,
	});

	async function getFn(id: string) {
		const req = await fetch(`/vehicles/${id}`);

		const res = await req.json();

		if (res.data) {
			formData = { ...res.data };
		}
	}

	async function deleteFn(id: string) {
		const isSure = confirm('آیا از حذف وسیله نقلیه اطمینان دارید؟');
		if (isSure) {
			const form = new FormData();
			form.append('id', id);
			fetch('?/delete', {
				method: 'POST',
				body: form,
			});

			await invalidateAll();
		}
	}
</script>

<div class="grid-cols-2 gap-2 space-y-2 xl:grid xl:space-y-0">
	<Card.Root>
		<Card.Header>
			<Card.Title>ثبت اطلاعات</Card.Title>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				action={formData.id ? '?/update' : '?/create'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
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
							type="text"
							id="plate"
							name="plate"
							placeholder="۷۷"
							bind:value={formData.plateA}
						/>
						<Input
							class="rounded-l-none rounded-r-none"
							required={true}
							type="text"
							id="plate"
							name="plate"
							placeholder="ب"
							bind:value={formData.plateB}
						/>
						<Input
							class="rounded-l-none rounded-r-none"
							required={true}
							type="text"
							id="plate"
							name="plate"
							placeholder="۱۵۹"
							bind:value={formData.plateC}
						/>
						<Input
							class="rounded-l-none"
							required={true}
							type="text"
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
							{ label: 'واحد ۱', value: 1 },
							{ label: 'واحد ۲', value: 2 },
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
						<Table.Row>
							<Table.Cell>{vehicle.title}</Table.Cell>
							<Table.Cell>{VehicleLabels?.[vehicle.type]}</Table.Cell>
							<Table.Cell>{vehicle.plate}</Table.Cell>
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
