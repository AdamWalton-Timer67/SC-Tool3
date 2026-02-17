import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csrf: {
			// Allow POSTs from any origin in self-hosted NAS/reverse-proxy deployments.
			// This avoids false positives caused by forwarded host/protocol mismatches.
			trustedOrigins: ['*']
		}
	}
};

export default config;
