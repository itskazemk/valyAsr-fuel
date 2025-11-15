<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	// options = [{label:, value:}]

	let { options = $bindable(), value = $bindable(null), name, required = false } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f: any) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<input hidden={true} {name} bind:value {required} />
<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-full justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'انتخاب کنید ...'}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Command.Root>
			<Command.Input placeholder="جستجو" />
			<Command.List>
				<Command.Empty>No framework found.</Command.Empty>
				<Command.Group value="frameworks">
					{#each options as option (option.value)}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== option.value && 'text-transparent')} />
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
