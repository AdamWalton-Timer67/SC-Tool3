import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

function toOrigin(value) {
	if (!value) return null;
	try {
		return new URL(value).origin;
	} catch {
		return null;
	}
}

function getTrustedOrigins() {
	const fromList = (process.env.CSRF_TRUSTED_ORIGINS || '')
		.split(',')
		.map((item) => toOrigin(item.trim()))
		.filter(Boolean);

	const direct = [
		toOrigin(process.env.ORIGIN),
		toOrigin(process.env.PUBLIC_OAUTH_REDIRECT_URL)
	].filter(Boolean);

	return [...new Set([...direct, ...fromList])];
}

const trustedOrigins = getTrustedOrigins();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins
		}
	}
};

export default config;
