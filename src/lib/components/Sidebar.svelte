<script lang="ts">
	import { enhance } from '$app/forms';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { redirect } from '@sveltejs/kit';
	import { logoutRemoteFn } from '../../routes/(public)/auth/auth.remote';
	import Button from './ui/button/button.svelte';
	// import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar side="right" />
	<Sidebar.Inset>
		<header class="flex items-center justify-between border-b">
			<div class="flex h-16 items-center px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
			</div>
			<div class="p-4">
				<Button
					onclick={async () => {
						try {
							const { redirect: redirectAddress } = await logoutRemoteFn();
							window.location.href = redirectAddress;
						} catch (error) {
							console.log(error);
						}
					}}>خروج</Button
				>
			</div>

			<!-- <Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="##">Building Your Application</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root> -->
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4">
			<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-2 md:min-h-min">
				{@render children()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
