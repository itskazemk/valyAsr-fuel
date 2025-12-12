<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator,
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { asset } from '$app/paths';
	import { enhance } from '$app/forms';

	let { class: className, formData, ...restProps } = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root class="overflow-hidden p-0">
		<Card.Content class="grid p-0 md:grid-cols-2">
			<form method="post" action="?/login" use:enhance autocomplete="off" class="p-6 md:p-8">
				<FieldGroup>
					<div class="flex flex-col items-center gap-2 text-center">
						<h1 class="text-2xl font-bold">سامانه مدیریت سوخت مرکز آموزش ولیعصر (عج)</h1>
						<p style="color: red">{formData?.message ?? ''}</p>
					</div>
					<Field>
						<FieldLabel for="username-{id}">نام کاربری</FieldLabel>
						<Input id="username-{id}" name="username" type="text" required class="ltr_dir" />
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{id}">رمز عبور</FieldLabel>
						</div>
						<Input id="password-{id}" name="password" type="password" required class="ltr_dir" />
					</Field>
					<Field>
						<Button type="submit">ورود</Button>
					</Field>
				</FieldGroup>
			</form>
			<div class="relative hidden bg-muted md:block">
				<img
					src={asset('/images/valiAsr_entery.jpg')}
					alt="placeholder"
					class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</Card.Content>
	</Card.Root>
	<!-- <FieldDescription class="px-6 text-center">
		By clicking continue, you agree to our <a href="##">Terms of Service</a> and
		<a href="##">Privacy Policy</a>.
	</FieldDescription> -->
</div>
