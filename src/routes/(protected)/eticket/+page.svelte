<script lang="ts">
	function pdfOutput() {
		window.print();
	}
</script>

<button onclick={pdfOutput}> print </button>

<div id="printable" class="flex h-full items-center justify-center gap-2">
	<!-- <div class="animate-bounce border border-dashed border-black p-2">
		<span>در حال تکمیل ...</span>
	</div> -->

	<div class="grid grid-cols-4 gap-1" style="">
		{#each { length: 100 } as i}
			<div class="card">
				<div class="content">
					<h2 class="font-bnazanin text-4xl font-bold">محمدکاظم کمالی‌اردکانی</h2>
					<div class="numbers">
						<span>428</span>
						<span>2</span>
						<span>114</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	@media print {
		:global {
			body * {
				visibility: hidden;
			}

			#printable,
			#printable * {
				visibility: visible;
			}

			#printable {
				position: absolute;
				inset: 0;
			}
		}
	}

	.card {
		position: relative;
		width: 10cm;
		height: 3cm;
		overflow: hidden;
		border: 0.5cm solid black;
	}

	/* Left triangle */
	.card::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-bottom: 80px solid red;
		border-right: 100px solid transparent;
		z-index: 1;
	}

	/* Right triangle */
	.card::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		border-top: 80px solid red;
		border-left: 100px solid transparent;
		z-index: 1;
	}

	/* 👇 content above triangles */
	.content {
		position: relative;
		z-index: 2;
		height: 100%;
		padding: 5px 0px 0px 0px;
		text-align: center;
	}

	h2 {
		text-shadow:
			-1px -1px 0 white,
			1px -1px 0 white,
			-1px 1px 0 white,
			1px 1px 0 white;
		text-box: trim-both cap alphabetic;
	}

	.numbers {
		margin-top: 8px;
		direction: ltr;
		display: flex;
		justify-content: center;
		gap: 60px;

		text-shadow:
			-1px -1px 0 white,
			1px -1px 0 white,
			-1px 1px 0 white,
			1px 1px 0 white;
	}

	.numbers span {
		font-family: 'Vazirmatn';
		font-size: 35px;
		font-weight: 800;
		font-feature-settings: 'ss01';
	}
</style>
