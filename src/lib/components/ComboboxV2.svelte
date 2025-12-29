<script>
	import { run } from 'svelte/legacy';

	import { tick } from 'svelte';
	import Input from './ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	const area = ['تست', 'کاظم', 'علی', 'مهدی', 'رضا', 'فاطمه', 'آرامش'];

	let data = Array.from(new Set(area));

	let status = $state('blur'); // blur | focus
	let value = $state('');
	let input = $state();
	let list = $state();
	let currentIdx = -1;
	let selected = $state(-1);
	let previousLength = data.length;
	let filtered = $derived(data.filter((d) => d.includes(value)));

	run(() => {
		if (previousLength !== filtered.length) {
			selected = -1;
		}
	});

	run(() => {
		if (status === 'blur' && selected !== -1) {
			selected = -1;
		}
	});

	async function handleKeyDown(e) {
		switch (e.key) {
			case 'Escape':
				// 				status = 'blur'
				input.blur();
				break;
			case 'Enter':
				value = filtered[selected];
				input.blur();
				break;
			case 'ArrowUp':
				if (selected !== -1) {
					selected = (selected - 1) % filtered.length;
				} else {
					selected = filtered.length - 1;
				}
				await tick();
				if (list) {
					const active = list.querySelector('[data-selected="true"]');
					if (active) {
						if (selected === filtered.length - 1) {
							list.scrollTop = active.offsetTop;
							return;
						}
						// 	suggested by Rplus
						if (active.offsetTop < list.scrollTop) {
							active.scrollIntoView();
						}
						// 					list.scrollTop = active.offsetTop < list.scrollTop
						// 						? active.offsetTop
						// 						: list.scrollTop
					}
				}

				break;
			case 'ArrowDown':
				if (selected !== -1) {
					selected = (selected + 1) % filtered.length;
				} else {
					selected = 0;
				}
				await tick();
				if (list) {
					const active = list.querySelector('[data-selected="true"]');
					if (active) {
						if (selected === 0) {
							list.scrollTop = 0;
							return;
						}
						// 						suggested by Rplus
						if (active.offsetTop + active.clientHeight > list.scrollTop + list.offsetHeight) {
							active.scrollIntoView();
						}
						// original
						// 						list.scrollTop = active.offsetTop + active.clientHeight > list.scrollTop + list.offsetHeight
						// 							? active.offsetTop - active.offsetHeight
						// 							: list.scrollTop
					}
				}

				break;
		}
	}
</script>

<div class="container">
	<label for="combobox-1"> فلان فلان </label>
	<div
		class="wrapper"
		aria-expanded={status === 'focus'}
		aria-owns="listbox-1"
		aria-haspopup="listbox"
	>
		<Input
			placeholder="انتخاب کنید"
			role="combobox"
			id="combobox-1"
			aria-autocomplete="list"
			aria-controls="listbox-1"
			aria-activedescendant={selected !== -1 ? `listbox-1-option-${selected}` : null}
			bind:this={input}
			onkeydown={handleKeyDown}
			required
			bind:value
			type="text"
			onfocus={() => (status = 'focus')}
			onblur={() => (status = 'blur')}
		/>

		{#if status === 'focus' && filtered.length > 0}
			<Card.Root class="absolute z-10 mt-1 min-w-full ">
				<Card.Content class=" px-1">
					<ul bind:this={list} id="listbox-1" class="" role="listbox" tabindex={-1}>
						{#each filtered as d, i (d)}
							<li
								class="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-300"
								id="listbox-1-option-{i}"
								role="option"
								aria-setsize={filtered.length}
								aria-posinset={i + 1}
								aria-selected={selected === i}
								class:selected={selected === i}
								onmousedown={() => (value = d)}
							>
								{d}
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		{:else if filtered.length === 0}
			<span>گزینه‌ای یافت نشد!</span>
		{/if}

		<!-- <div>
			{#if status === 'focus' && filtered.length > 0}
				<ul bind:this={list} id="listbox-1" role="listbox" tabindex={-1}>
					{#each filtered as d, i (d)}
						<li
							id="listbox-1-option-{i}"
							role="option"
							aria-setsize={filtered.length}
							aria-posinset={i + 1}
							aria-selected={selected === i}
							class:selected={selected === i}
							onmousedown={() => (value = d)}
						>
							{d}
						</li>
					{/each}
				</ul>
			{:else if filtered.length === 0}
				<span>گزینه‌ای یافت نشد!</span>
			{/if}
		</div> -->
	</div>
</div>

<style>
	.container {
		width: 250px;
		position: relative;
	}
	/* * {
		box-sizing: border-box;
	}
	.container {
		width: 250px;
		position: relative;
	}

	input {
		width: 100%;
	}

	ul {
		top: 100%;
		width: 100%;
		max-height: 250px;
		overflow-y: auto;
		padding-left: 0;
		list-style: none;
		position: absolute;
		display: block;
		border: 3px solid #000;
	}

	li {
		padding: 5px 10px;
	}

	li:hover,
	.selected {
		background-color: #efefef;
	} */
</style>
