<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/styles/wikelo.css';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import OrganizationCard from '$lib/components/organizations/OrganizationCard.svelte';
	import OrganizationSearch from '$lib/components/organizations/OrganizationSearch.svelte';
	import CreateOrganizationDialog from '$lib/components/organizations/CreateOrganizationDialog.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showCreateDialog = $state(false);
	let pendingRequests = $state<Set<string>>(new Set());
	let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let hasSearched = $state(false);

	onMount(async () => {
		// Initialize organizations from server data
		organizationsStore.organizations = data.organizations || [];

		// Load user organizations and pending requests if user is logged in
		if (organizationsStore.currentUser) {
			await organizationsStore.loadUserOrganizations();
			await loadPendingRequests();

			// Mark organizations where user is a member
			organizationsStore.organizations = organizationsStore.organizations.map(org => {
				const userOrg = organizationsStore.userOrganizations.find(uo => uo.id === org.id);
				return {
					...org,
					is_member: !!userOrg,
					user_role: userOrg?.user_role
				};
			});
		}
	});

	async function loadPendingRequests() {
		// Load all pending requests for current user
		for (const org of organizationsStore.organizations) {
			const request = await organizationsStore.checkPendingRequest(org.id);
			if (request) {
				pendingRequests.add(org.id);
			}
		}
	}

	async function handleSearch(query: string) {
		organizationsStore.searchQuery = query;

		// Clear existing debounce timer
		if (searchDebounceTimer) {
			clearTimeout(searchDebounceTimer);
		}

		// Reset to user organizations if query is empty
		if (!query.trim()) {
			hasSearched = false;
			organizationsStore.organizations = organizationsStore.userOrganizations;
			return;
		}

		// Only search if query has at least 2 characters
		if (query.trim().length < 2) {
			hasSearched = false;
			organizationsStore.organizations = organizationsStore.userOrganizations;
			return;
		}

		// Debounce search by 300ms
		searchDebounceTimer = setTimeout(async () => {
			hasSearched = true;
			await organizationsStore.searchOrganizations(query);
		}, 300);
	}

	async function handleJoinClick(orgId: string) {
		if (!organizationsStore.currentUser) {
			authStore.showAuthDialog = true;
			return;
		}

		try {
			await organizationsStore.sendJoinRequest(orgId);
			pendingRequests.add(orgId);
			pendingRequests = new Set(pendingRequests);
			alert(t.joinSuccess);
		} catch (err) {
			const message = err instanceof Error ? err.message : t.joinError;
			alert(message);
		}
	}

	function openCreateDialog() {
		if (!organizationsStore.currentUser) {
			authStore.showAuthDialog = true;
			return;
		}
		showCreateDialog = true;
	}

	let filteredOrgs = $derived(organizationsStore.filteredOrganizations);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Organisations',
					subtitle: 'Découvrez et rejoignez des organisations de la communauté Star Citizen',
					backToHome: "Retour à l'accueil",
					createOrg: 'Créer une Organisation',
					orgsFound: 'organisation(s) trouvée(s)',
					loading: 'Chargement des organisations...',
					noOrgs: 'Aucune organisation trouvée',
					tryDifferent: 'Essayez un autre terme de recherche',
					beFirst: 'Soyez le premier à créer une organisation !',
					joinSuccess: 'Demande d\'adhésion envoyée avec succès !',
					joinError: 'Échec de l\'envoi de la demande d\'adhésion',
					searchToFind: 'Commencez à chercher pour trouver une organisation publique à rejoindre'
				}
			: {
					title: 'Organizations',
					subtitle: 'Discover and join organizations in the Star Citizen community',
					backToHome: 'Back to home',
					createOrg: 'Create Organization',
					orgsFound: 'organization(s) found',
					loading: 'Loading organizations...',
					noOrgs: 'No organizations found',
					tryDifferent: 'Try a different search term',
					beFirst: 'Be the first to create an organization!',
					joinSuccess: 'Join request sent successfully!',
					joinError: 'Failed to send join request',
					searchToFind: 'Start searching to find a public organization to join'
				}
	);
</script>

<svelte:head>
	<title>Star Citizen Organizations - Create, Join & Manage Player Groups</title>
	<meta
		name="description"
		content="Create or join Star Citizen organizations. Manage members, roles, and collaborate with players. Discover public organizations, send join requests, and build your community. Free organization management tools for Star Citizen players."
	/>
	<meta
		name="keywords"
		content="Star Citizen organizations, Star Citizen guilds, create organization Star Citizen, join organization, Star Citizen player groups, Star Citizen community, organization management, Star Citizen clans, player collaboration, organization roles, member management, Star Citizen social, organization inventory, shared resources, Star Citizen teams"
	/>

	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.star-citizen-wikelo-tools.space/organizations" />

	<!-- Hreflang for multilingual support -->
	<link rel="alternate" hreflang="en" href="https://www.star-citizen-wikelo-tools.space/organizations" />
	<link rel="alternate" hreflang="fr" href="https://www.star-citizen-wikelo-tools.space/organizations" />
	<link rel="alternate" hreflang="x-default" href="https://www.star-citizen-wikelo-tools.space/organizations" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/organizations" />
	<meta property="og:title" content="Star Citizen Organizations - Player Groups & Community" />
	<meta
		property="og:description"
		content="Create or join Star Citizen organizations. Manage members, roles, and collaborate with other players. Free organization management tools."
	/>
	<meta
		property="og:image"
		content="https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png"
	/>

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.star-citizen-wikelo-tools.space/organizations" />
	<meta name="twitter:title" content="Star Citizen Organizations" />
	<meta
		name="twitter:description"
		content="Create or join Star Citizen organizations and manage your player community"
	/>
	<meta
		name="twitter:image"
		content="https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png"
	/>

	<!-- Schema.org structured data -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Star Citizen Organizations Manager",
			"url": "https://www.star-citizen-wikelo-tools.space/organizations",
			"description": "Create, join, and manage Star Citizen player organizations. Collaborate with other players, manage members and roles, and share resources.",
			"applicationCategory": "GameApplication",
			"operatingSystem": "Web Browser",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"featureList": [
				"Create custom organizations",
				"Member management with roles (Owner, Admin, Member)",
				"Join request system",
				"Organization inventory tracking",
				"Search and discover public organizations",
				"Multi-language support (English/French)",
				"Real-time synchronization"
			],
			"inLanguage": ["en", "fr"],
			"isAccessibleForFree": true
		})}
	</script>

	<!-- Breadcrumb structured data -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Home",
					"item": "https://www.star-citizen-wikelo-tools.space/"
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "Organizations",
					"item": "https://www.star-citizen-wikelo-tools.space/organizations"
				}
			]
		})}
	</script>
</svelte:head>

<div class="relative min-h-screen pb-20">
	<!-- Space Background -->
	<SpaceBackground />

	<!-- Main Content -->
	<div class="font-rajdhani relative z-10 container mx-auto max-w-7xl px-4 py-8">
		<!-- Top Navigation - Back button + Language + Auth -->
		<div class="mb-4 transition-opacity opacity-100">
			<!-- Top row: Back button + Auth -->
			<div class="flex items-start justify-between mb-3">
				<!-- Back to Home Button -->
				<a
					href="/"
					class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
					title={t.backToHome}
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

				<!-- Auth on desktop, hidden on mobile -->
				<div class="hidden sm:flex items-center gap-3">
					<LanguageToggle />
					<AuthButton variant="compact" />
				</div>
			</div>

			<!-- Second row on mobile: Language + Auth centered -->
			<div class="flex sm:hidden items-center justify-center gap-3">
				<LanguageToggle />
				<AuthButton variant="compact" />
			</div>
		</div>

		<!-- Header -->
		<header
			class="relative mb-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 backdrop-blur-xl"
		>
			<!-- Animated top border -->
			<div
				class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-yellow-400 to-cyan-400"
			></div>

			<div class="p-4 sm:p-8">
				<div class="flex flex-wrap items-center justify-between gap-4 sm:gap-8">
					<!-- Logo Section -->
					<div class="flex items-center gap-3 sm:gap-6">
						<div class="animate-spin-slow text-shadow-gold text-3xl text-yellow-400 sm:text-6xl">
							👥
						</div>

						<div>
							<h1
								class="font-orbitron bg-linear-to-r from-yellow-400 to-cyan-400 bg-clip-text text-xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
							>
								{t.title}
							</h1>
							<p class="mt-1 text-xs font-light tracking-widest text-cyan-400 uppercase sm:text-sm">
								{t.subtitle}
							</p>
						</div>
					</div>

				</div>
			</div>

			<div class="h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent"></div>
		</header>

		<!-- Search and Create Block -->
		<div class="mb-4 rounded-xl border border-white/10 bg-slate-900/85 p-4 backdrop-blur-xl sm:p-6">
			<div class="flex flex-wrap items-center gap-3 sm:gap-6">
				<!-- Search -->
				<div class="relative min-w-[200px] flex-1 sm:min-w-[250px]">
					<OrganizationSearch bind:value={organizationsStore.searchQuery} oninput={handleSearch} />
				</div>

				<!-- Create Button -->
				<button
					onclick={openCreateDialog}
					class="group flex items-center justify-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 sm:px-6 sm:py-3 font-semibold text-yellow-400 transition-all hover:scale-105 hover:border-yellow-500 hover:bg-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/20"
				>
					<svg class="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
					</svg>
					<span class="hidden sm:inline">{t.createOrg}</span>
					<span class="sm:hidden">{wikeloStore.currentLang === 'fr' ? 'Créer' : 'Create'}</span>
				</button>
			</div>

			<!-- Message when user has no organizations and no search -->
			{#if organizationsStore.userOrganizations.length === 0 && !organizationsStore.searchQuery.trim()}
				<div class="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3">
					<p class="text-center text-sm text-cyan-300">
						{t.searchToFind}
					</p>
				</div>
			{/if}
		</div>

		<!-- Organizations Grid -->
		{#if organizationsStore.isLoading}
			<div class="py-20 text-center">
				<div class="inline-flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-slate-900/50 px-8 py-6 backdrop-blur-sm">
					<svg class="h-8 w-8 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span class="font-semibold text-gray-400">{t.loading}</span>
				</div>
			</div>
		{:else if filteredOrgs.length === 0 && hasSearched}
			<div class="py-20 text-center">
				<div class="inline-block rounded-2xl border border-yellow-500/30 bg-slate-900/50 p-12 backdrop-blur-sm">
					<p class="mb-4 text-6xl">👥</p>
					<p class="mb-2 text-xl font-semibold text-gray-300">{t.noOrgs}</p>
					<p class="text-sm text-gray-500">{t.tryDifferent}</p>
				</div>
			</div>
		{:else if filteredOrgs.length > 0}
			<main class="mb-4 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				{#each filteredOrgs as org (org.id)}
					<OrganizationCard
						organization={org}
						showJoinButton={true}
						isPending={pendingRequests.has(org.id)}
						onJoinClick={() => handleJoinClick(org.id)}
						currentUserId={organizationsStore.currentUser?.id}
					/>
				{/each}
			</main>
		{/if}
	</div>

	<!-- SEO-Rich Content Section -->
	<article class="mt-12 rounded-xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
		<h2 class="mb-6 text-2xl font-bold text-white">
			{wikeloStore.currentLang === 'fr'
				? 'Organisations Star Citizen - Guide Complet'
				: 'Star Citizen Organizations - Complete Guide'}
		</h2>
		
		<div class="space-y-4 leading-relaxed text-gray-400">
			{#if wikeloStore.currentLang === 'fr'}
				<p>
					Créez ou rejoignez des <strong class="text-cyan-400">organisations Star Citizen</strong> pour collaborer avec d'autres joueurs. Notre système de gestion d'organisations vous permet de créer des groupes personnalisés, gérer les membres avec différents rôles, et partager les ressources de votre inventaire Wikelo.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Création et Gestion</h3>
				<p>
					Créez votre propre organisation avec un nom personnalisé, une description détaillée et une image représentative. Gérez vos membres avec un système de rôles à trois niveaux : <strong>Propriétaire</strong> (contrôle total), <strong>Admin</strong> (gestion des membres et demandes), et <strong>Membre</strong> (accès standard). Définissez la visibilité de votre organisation (publique ou privée).
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Système de Demandes</h3>
				<p>
					Les joueurs peuvent rechercher et découvrir des organisations publiques, puis envoyer des <strong>demandes d'adhésion</strong>. Les propriétaires et admins peuvent accepter ou refuser ces demandes. Ce système permet de construire une communauté soudée tout en gardant le contrôle sur les nouveaux membres.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Inventaire Partagé</h3>
				<p>
					Visualisez l'<strong>inventaire agrégé</strong> de tous les membres de votre organisation. Consultez la répartition des ingrédients par membre pour coordonner vos efforts de farming et optimiser la progression vers les récompenses Wikelo. Cette fonctionnalité facilite la collaboration et le partage d'informations au sein du groupe.
				</p>
			{:else}
				<p>
					Create or join <strong class="text-cyan-400">Star Citizen organizations</strong> to collaborate with other players. Our organization management system allows you to create custom groups, manage members with different roles, and share your Wikelo inventory resources.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Creation and Management</h3>
				<p>
					Create your own organization with a custom name, detailed description, and representative image. Manage your members with a three-tier role system: <strong>Owner</strong> (full control), <strong>Admin</strong> (member and request management), and <strong>Member</strong> (standard access). Set your organization's visibility (public or private).
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Request System</h3>
				<p>
					Players can search and discover public organizations, then send <strong>join requests</strong>. Owners and admins can accept or reject these requests. This system allows you to build a cohesive community while maintaining control over new members.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Shared Inventory</h3>
				<p>
					View the <strong>aggregated inventory</strong> of all your organization members. Check ingredient breakdown by member to coordinate your farming efforts and optimize progression toward Wikelo rewards. This feature facilitates collaboration and information sharing within the group.
				</p>
			{/if}
		</div>
	</article>
</div>

<!-- Create Organization Dialog -->
<CreateOrganizationDialog
	bind:isOpen={showCreateDialog}
	onClose={() => (showCreateDialog = false)}
/>
