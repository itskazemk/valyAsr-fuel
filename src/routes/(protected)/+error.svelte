<!-- <script lang="ts">
	
</script>

<h1>{page.status} {page.error.message}</h1>
<span style="font-size: 10em"> hey </span> -->

<script>
	import { page } from '$app/state';
</script>

<div class="wrapper">
	<div class="card">
		<div class="status">{page.status}</div>

		<h1>متاسفانه خطایی پیش آمده است</h1>

		<p class="message">{page.error?.message}</p>

		<p class="hint">متاسفانه خطایی پیش آمده است</p>

	</div>

	<div class="glow" />
</div>

<style>
	:global(body) {
		margin: 0;
		background: radial-gradient(circle at top, #ff6a33, #ff3e00 45%, #1a0f0a 100%);
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	.wrapper {
		min-height: 100vh;
		display: grid;
		place-items: center;
		position: relative;
		overflow: hidden;
		color: white;
	}

	.card {
		position: relative;
		z-index: 1;
		width: min(420px, 90vw);
		padding: 42px 32px;
		text-align: center;
		border-radius: 18px;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(14px);
		box-shadow:
			0 30px 60px rgba(0, 0, 0, 0.55),
			inset 0 0 0 1px rgba(255, 255, 255, 0.06);
		animation: float 6s ease-in-out infinite;
	}

	.status {
		font-size: 72px;
		font-weight: 800;
		letter-spacing: -2px;
		color: #ffb199;
		margin-bottom: 12px;
	}

	h1 {
		font-size: 24px;
		margin: 0 0 10px;
	}

	.message {
		font-size: 15px;
		line-height: 1.6;
		opacity: 0.9;
		margin-bottom: 14px;
	}

	.hint {
		font-size: 14px;
		opacity: 0.75;
		margin-bottom: 28px;
	}

	.btn {
		display: inline-block;
		padding: 12px 28px;
		border-radius: 999px;
		background: linear-gradient(135deg, #ff6a33, #ff3e00);
		color: white;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 16px 35px rgba(0, 0, 0, 0.55);
	}

	.glow {
		position: absolute;
		inset: auto;
		width: 420px;
		height: 420px;
		background: radial-gradient(circle, #ff3e00, transparent 65%);
		filter: blur(120px);
		opacity: 0.45;
		animation: pulse 5s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.4;
		}
		50% {
			transform: scale(1.15);
			opacity: 0.6;
		}
	}
</style>
