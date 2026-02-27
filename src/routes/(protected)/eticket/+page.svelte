<script lang="ts">
	function pdfOutput() {
		window.print();
	}

	import { read, utils } from 'xlsx';

	let sheetDataJson = $state([]);

	function handleFile(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			const data = new Uint8Array(e.target?.result as ArrayBuffer);
			const workbook = read(data, { type: 'array' });

			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];

			sheetDataJson = utils.sheet_to_json(sheet);
			console.log(sheetDataJson);
		};

		reader.readAsArrayBuffer(file);
	}
</script>

<input type="file" accept=".xlsx,.xls" onchange={handleFile} />

<button onclick={pdfOutput}> print </button>

<div class="w-full overflow-scroll">
	<div id="printable" class="flex h-full w-[100cm] items-center justify-center gap-2">
		<div class="grid grid-cols-10 gap-1" style="">
			{#each sheetDataJson as person}
				<div class="card">
					<div class="content">
						<h2 class="font-bnazanin text-4xl font-bold">{person?.firstName} {person?.lastName}</h2>
						<div class="numbers">
							<span>{person?.c1}</span>
							<span>{person?.c2}</span>
							<span>{person?.c3}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
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
		width: 9.8cm;
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
