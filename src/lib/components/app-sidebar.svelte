<script lang="ts" module>
	// sample data
	const data = {
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
		navMain: [
			{
				title: 'Getting Started',
				url: '#',
				items: [
					{
						title: 'اطلاعات پایه',
						url: '/baseInfo'
					},
					{
						title: 'وسایل نقلیه',
						url: '/vehicles'
					},
					{
						title: 'ماموریت',
						url: '/mission'
					},
					{
						title: 'سوخت دریافتی',
						url: '/received-fuel'
					},
					{
						title: 'سوخت تحویلی',
						url: '/delivered-fuel'
					},
					{
						title: 'گزارشات',
						url: '/reports'
					}
				]
			}
			// {
			// 	title: "Building Your Application",
			// 	url: "#",
			// 	items: [
			// 		{
			// 			title: "Routing",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Data Fetching",
			// 			url: "#",
			// 			isActive: true,
			// 		},
			// 		{
			// 			title: "Rendering",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Caching",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Styling",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Optimizing",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Configuring",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Testing",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Authentication",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Deploying",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Upgrading",
			// 			url: "#",
			// 		},
			// 		{
			// 			title: "Examples",
			// 			url: "#",
			// 		},
			// 	],
			// },
		]
	};
</script>

<script lang="ts">
	import SearchForm from './search-form.svelte';
	import VersionSwitcher from './version-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	// $inspect(page.url.pathname);
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
		<SearchForm />
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							{@const isActive =
								item.url.toLocaleLowerCase() === page.url.pathname.toLocaleLowerCase()}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton {isActive}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
