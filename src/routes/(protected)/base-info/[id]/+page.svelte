<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Pen, RotateCcw, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { createBaseInfo, toggleDisableBaseInfo, updateBaseInfo } from '../baseInfos.remote.js';

	let defaultValues = {
		id: null,
		title: '',
	};

	let { data } = $props();
	let formStatus = $state<'create' | 'update'>('create');

	let formData = $state(defaultValues);

	async function getFn(id: string) {
		// const req = await fetch(`/vehicles/${id}`);

		// const res = await req.json();

		const value = data.baseInfos.find((item) => item.id == id);

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

		if (formStatus === 'create') {
			try {
				await createBaseInfo({ subId: page.params.id, title: formData.title });
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
				await updateBaseInfo({ id: formData.id, title: formData.title });
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

	async function disableFn(id: string) {
		try {
			await toggleDisableBaseInfo(id);
			toast.info('با موفقیت ثبت شد');
		} catch (err) {
			console.log(err);
			toast.error('خطا در هنگام ثبت');
		} finally {
			await invalidateAll();
		}
	}
</script>

<div class="space-y-2">
	<Card.Root class={formStatus === 'update' ? 'border-2 border-yellow-300' : null}>
		<Card.Header>
			<Card.Title>ثبت تحویل گیرنده</Card.Title>
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
					<Label for="title">عنوان</Label>
					<Input type="text" id="title" name="title" bind:value={formData.title} required={true} />
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

	<Card.Root>
		<Card.Header>
			<Card.Title>جدول تحول گیرنده‌ها</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root class="text-center">
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">ردیف</Table.Head>
						<Table.Head class="text-center">عنوان</Table.Head>
						<Table.Head class="text-center">فعال</Table.Head>
						<Table.Head class="text-center">-</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.baseInfos as baseInfo, i (baseInfo)}
						<Table.Row>
							<Table.Cell>{i + 1}</Table.Cell>
							<Table.Cell>{baseInfo.title}</Table.Cell>
							<Table.Cell
								><input
									type="checkbox"
									checked={!baseInfo.disabled}
									onchange={() => disableFn(baseInfo.id)}
								/></Table.Cell
							>
							<Table.Cell
								><button onclick={() => getFn(baseInfo.id)} class="hover:text-yellow-500"
									><Pen /></button
								></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
