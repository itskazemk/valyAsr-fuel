<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';

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
</script>

<div class="grid grid-cols-2 gap-2">
	<form
		method="POST"
		action={formData.id ? '?/update' : '?/create'}
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
		class="grid h-full grid-cols-2 gap-2 rounded-sm border-2 border-indigo-500 p-2"
	>
		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
			hidden={true}
		>
			<p>شناسه یکتا:</p>
			<input name="id" type="text" class="col-span-2" bind:value={formData.id} />
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>عنوان:</p>
			<input name="title" type="text" class="col-span-2" bind:value={formData.title} />
		</label>

		<label
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
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>شماره پلاک:</p>
			<input name="plate" bind:value={formData.plate} type="text" class="col-span-2" />
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>نوع سوخت:</p>
			<select name="fuelType" bind:value={formData.fuelType} class="col-span-2">
				<option value={null} disabled={true}>انتخاب کنید</option>
				<option value={1}> بنزین</option>
				<option value={2}> گازوییل</option>
			</select>
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>واحد:</p>
			<select name="ownerUnit" bind:value={formData.ownerUnit} class="col-span-2">
				<option value={null} disabled={true}>انتخاب کنید</option>
				<option value={1}>واحد ۱</option>
				<option value={2}>واحد ۲</option>
				<option value={3}>واحد ۳</option>
			</select>
		</label>

		<button class="col-span-2 rounded-sm bg-indigo-300 hover:bg-indigo-400">ثبت</button>
	</form>
	<div class="h-full rounded-sm border-2 border-indigo-600 p-2">
		<table class="table w-full table-fixed text-center">
			<thead class="bg-indigo-300">
				<tr><th>عنوان</th><th>نوع</th><th>شماره پلاک</th><th>نوع سوخت</th><th>واحد</th><th></th></tr
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
		</table>
	</div>
</div>

<style>
	input {
		border: 2px solid indigo;
		border-radius: 5px;
	}
</style>
