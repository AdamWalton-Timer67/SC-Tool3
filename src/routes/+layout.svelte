<script lang="ts">
	import '../app.css';
	import AuthDialog from '$lib/components/AuthDialog.svelte';
	import { navigating } from '$app/stores';

	let { children } = $props();

	// Reset scroll position on page navigation
	$effect(() => {
		if ($navigating) {
			window.scrollTo(0, 0);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{@render children?.()}

<!-- Auth Dialog -->
<AuthDialog />
