<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { AreaChart } from 'layerchart';

	// let {
	// 	data = [],
	// 	dataShape = { item1: { key: 'test1', label: 'Test 1' }, item2: { key: 'test2', label: 'Test 2' } },
	// 	chartConfig = {
	// 		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	// 		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	// 	},
	// } = $props();

	let { data, chartConfig, series } = $props();

	// const series = $derived(
	// 	Object.entries(dataShape).map(([key, value], index) => {
	// 		return { key: value.key, label: value.label, color: `var(--chart-${index + 1})` };
	// 	}),
	// );

	// const data = [
	// 	{ date: new Date('2024-01-01'), desktop: 186, mobile: 80 },
	// 	{ date: new Date('2024-01-05'), desktop: 305, mobile: 200 },
	// 	{ date: new Date('2024-01-10'), desktop: 237, mobile: 120 },
	// 	{ date: new Date('2024-01-15'), desktop: 73, mobile: 190 },
	// 	{ date: new Date('2024-01-20'), desktop: 209, mobile: 130 },
	// 	{ date: new Date('2024-01-30'), desktop: 214, mobile: 140 },
	// ];

	// const chartConfig = {
	// 	desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	// 	mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	// } satisfies Chart.ChartConfig;

	// const series = [
	// 	{
	// 		key: 'mobile',
	// 		label: 'Mobile',
	// 		color: chartConfig.mobile.color,
	// 	},
	// 	{
	// 		key: 'desktop',
	// 		label: 'Desktop',
	// 		color: chartConfig.desktop.color,
	// 	},
	// ];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>مقایسه سوخت ورودی و خروجی</Card.Title>
		<!-- <Card.Description>Showing total visitors for the last 6 months</Card.Description> -->
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig}>
			<AreaChart
				legend
				{data}
				{series}
				x="date"
				xScale={scaleUtc()}
				yPadding={[0, 25]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween',
					},
					xAxis: {
						format: (v: Date) => v.toLocaleDateString('fa-ir', { day: '2-digit' }),
					},
					yAxis: { format: () => '' },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('fa-ir', { day: '2-digit' });
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
