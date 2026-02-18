<script lang="ts">
	import { cn } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';

	let { vType, valueFF = $bindable() }: { vType: string; valueFF: string } = $props();

	$inspect('vType', vType);
	$inspect('valueFF', valueFF);

	let plateObj = $state({});

	$effect(() => {
		if (vType) {
			plateObj = {};
		}
	});

	type PlateField = {
		key: string;
		class: string;
		type: string;
		maxlength: number;
		placeholder: string;
	};

	let fields: PlateField[] = $derived.by(() => {
		// None
		if (vType === '25d1ef84-311f-4a66-bce6-0207b389cb07') {
			return [{ key: 'plate', class: '', type: 'number', maxlength: 3, placeholder: '۷۸۹' }];
		}

		// MotorCycle
		if (vType === '44f9cb39-45bf-42dd-8039-1f858485676d') {
			return [
				{ key: 'plateA', class: 'w-1/2 rounded-b-none', type: 'number', maxlength: 3, placeholder: '۱۲۳' },
				{ key: 'plateB', class: 'w-1/2 rounded-t-none', type: 'number', maxlength: 5, placeholder: '۴۵۶۷۸' },
			];
		}

		// Forklift
		if (vType === '4a5ccd8d-75a9-4b1a-b41f-759db3a03468') {
			return [
				{ key: 'plateA', class: 'rounded-r-none', type: 'number', maxlength: 3, placeholder: '۱۲۳' },
				{ key: 'plateB', class: 'rounded-none', type: 'number', maxlength: 3, placeholder: '۴۵۶' },
				{ key: 'plateC', class: 'rounded-l-none', type: 'number', maxlength: 3, placeholder: '۷۸۹' },
			];
		}

		return [
			{ key: 'plateA', class: 'rounded-r-none', type: 'number', maxlength: 2, placeholder: '۷۷' },
			{ key: 'plateB', class: 'rounded-none', type: 'text', maxlength: 1, placeholder: 'ب' },
			{ key: 'plateC', class: 'rounded-none', type: 'number', maxlength: 3, placeholder: '۱۵۹' },
			{ key: 'plateD', class: 'rounded-l-none', type: 'number', maxlength: 2, placeholder: '۶۴' },
		];
	});

	let cols = $derived.by(() => {
		// None
		if (vType === '25d1ef84-311f-4a66-bce6-0207b389cb07') return 1;

		// MotorCycle
		if (vType === '44f9cb39-45bf-42dd-8039-1f858485676d') return 0;

		// Forklift
		if (vType === '4a5ccd8d-75a9-4b1a-b41f-759db3a03468') return 3;

		// Car
		return 4;
	});

	$effect(() => {
		const plateObjAllValues = Object.values(plateObj);

		if (plateObjAllValues) {
			const plateObjLen = Object.keys(plateObj).length;

			valueFF = plateObjAllValues?.reduce((acc, cur, index) => {
				if (index < plateObjLen - 1) {
					return acc + cur + '_';
				} else {
					return acc + cur;
				}
			}, '');
		}
	});
</script>

<div>
	<div class="grid place-items-center" style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); direction: ltr;">
		{#each fields as field (field.key)}
			<input
				in:scale={{ duration: 200 }}
				out:fade
				animate:flip={{ duration: 400 }}
				class={cn(
					'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
					'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
					'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
					field.class,
				)}
				required
				placeholder={field.placeholder}
				bind:value={plateObj[field.key]}
			/>
		{/each}
	</div>

	<!-- <Label for="title">شماره پلاک</Label>
	{#if vType === '1'}
		<div class="grid grid-cols-4" style="direction: ltr;">
			<Input
				class="rounded-r-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۷۷"
				bind:value={plateObj.plateA}
			/>
			<Input
				class="rounded-l-none rounded-r-none"
				required={true}
				type="text"
				maxlength={1}
				id="plate"
				name="plate"
				placeholder="ب"
				bind:value={plateObj.plateB}
			/>
			<Input
				class="rounded-l-none rounded-r-none"
				required={true}
				type="number"
				maxlength={3}
				id="plate"
				name="plate"
				placeholder="۱۵۹"
				bind:value={plateObj.plateC}
			/>
			<Input
				class="rounded-l-none"
				required={true}
				type="text"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۶۴"
				bind:value={plateObj.plateD}
			/>
		</div>
	{:else if vType === '2'}
		<div>
			<Input
				class="w-1/2 rounded-b-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۱۲۳"
				bind:value={plateObj.plateA}
			/>
			<Input
				class="w-1/2 rounded-t-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۴۵۶۷۸"
				bind:value={plateObj.plateB}
			/>
		</div>
	{:else if vType === '3'}
		<div class="grid grid-cols-3">
			<Input
				class="rounded-l-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۱۲۳"
				bind:value={plateObj.plateA}
			/>
			<Input
				class="rounded-l-none rounded-r-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۴۵۶"
				bind:value={plateObj.plateB}
			/>
			<Input
				class="rounded-r-none"
				required={true}
				type="number"
				maxlength={2}
				id="plate"
				name="plate"
				placeholder="۷۸۹"
				bind:value={plateObj.plateB}
			/>
		</div>
	{:else}
		<Input
			class=""
			required={true}
			type="number"
			maxlength={2}
			id="plate"
			name="plate"
			placeholder="۷۸۹"
			bind:value={plateObj.Plate}
		/>
	{/if} -->
</div>
