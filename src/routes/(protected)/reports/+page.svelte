<div class="flex h-full items-center justify-center gap-2">
	<!-- <div class="animate-bounce border border-dashed border-black p-2">
		<span>در حال تکمیل ...</span>
	</div> -->

	<div class="grid grid-cols-5 gap-4">
		{#each { length: 10 } as i}
			<div class="card">
				<div class="content">
					<h2 class="font-bnazanin text-2xl font-bold">محمدکاظم کمالی‌اردکانی</h2>
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
	.card {
		position: relative;
		width: 300px;
		height: 80px;
		overflow: hidden;
		border: 10px solid black;
	}

	/* Left triangle */
	.card::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-top: 60px solid red;
		border-right: 100px solid transparent;
		z-index: 1;
	}

	/* Right triangle */
	.card::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		border-bottom: 60px solid red;
		border-left: 100px solid transparent;
		z-index: 1;
	}

	/* 👇 content above triangles */
	.content {
		position: relative;
		z-index: 2;
		height: 100%;
		padding: 0 24px;
		text-align: center;
	}

	.numbers {
		display: flex;
		justify-content: center;
		gap: 48px;
	}

	.numbers span {
		font-family: 'B Nazanin';
		font-size: 24px;
		font-weight: bold;
	}
</style>
