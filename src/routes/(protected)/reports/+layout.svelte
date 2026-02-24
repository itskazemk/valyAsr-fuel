<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import TestDatePicker from '$lib/test/TestDatePicker.svelte';
	import {
		endOfMonth,
		getLocalTimeZone,
		PersianCalendar,
		startOfMonth,
		toCalendar,
		today,
	} from '@internationalized/date';
	import { reportStates } from './reportStates.svelte';

	let { children } = $props();

	const todayInGregorian = today(getLocalTimeZone());
	let todayInPersianCalendar = toCalendar(todayInGregorian, new PersianCalendar());

	const firstDayOfPersianMonth = startOfMonth(todayInPersianCalendar);

	//  Last day of this Persian month
	const lastDayOfPersianMonth = endOfMonth(todayInPersianCalendar);

	let searchStartDate = $state<string>(firstDayOfPersianMonth.toString());
	let searchEndDate = $state<string>(lastDayOfPersianMonth.toString());

	// let searchData = $state({
	// 	startDate: searchStartDate,
	// 	endDate: searchEndDate,
	// });

	reportStates.startDate = searchStartDate;
	reportStates.endDate = searchEndDate;
</script>

<form class="grid grid-cols-4 items-end gap-2 rounded-md p-2">
	<label>
		تاریخ شروع
		<TestDatePicker id="searchStartDate" name="searchStartDate" bind:date={reportStates.startDate} />
	</label>

	<label>
		تاریخ پایان
		<TestDatePicker id="searchEndDate" name="searchEndDate" bind:date={reportStates.endDate} />
	</label>
	<Button class="">جستجو</Button>
</form>

{@render children()}
