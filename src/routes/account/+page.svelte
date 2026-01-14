<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import type { UserProfile } from '$lib/types/organizations';

	let profile = $state<UserProfile | null>(null);
	let displayName = $state('');
	let isEditingDisplayName = $state(false);
	let isSavingDisplayName = $state(false);
	let saveMessage = $state('');

	onMount(async () => {
		// Force English as default on account page
		wikeloStore.currentLang = 'en';

		// Rediriger vers la page d'accueil si pas connecté
		if (!authStore.user && !authStore.loading) {
			goto('/');
		}

		// Load user profile and organizations
		if (authStore.user) {
			await loadProfile();
			await organizationsStore.loadUserOrganizations();
		}
	});

	async function loadProfile() {
		if (!authStore.user) return;

		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', authStore.user.id)
			.single();

		if (error) {
			console.error('Error loading profile:', error);
			return;
		}

		profile = data;
		displayName = data.display_name || '';
	}

	async function saveDisplayName() {
		if (!authStore.user) return;

		isSavingDisplayName = true;
		saveMessage = '';

		try {
			const { error } = await supabase
				.from('profiles')
				.update({ display_name: displayName || null })
				.eq('id', authStore.user.id);

			if (error) throw error;

			await loadProfile();
			isEditingDisplayName = false;
			saveMessage = wikeloStore.currentLang === 'fr' ? 'Nom sauvegardé !' : 'Name saved!';
			setTimeout(() => saveMessage = '', 3000);
		} catch (err) {
			console.error('Error saving display name:', err);
			saveMessage = wikeloStore.currentLang === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving';
		} finally {
			isSavingDisplayName = false;
		}
	}

	async function handleSignOut() {
		try {
			await authStore.signOut();
			goto('/');
		} catch (err: any) {
			console.error('Erreur lors de la déconnexion:', err);
		}
	}

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Mon Compte',
					subtitle: 'Secteur Stanton • Profil Citoyen',
					accountInfo: 'Informations du Compte',
					activeAccount: 'Compte Actif',
					email: 'Email',
					userId: 'ID Citoyen',
					displayName: 'Nom In-Game',
					displayNamePlaceholder: 'Votre nom dans le jeu',
					edit: 'Modifier',
					save: 'Sauvegarder',
					cancel: 'Annuler',
					createdAt: 'Enregistré le',
					lastSignIn: 'Dernière Connexion',
					backHome: "Retour à l'Accueil",
					signOut: 'Déconnexion',
					sessionInfo:
						'Votre session est automatiquement sauvegardée. Vous resterez connecté même après avoir fermé votre navigateur.',
					loading: 'Chargement...',
					notConnected: 'Vous devez être connecté pour accéder à cette page',
					myOrganizations: 'Mes Organisations',
					noOrganizations: 'Vous ne faites partie d\'aucune organisation',
					joinOrganizations: 'Découvrez et rejoignez des organisations',
					members: 'membres',
					viewOrganization: 'Voir l\'organisation',
					owner: 'Propriétaire',
					admin: 'Administrateur',
					member: 'Membre'
				}
			: {
					title: 'My Account',
					subtitle: 'Stanton Sector • Citizen Profile',
					accountInfo: 'Account Information',
					activeAccount: 'Active Account',
					email: 'Email',
					userId: 'Citizen ID',
					displayName: 'In-Game Name',
					displayNamePlaceholder: 'Your in-game name',
					edit: 'Edit',
					save: 'Save',
					cancel: 'Cancel',
					createdAt: 'Registered',
					lastSignIn: 'Last Sign In',
					backHome: 'Back to Home',
					signOut: 'Sign Out',
					sessionInfo:
						'Your session is automatically saved. You will remain connected even after closing your browser.',
					loading: 'Loading...',
					notConnected: 'You must be logged in to access this page',
					myOrganizations: 'My Organizations',
					noOrganizations: 'You are not part of any organization',
					joinOrganizations: 'Discover and join organizations',
					members: 'members',
					viewOrganization: 'View organization',
					owner: 'Owner',
					admin: 'Admin',
					member: 'Member'
				}
	);
</script>

<svelte:head>
	<title>{t.title} - Wikelo Tools</title>
</svelte:head>

{#if authStore.loading}
	<SpaceBackground />
	<div class="relative z-10 flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"
			></div>
			<p class="font-rajdhani text-lg text-cyan-400">{t.loading}</p>
		</div>
	</div>
{:else if authStore.user}
	<SpaceBackground />
	<div class="font-rajdhani relative z-10 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl">
			<!-- Top Navigation -->
			<div class="mb-6 flex items-start justify-between">
				<!-- Back to Home Button -->
				<a
					href="/"
					class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
					title={t.backHome}
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

				<!-- Language Toggle -->
				<LanguageToggle />
			</div>

			<!-- Header -->
			<header
				class="relative mb-8 overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 backdrop-blur-xl"
			>
				<!-- Animated top border -->
				<div
					class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-yellow-400 to-cyan-400"
				></div>

				<div class="p-6 text-center sm:p-8">
					<div class="mb-4 flex items-center justify-center gap-3 sm:gap-6">
						<div class="animate-spin-slow text-shadow-gold text-4xl text-yellow-400 sm:text-6xl">
							◈
						</div>
						<div>
							<h1
								class="font-orbitron bg-linear-to-r from-yellow-400 to-cyan-400 bg-clip-text text-2xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
							>
								{t.title}
							</h1>
							<p class="mt-1 text-xs font-light tracking-widest text-cyan-400 uppercase sm:text-sm">
								{t.subtitle}
							</p>
						</div>
					</div>
				</div>

				<div class="h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent"></div>
			</header>

			<!-- Profile Card -->
			<div
				class="mb-6 overflow-hidden rounded-xl border-2 border-cyan-400/50 bg-slate-900/85 shadow-2xl shadow-cyan-400/20 backdrop-blur-xl"
			>
				<!-- Profile Header with Gradient -->
				<div
					class="relative border-b border-white/10 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-yellow-500/20 px-6 py-8"
				>
					<div
						class="absolute inset-0 bg-linear-to-r from-cyan-400/10 via-purple-400/10 to-yellow-400/10"
					></div>
					<div class="relative flex items-center space-x-4 sm:space-x-6">
						<!-- Avatar -->
						<div
							class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-cyan-400/50 bg-slate-800 shadow-lg shadow-cyan-400/30 sm:h-24 sm:w-24"
						>
							<span class="font-orbitron text-3xl font-bold text-cyan-400 sm:text-4xl">
								{authStore.user.email?.charAt(0).toUpperCase()}
							</span>
						</div>
						<!-- User Info -->
						<div>
							<h2
								class="font-orbitron text-xl font-bold tracking-wide text-yellow-400 uppercase sm:text-2xl"
							>
								{authStore.user.email?.split('@')[0]}
							</h2>
							<p class="mt-1 flex items-center gap-2 text-sm text-cyan-400 sm:text-base">
								<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
								{t.activeAccount}
							</p>
						</div>
					</div>
				</div>

				<!-- Account Details -->
				<div class="space-y-6 px-6 py-6">
					<div>
						<h3
							class="font-orbitron mb-4 flex items-center gap-2 text-lg font-bold tracking-wider text-cyan-400 uppercase"
						>
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
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							{t.accountInfo}
						</h3>
						<dl class="space-y-4">
							<!-- Email -->
							<div
								class="flex flex-col border-b border-white/10 pb-3 sm:flex-row sm:justify-between"
							>
								<dt
									class="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase sm:mb-0"
								>
									{t.email}
								</dt>
								<dd class="font-mono text-sm break-all text-white">{authStore.user.email}</dd>
							</div>

							<!-- Display Name (In-Game Name) -->
							<div
								class="flex flex-col border-b border-white/10 pb-3 sm:flex-row sm:justify-between sm:items-center"
							>
								<dt
									class="mb-1 text-xs font-semibold tracking-wider text-yellow-400 uppercase sm:mb-0"
								>
									{t.displayName}
								</dt>
								<dd class="flex items-center gap-2">
									{#if isEditingDisplayName}
										<input
											type="text"
											bind:value={displayName}
											placeholder={t.displayNamePlaceholder}
											class="rounded-lg border border-cyan-500/50 bg-slate-800/50 px-3 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
											maxlength="50"
										/>
										<button
											onclick={saveDisplayName}
											disabled={isSavingDisplayName}
											class="rounded-lg border border-green-500/50 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 transition-all hover:border-green-500 hover:bg-green-500/20 disabled:opacity-50"
										>
											{t.save}
										</button>
										<button
											onclick={() => {
												isEditingDisplayName = false;
												displayName = profile?.display_name || '';
											}}
											class="rounded-lg border border-gray-500/50 bg-gray-500/10 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-all hover:border-gray-500 hover:bg-gray-500/20"
										>
											{t.cancel}
										</button>
									{:else}
										<span class="text-sm text-white font-semibold">
											{profile?.display_name || 'Inconnu'}
										</span>
										<button
											onclick={() => isEditingDisplayName = true}
											class="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-all hover:border-cyan-500 hover:bg-cyan-500/20"
										>
											{t.edit}
										</button>
									{/if}
									{#if saveMessage}
										<span class="text-xs text-green-400 animate-pulse">{saveMessage}</span>
									{/if}
								</dd>
							</div>

							<!-- User ID -->
							<div
								class="flex flex-col border-b border-white/10 pb-3 sm:flex-row sm:justify-between"
							>
								<dt
									class="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase sm:mb-0"
								>
									{t.userId}
								</dt>
								<dd class="font-mono text-xs break-all text-gray-300">{authStore.user.id}</dd>
							</div>
							<!-- Created At -->
							<div
								class="flex flex-col border-b border-white/10 pb-3 sm:flex-row sm:justify-between"
							>
								<dt
									class="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase sm:mb-0"
								>
									{t.createdAt}
								</dt>
								<dd class="text-sm text-white">
									{new Date(authStore.user.created_at || '').toLocaleDateString(
										wikeloStore.currentLang === 'fr' ? 'fr-FR' : 'en-GB',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}
									)}
								</dd>
							</div>
							<!-- Last Sign In -->
							<div
								class="flex flex-col border-b border-white/10 pb-3 sm:flex-row sm:justify-between"
							>
								<dt
									class="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase sm:mb-0"
								>
									{t.lastSignIn}
								</dt>
								<dd class="text-sm text-white">
									{new Date(authStore.user.last_sign_in_at || '').toLocaleDateString(
										wikeloStore.currentLang === 'fr' ? 'fr-FR' : 'en-GB',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										}
									)}
								</dd>
							</div>
						</dl>
					</div>

					<!-- Actions -->
					<div class="space-y-3 pt-6">
						<a
							href="/"
							class="group font-orbitron relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-cyan-400/50 bg-slate-800/50 px-6 py-3 font-bold tracking-wider text-cyan-400 uppercase transition-all hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
						>
							<div
								class="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
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
								class="relative"
							>
								<path d="m12 19-7-7 7-7" />
								<path d="M19 12H5" />
							</svg>
							<span class="relative">{t.backHome}</span>
						</a>
						<button
							onclick={handleSignOut}
							class="group font-orbitron relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-red-400/50 bg-slate-800/50 px-6 py-3 font-bold tracking-wider text-red-400 uppercase transition-all hover:border-red-400 hover:shadow-lg hover:shadow-red-400/20"
						>
							<div
								class="absolute inset-0 bg-linear-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
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
								class="relative"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
								<polyline points="16 17 21 12 16 7" />
								<line x1="21" y1="12" x2="9" y2="12" />
							</svg>
							<span class="relative">{t.signOut}</span>
						</button>
					</div>
				</div>
			</div>

			<!-- My Organizations Section -->
			<div
				class="mb-6 overflow-hidden rounded-xl border-2 border-yellow-400/50 bg-slate-900/85 shadow-2xl shadow-yellow-400/20 backdrop-blur-xl"
			>
				<div class="border-b border-white/10 bg-linear-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 px-6 py-4">
					<h3
						class="font-orbitron flex items-center gap-2 text-lg font-bold tracking-wider text-yellow-400 uppercase"
					>
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
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
							<path d="M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
						{t.myOrganizations}
					</h3>
				</div>

				<div class="p-6">
					{#if organizationsStore.userOrganizations.length === 0}
						<div class="text-center py-8">
							<p class="text-6xl mb-4">👥</p>
							<p class="text-gray-400 mb-4">{t.noOrganizations}</p>
							<a
								href="/organizations"
								class="inline-flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20"
							>
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
								</svg>
								{t.joinOrganizations}
							</a>
						</div>
					{:else}
						<div class="grid gap-4 sm:grid-cols-2">
							{#each organizationsStore.userOrganizations as org}
								<a
									href="/organizations/{org.slug}"
									class="group relative overflow-hidden rounded-lg border border-yellow-500/30 bg-slate-800/50 p-4 transition-all hover:scale-[1.02] hover:border-yellow-500/70 hover:shadow-lg hover:shadow-yellow-500/20"
								>
									<div class="mb-3 flex items-start justify-between gap-2">
										<h4 class="font-orbitron text-lg font-bold text-yellow-400 group-hover:text-yellow-300">
											{org.name}
										</h4>
										{#if org.user_role === 'owner'}
											<span class="rounded-full border border-purple-500/50 bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
												{t.owner}
											</span>
										{:else if org.user_role === 'admin'}
											<span class="rounded-full border border-blue-500/50 bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400">
												{t.admin}
											</span>
										{:else}
											<span class="rounded-full border border-green-500/50 bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
												{t.member}
											</span>
										{/if}
									</div>

									{#if org.description}
										<p class="mb-3 line-clamp-2 text-sm text-gray-400">
											{org.description}
										</p>
									{/if}

									<div class="flex items-center justify-between">
										<div class="flex items-center gap-1 text-sm text-cyan-400">
											<span>👥</span>
											<span>{org.member_count || 0} {t.members}</span>
										</div>
										<span class="text-xs text-yellow-400/70 group-hover:text-yellow-400">
											{t.viewOrganization} →
										</span>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Session Info -->
			<div class="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 backdrop-blur-sm">
				<div class="flex items-start gap-3">
					<svg
						class="mt-0.5 h-5 w-5 shrink-0 text-cyan-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="text-sm text-cyan-300">
						{t.sessionInfo}
					</p>
				</div>
			</div>
		</div>
	</div>
{:else}
	<SpaceBackground />
	<div class="relative z-10 flex min-h-screen items-center justify-center">
		<div
			class="max-w-md rounded-xl border-2 border-red-400/50 bg-slate-900/85 p-8 text-center backdrop-blur-xl"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="64"
				height="64"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mx-auto mb-4 text-red-400"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="m15 9-6 6" />
				<path d="m9 9 6 6" />
			</svg>
			<p class="font-orbitron mb-6 text-xl text-red-400">{t.notConnected}</p>
			<a
				href="/"
				class="font-orbitron inline-block rounded-lg bg-cyan-600 px-6 py-3 font-bold tracking-wider text-white uppercase transition-colors hover:bg-cyan-700"
			>
				{t.backHome}
			</a>
		</div>
	</div>
{/if}
