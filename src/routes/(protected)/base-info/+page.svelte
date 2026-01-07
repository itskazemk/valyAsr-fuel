<script lang="ts">
	import { getBaseInfo } from './baseInfos.remote';

	let values = await getBaseInfo(null);
</script>

<div>
	{#each values as value}
		<a class="rounded-md p-2 hover:bg-blue-300" href="/base-info/{value.id}"
			><p class="inline">{value.persianTitle}</p></a
		>
	{/each}
	<a class="rounded-md p-2 hover:bg-blue-300" href="/base-info/fuel-price">قیمت سوخت</a>
</div>
