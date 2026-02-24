<script>
	import AreaChart from '$lib/components/Report/area-chart.svelte';
	import { reportStates } from '../reportStates.svelte';

	const data = [
		{ date: new Date('2024-01-01'), desktop: 186, mobile: 80 },
		{ date: new Date('2024-01-05'), desktop: 305, mobile: 200 },
		{ date: new Date('2024-01-10'), desktop: 237, mobile: 120 },
		{ date: new Date('2024-01-15'), desktop: 73, mobile: 190 },
		{ date: new Date('2024-01-20'), desktop: 209, mobile: 130 },
		{ date: new Date('2024-01-30'), desktop: 214, mobile: 140 },
	];

	const chartConfig = {
		desktop: { label: 'ورودی', color: 'var(--chart-1)' },
		mobile: { label: 'خروجی', color: 'var(--chart-2)' },
	};

	const series = [
		{
			key: 'mobile',
			label: 'خروجی',
			color: chartConfig.mobile.color,
		},
		{
			key: 'desktop',
			label: 'ورودی',
			color: chartConfig.desktop.color,
		},
	];
</script>

<AreaChart {data} {chartConfig} {series} />

<div>{reportStates.startDate}</div>
