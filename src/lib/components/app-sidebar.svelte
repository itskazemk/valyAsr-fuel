<script lang="ts" module>
	// sample data
	const data = {
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
		navMain: [
			{
				title: 'اطلاعات پایه',
				url: '/base-info',
			},
			{
				title: 'وسایل نقلیه',
				url: '/vehicles',
			},
			{
				title: 'سوخت دریافتی',
				url: '/fuel-inputs',
			},
			{
				title: 'سوخت تحویلی',
				url: '/fuel-outputs',
			},
			// {
			// 	title: 'گزارشات',
			// 	url: '/reports',
			// },

			{
				title: 'گزارشات',
				items: [
					{
						title: 'first',
						url: 'report/first',
					},
					{
						title: 'two',
						url: 'report/two',
					},
				],
			},
		],
	};
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import type { ComponentProps } from 'svelte';
	import SearchForm from './search-form.svelte';
	import VersionSwitcher from './version-switcher.svelte';
	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header>
		<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
		<SearchForm />
	</Sidebar.Header>
	<Sidebar.Content class="gap-0">
		<!-- We create a collapsible SidebarGroup for each parent. -->
		{#each data.navMain as navItem (navItem.title)}
			{#if navItem.url}<Sidebar.Group>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={navItem.url} {...props}>{navItem.title}</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Group>{:else}
				<Collapsible.Root title={navItem.title} open class="group/collapsible">
					<Sidebar.Group>
						<Sidebar.GroupLabel
							class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							{#snippet child({ props })}
								<Collapsible.Trigger {...props}>
									{navItem.title}
									<ChevronRightIcon
										class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
									/>
								</Collapsible.Trigger>
							{/snippet}
						</Sidebar.GroupLabel>
						<Collapsible.Content>
							<Sidebar.GroupContent>
								<Sidebar.Menu>
									{#each navItem.items as subItem (subItem.title)}
										<Sidebar.MenuItem>
											<Sidebar.MenuButton isActive={subItem.isActive}>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>{subItem.title}</a>
												{/snippet}
											</Sidebar.MenuButton>
										</Sidebar.MenuItem>
									{/each}
								</Sidebar.Menu>
							</Sidebar.GroupContent>
						</Collapsible.Content>
					</Sidebar.Group>
				</Collapsible.Root>
			{/if}
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
