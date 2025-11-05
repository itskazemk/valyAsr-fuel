<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('fa-IR', {
		dateStyle: 'long'
	});

	let value = $state<DateValue>();
</script>

<div class="grid grid-cols-2 gap-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>بنزین</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<Field.Set>
				<Field.Group>
					<Field.Field>
						<Field.Label for="date">تاریخ</Field.Label>
						<Input id="date" />
					</Field.Field>
					<Field.Field>
						<Field.Label for="amount">مقدار (لیتر)</Field.Label>
						<Input id="amount" />

						<Popover.Root>
							<Popover.Trigger>
								{#snippet child({ props })}
									<Button
										variant="outline"
										class={cn(
											'w-[280px] justify-start text-left font-normal',
											!value && 'text-muted-foreground'
										)}
										{...props}
									>
										<CalendarIcon class="mr-2 size-4" />
										{value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date'}
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0">
								<Calendar bind:value type="single" initialFocus />
							</Popover.Content>
						</Popover.Root>
						<!-- <Input id="amount" aria-invalid /> -->
						<!-- <Field.Error>Choose another username.</Field.Error> -->
					</Field.Field>
					<!-- <Field.Field orientation="horizontal">
						<Switch id="newsletter" />
						<Field.Label for="newsletter">Subscribe to the newsletter</Field.Label>
					</Field.Field> -->
				</Field.Group>
			</Field.Set>
		</Card.Content>
		<!-- <Card.Footer>
			<p>Card Footer</p>
		</Card.Footer> -->
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>گازوییل</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<p>Card Content</p>
		</Card.Content>
		<!-- <Card.Footer>
			<p>Card Footer</p>
		</Card.Footer> -->
	</Card.Root>
</div>
