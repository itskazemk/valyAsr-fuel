<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Combobox from '$lib/components/Combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { DatePicker } from '@kazemk/svelte-international-datepicker';

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

	let date = $state();
</script>

<div class="grid-cols-2 gap-2 space-y-2 lg:grid lg:space-y-0">
	<Card.Root>
		<Card.Header>
			<Card.Title>ثبت دریافت سوخت</Card.Title>
		</Card.Header>
		<Card.Content
			><form
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

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="date">تاریخ</Label>
					<!-- <Input
						type="text"
						id="title"
						name="title"
						placeholder="سمند، پراید و ..."
						bind:value={formData.title}
					/> -->

					<DatePicker id="date" name="date" bind:date />
				</div>

				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="type">نوع سوخت</Label>
					<Combobox
						name="type"
						bind:value={formData.type}
						options={[
							{ label: 'بنزین', value: 1 },
							{ label: 'گازوییل', value: 2 }
						]}
					/>
				</div>

				<Button class="col-span-2 mx-20 mt-2 cursor-pointer" type="submit">ثبت</Button>
			</form></Card.Content
		>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>جدول سوخت‌های دریافت شده</Card.Title>
		</Card.Header>
		<Card.Content>test</Card.Content>
	</Card.Root>
</div>
