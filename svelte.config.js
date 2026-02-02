import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csrf: { trustedOrigins: ['*'] },
		experimental: { remoteFunctions: true },
	},
	compilerOptions: {
		runes: true,
		experimental: {
			async: true,
		},
	},

	// alt+x
	vitePlugin: {
		inspector: true,
	},
};

export default config;
