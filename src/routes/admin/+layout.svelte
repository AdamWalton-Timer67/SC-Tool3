<script lang="ts">
	import { page } from '$app/stores';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	const { children }: Props = $props();

	// Admin navigation items with Vanduul theme
	const navItems = [
		{ label: 'Dashboard', href: '/admin', icon: '⚙️', color: 'cyan' },
		{ label: 'Ingredients', href: '/admin/ingredients', icon: '🧪', color: 'purple' },
		{ label: 'Rewards', href: '/admin/rewards', icon: '🎁', color: 'yellow' },
		{ label: 'Locations', href: '/admin/locations', icon: '🗺️', color: 'blue' },
		{ label: 'Suggestions', href: '/admin/suggestions', icon: '💡', color: 'green' }
	];

	function isCurrentPath(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}

	function getNavColors(color: string, isActive: boolean) {
		const colors = {
			cyan: isActive
				? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-400/50'
				: 'bg-slate-900/85 border-white/10 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-400/50',
			purple: isActive
				? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-400/50'
				: 'bg-slate-900/85 border-white/10 text-gray-300 hover:bg-purple-500/10 hover:border-purple-400/50',
			yellow: isActive
				? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-400/50'
				: 'bg-slate-900/85 border-white/10 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-400/50',
			blue: isActive
				? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-lg shadow-blue-400/50'
				: 'bg-slate-900/85 border-white/10 text-gray-300 hover:bg-blue-500/10 hover:border-blue-400/50',
			green: isActive
				? 'bg-green-500/20 border-green-400 text-green-300 shadow-lg shadow-green-400/50'
				: 'bg-slate-900/85 border-white/10 text-gray-300 hover:bg-green-500/10 hover:border-green-400/50'
		};
		return colors[color as keyof typeof colors] || colors.cyan;
	}
</script>

<SpaceBackground />

<div class="font-rajdhani relative z-10 min-h-screen">
	<!-- Admin Header -->
	<header
		class="relative mx-auto mt-4 mb-6 max-w-7xl overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 px-4 py-4 backdrop-blur-xl"
	>
		<!-- Animated top border -->
		<div
			class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-purple-500 to-yellow-400"
		></div>

		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex items-center gap-4">
				<!-- Animated icon -->
				<div class="animate-pulse text-5xl">⚙️</div>
				<div>
					<h1
						class="font-orbitron bg-linear-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-3xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
					>
						Admin Control Panel
					</h1>
					<p class="mt-1 text-xs font-light tracking-widest text-cyan-400 uppercase sm:text-sm">
						Star Citizen Wikelo Emporium • Database Management
					</p>
				</div>
			</div>

			<!-- Back button -->
			<a
				href="/"
				class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
				title="Back to App"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-cyan-400"
				>
					<path d="m12 19-7-7 7-7" />
					<path d="M19 12H5" />
				</svg>
			</a>
		</div>

		<div class="mt-4 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent"></div>
	</header>

	<div class="mx-auto max-w-7xl px-4 pb-8">
		<!-- Navigation Tabs - Improved Design -->
		<nav class="mb-6 flex flex-wrap gap-3">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold tracking-wider uppercase transition-all sm:px-6 {getNavColors(
						item.color,
						isCurrentPath(item.href)
					)} font-orbitron cursor-pointer"
				>
					<span class="text-lg">{item.icon}</span>
					<span class="hidden sm:inline">{item.label}</span>
				</a>
			{/each}
		</nav>

		<!-- Page Content -->
		<div class="rounded-xl border-2 border-white/10 bg-slate-900/85 p-4 backdrop-blur-xl sm:p-6">
			{@render children()}
		</div>
	</div>
</div>
