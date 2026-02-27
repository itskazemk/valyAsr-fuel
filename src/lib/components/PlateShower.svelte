<script lang="ts">
	let { plate } = $props();

	const plateSplitted = $derived(plate.split('_'));
</script>

<div class="flex flex-row-reverse justify-center gap-2">
	{#each plateSplitted as char}
		<span>{char}</span>
	{/each}
</div>
