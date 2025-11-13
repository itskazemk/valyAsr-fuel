<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { data, form } = $props();

	let formData = $state({
		id: null,
		title: null,
		type: null,
		plate: null,
		fuelType: null,
		ownerUnit: null
	});

	async function getFn(id: string) {
		const req = await fetch(`/vehicles/${id}`);

		const res = await req.json();

		console.log(222, res.data);

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
				body: form
			});

			await invalidateAll();
		}
	}

	$inspect(formData);
</script>

<div class="grid grid-cols-2 gap-2">
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

				<!-- <label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
				>
					<p>عنوان:</p>
					<input name="title" type="text" class="col-span-2" bind:value={formData.title} />
				</label> -->

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="title">عنوان</Label>
					<Input
						type="text"
						id="title"
						name="title"
						placeholder="سمند، پراید و ..."
						bind:value={formData.title}
					/>
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع وسیله نقلیه</Label>
					<Combobox
						name="type"
						bind:value={formData.type}
						options={[
							{ label: 'سواری', value: 1 },
							{ label: 'مینی بوس', value: 2 },
							{ label: 'اتوبوس', value: 3 },
							{ label: 'موتور سیکلت', value: 4 }
						]}
					/>
				</div>

				<!-- <label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
				>
					<p>نوع:</p>
					<select name="type" bind:value={formData.type} class="col-span-2">
						<option value={null} disabled={true}>انتخاب کنید</option>
						<option value={1}>سواری</option>
						<option value={2}>مینی‌بوس</option>
						<option value={3}>اتوبوس</option>
						<option value={4}>موتور سیکلت</option>
					</select>
				</label> -->

				<!-- <label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
				>
					<p>شماره پلاک:</p>
					<input name="plate" bind:value={formData.plate} type="text" class="col-span-2" />
				</label> -->

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="title">شماره پلاک</Label>
					<Input
						type="text"
						id="plate"
						name="plate"
						placeholder="۷۷ب۱۵۹"
						bind:value={formData.plate}
					/>
				</div>

				<!-- <label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
				>
					<p>نوع سوخت:</p>
					<select name="fuelType" bind:value={formData.fuelType} class="col-span-2">
						<option value={null} disabled={true}>انتخاب کنید</option>
						<option value={1}> بنزین</option>
						<option value={2}> گازوییل</option>
					</select>
				</label> -->

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع سوخت</Label>
					<Combobox
						name="fuelType"
						bind:value={formData.fuelType}
						options={[
							{ label: 'بنزین', value: 1 },
							{ label: 'گازوییل', value: 2 }
						]}
					/>
				</div>

				<!-- <label
					class="center grid grid-cols-3 place-content-center content-center items-center text-center"
				>
					<p>واحد:</p>
					<select name="ownerUnit" bind:value={formData.ownerUnit} class="col-span-2">
						<option value={null} disabled={true}>انتخاب کنید</option>
						<option value={1}>واحد ۱</option>
						<option value={2}>واحد ۲</option>
						<option value={3}>واحد ۳</option>
					</select>
				</label> -->

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">واحد</Label>
					<Combobox
						name="ownerUnit"
						bind:value={formData.ownerUnit}
						options={[
							{ label: 'واحد ۱', value: 1 },
							{ label: 'واحد ۲', value: 2 }
						]}
					/>
				</div>

				<!-- <button class="col-span-2 rounded-sm bg-indigo-300 hover:bg-indigo-400">ثبت</button> -->
				<Button class="col-span-2 mx-20 mt-2 cursor-pointer" type="submit">ثبت</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>اطلاعات ثبت شده</Card.Title>
		</Card.Header>
		<Card.Content
			><table class="table w-full table-fixed text-center">
				<thead class="bg-indigo-300">
					<tr
						><th>عنوان</th><th>نوع</th><th>شماره پلاک</th><th>نوع سوخت</th><th>واحد</th><th
						></th></tr
					>
				</thead>
				<tbody>
					{#each data.vehicles as vehicle}
						<tr>
							<td>{vehicle.title}</td>
							<td>{vehicle.type}</td>
							<td>{vehicle.plate}</td>
							<td>{vehicle.fuelType}</td>
							<td>{vehicle.ownerUnit}</td>
							<td
								><div>
									<button onclick={() => getFn(vehicle.id)}>UPDATE</button>
									<button onclick={() => deleteFn(vehicle.id)}>DELETE</button>
								</div></td
							>
						</tr>
					{/each}
				</tbody>
			</table></Card.Content
		>
	</Card.Root>
</div>

<style>
	input {
		border: 2px solid indigo;
		border-radius: 5px;
	}
</style>
