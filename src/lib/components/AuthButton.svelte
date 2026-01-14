<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { page } from '$app/stores';

	interface Props {
		variant?: 'home' | 'compact';
	}

	let { variant = 'home' }: Props = $props();

	const isAdmin = $derived($page.data.isAdmin ?? false);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					signIn: 'Connexion',
					myAccount: 'Mon compte',
					admin: 'Administration',
					signOut: 'Déconnexion',
					loading: 'Chargement...'
				}
			: {
					signIn: 'Sign In',
					myAccount: 'My Account',
					admin: 'Admin',
					signOut: 'Sign Out',
					loading: 'Loading...'
				}
	);
</script>

{#if authStore.loading}
	<div
		class="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-slate-900/80 px-4 py-2 backdrop-blur-sm"
	>
		<div class="h-4 w-20 animate-pulse rounded bg-cyan-400/20"></div>
	</div>
{:else if authStore.user}
	<!-- Authenticated state -->
	{#if variant === 'home'}
		<div class="flex items-center gap-2">
			<!-- Admin button (only if user is admin) -->
			{#if isAdmin}
				<a
					href="/admin"
					class="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-purple-400/50 bg-slate-900/80 px-4 py-2 backdrop-blur-sm transition-all hover:border-purple-400"
				>
					<div
						class="absolute inset-0 bg-linear-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 opacity-0 transition-opacity group-hover:opacity-100"
					></div>
					<span
						class="font-orbitron relative text-sm font-bold tracking-wider text-purple-400 uppercase"
						>{t.admin}</span
					>
				</a>
			{/if}

			<!-- My Account button -->
			<a
				href="/account"
				class="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-cyan-400/50 bg-slate-900/80 px-4 py-2 backdrop-blur-sm transition-all hover:border-cyan-400"
			>
				<div
					class="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
				<span
					class="font-orbitron relative text-sm font-bold tracking-wider text-cyan-400 uppercase"
					>{t.myAccount}</span
				>
			</a>

			<!-- Sign Out button -->
			<button
				onclick={() => authStore.signOut()}
				class="group relative overflow-hidden rounded-lg border-2 border-red-400/50 bg-slate-900/80 px-4 py-2 backdrop-blur-sm transition-all hover:border-red-400"
			>
				<div
					class="absolute inset-0 bg-linear-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
				<span class="font-orbitron relative text-sm font-bold tracking-wider text-red-400 uppercase"
					>{t.signOut}</span
				>
			</button>
		</div>
	{:else}
		<!-- Compact version for other pages -->
		<div class="flex items-center gap-2">
			<!-- Admin button (compact) -->
			{#if isAdmin}
				<a
					href="/admin"
					class="cursor-pointer rounded-lg border-2 border-purple-500/50 bg-slate-900/80 p-3 shadow-lg shadow-purple-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-purple-500/70 hover:bg-slate-800/90 hover:shadow-purple-500/40"
					title={t.admin}
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
						class="text-purple-400"
					>
						<path d="M12 2L2 7l10 5 10-5-10-5z" />
						<path d="M2 17l10 5 10-5" />
						<path d="M2 12l10 5 10-5" />
					</svg>
				</a>
			{/if}

			<a
				href="/account"
				class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
				title={t.myAccount}
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
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
			</a>
			<button
				onclick={() => authStore.signOut()}
				class="rounded-lg border-2 border-red-500/50 bg-slate-900/80 p-3 shadow-lg shadow-red-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-red-500/70 hover:bg-slate-800/90 hover:shadow-red-500/40"
				title={t.signOut}
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
					class="text-red-400"
				>
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
					<polyline points="16 17 21 12 16 7" />
					<line x1="21" y1="12" x2="9" y2="12" />
				</svg>
			</button>
		</div>
	{/if}
{:else}
	<!-- Not authenticated - Sign In button -->
	{#if variant === 'home'}
		<button
			onclick={() => authStore.openAuthDialog()}
			class="group relative overflow-hidden rounded-lg border-2 border-yellow-400/50 bg-slate-900/80 px-6 py-3 shadow-lg backdrop-blur-sm transition-all hover:border-yellow-400 hover:shadow-yellow-400/20"
		>
			<!-- Animated glow effect -->
			<div
				class="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-yellow-400/20 to-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-100"
			></div>

			<!-- Icon + Text -->
			<div class="relative flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-yellow-400"
				>
					<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
					<polyline points="10 17 15 12 10 7" />
					<line x1="15" y1="12" x2="3" y2="12" />
				</svg>
				<span class="font-orbitron text-base font-bold tracking-wider text-yellow-400 uppercase"
					>{t.signIn}</span
				>
			</div>
		</button>
	{:else}
		<!-- Compact version -->
		<button
			onclick={() => authStore.openAuthDialog()}
			class="rounded-lg border-2 border-yellow-500/50 bg-slate-900/80 p-3 shadow-lg shadow-yellow-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-yellow-500/70 hover:bg-slate-800/90 hover:shadow-yellow-500/40"
			title={t.signIn}
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
				class="text-yellow-400"
			>
				<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
				<polyline points="10 17 15 12 10 7" />
				<line x1="15" y1="12" x2="3" y2="12" />
			</svg>
		</button>
	{/if}
{/if}
