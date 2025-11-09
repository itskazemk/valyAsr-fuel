<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	console.log(data);
</script>

<div class="grid grid-cols-2 gap-2">
	<form
		method="POST"
		action="?/create"
		use:enhance
		class="grid h-full grid-cols-2 gap-2 rounded-sm border-2 border-indigo-500 p-2"
	>
		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>عنوان:</p>
			<input name="title" type="text" class="col-span-2" />
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>نوع:</p>
			<select name="type" class="col-span-2">
				<option value="1">سواری</option>
				<option value="2">مینی‌بوس</option>
				<option value="3">اتوبوس</option>
				<option value="4">موتور سیکلت</option>
			</select>
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>شماره پلاک:</p>
			<input name="plate" type="text" class="col-span-2" />
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>نوع سوخت:</p>
			<select name="fuelType" class="col-span-2">
				<option value="1"> بنزین</option>
				<option value="2"> گازوییل</option>
			</select>
		</label>

		<label
			class="center grid grid-cols-3 place-content-center content-center items-center text-center"
		>
			<p>واحد:</p>
			<select name="ownerUnit" class="col-span-2">
				<option value="1">واحد ۱</option>
				<option value="2">واحد ۲</option>
				<option value="3">واحد ۳</option>
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
						<td>{vehicle.Title}</td>
						<td>{vehicle.Type}</td>
						<td>{vehicle.Plate}</td>
						<td>{vehicle.FuelType}</td>
						<td>{vehicle.OwnerUnit}</td>
						<td>update / delete</td>
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
