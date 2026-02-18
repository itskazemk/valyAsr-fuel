<script>
	let { testV = $bindable() } = $props();
</script>

<button onclick={() => (testV = 6969)}>CHNAGE</button>

<div class="bg-red-400 p-2">{testV}</div>
