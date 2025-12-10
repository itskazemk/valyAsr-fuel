<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';

	let { defaultVersion }: { defaultVersion: string } = $props();

	let selectedVersion = $state(defaultVersion);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<div
				class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
			>
				<GalleryVerticalEndIcon class="size-4" />
			</div>
			<div class="flex flex-col gap-1 leading-none">
				<span class="font-semibold">سامانه سوخت</span>
				<span class="">v{selectedVersion}</span>
			</div>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
