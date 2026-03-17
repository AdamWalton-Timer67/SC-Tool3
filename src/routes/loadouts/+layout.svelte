<script lang="ts">
	import { page } from '$app/stores';
	const tabs = [
		{ href: '/loadouts/calculator', label: 'Calculator' },
		{ href: '/loadouts/my', label: 'My Loadouts' },
		{ href: '/loadouts/lasers', label: 'Lasers' },
		{ href: '/loadouts/modules', label: 'Modules' }
	];
</script>

<div class="mx-auto max-w-6xl p-4 text-white">
	<h1 class="mb-4 text-3xl font-bold">Mining Loadouts</h1>
	<div class="mb-6 flex gap-2">
		{#each tabs as tab}
			<a
				href={tab.href}
				class="rounded border px-3 py-1 {$page.url.pathname === tab.href
					? 'bg-cyan-700'
					: 'bg-slate-800'}">{tab.label}</a
			>
		{/each}
	</div>
	<slot />
</div>
