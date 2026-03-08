<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import '$lib/styles/wikelo.css';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import LoginRequiredDialog from '$lib/components/LoginRequiredDialog.svelte';
	import DataSources from '$lib/components/wikelo/DataSources.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { captureEvent } from '$lib/analytics';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let mounted = $state(false);
	let patchNotes = $state<any>(null);
	let showLoginRequiredDialog = $state(Boolean(data.loginRequired));

	// Set default language to English on mount
	onMount(async () => {
		mounted = true;
		showLoginRequiredDialog = $page.url.searchParams.get('loginRequired') === '1';
		// Force English as default on home page
		wikeloStore.currentLang = 'en';
		// Track home page view
		captureEvent('home_page_viewed', {
			timestamp: new Date().toISOString()
		});

		// Load patch notes
		try {
			const response = await fetch('/data/patchnotes.json');
			patchNotes = await response.json();
		} catch (error) {
			console.error('Failed to load patch notes:', error);
		}
	});

	$effect(() => {
		showLoginRequiredDialog =
			Boolean(data.loginRequired) || $page.url.searchParams.get('loginRequired') === '1';
	});

	function closeLoginRequiredDialog() {
		showLoginRequiredDialog = false;
		const url = new URL(window.location.href);
		url.searchParams.delete('loginRequired');
		window.history.replaceState({}, '', url);
	}

	const currentLang = $derived(wikeloStore.currentLang);

	const t = $derived(
		currentLang === 'fr'
			? {
					subtitle: 'Tools for the Garden in the Hallow',
					patchNotes: {
						title: 'Notes de mise à jour',
						version: 'Version'
					},
					wikeloCard: {
						title: 'Wikelo Emporium',
						description:
							'Tracker de récompenses pour le marchand Banu Wikelo. Suivez vos ingrédients et récompenses avec style.',
						features: [
							'Suivi de progression en temps réel',
							'60+ récompenses (vaisseaux, armes, armures)',
							'Interface inspirée Star Citizen/Banu',
							'Sauvegarde automatique locale'
						],
						cta: 'Ouvrir le tracker'
					},
					inventoryCard: {
						title: 'My Inventory',
						description:
							"Gérez votre inventaire d'ingrédients Wikelo. Suivez vos quantités et organisez vos ressources.",
						features: [
							'Gestion des quantités (+/- rapide)',
							'Organisation par catégories',
							'Recherche et filtres avancés',
							'Export/Import de données'
						],
						cta: "Gérer l'inventaire"
					},
					armourViewerCard: {
						title: "Aperçu d'Armure",
						description:
							"Prévisualisez les emplacements d'armure Star Citizen sur un mannequin 3D et consultez les données des objets importés depuis les fichiers du jeu.",
						features: [
							"Onglets d'emplacements interactifs (tête, torse, bras, jambes)",
							'Panneau latéral avec métadonnées et statistiques',
							"Pipeline d'upload admin pour les exports de fichiers du jeu",
							"Catalogue d'armures alimenté par la base de données"
						],
						cta: "Ouvrir l'aperçu"
					},

					comingSoon: {
						title: 'Bientôt disponible',
						description: "D'autres outils communautaires arrivent prochainement..."
					},
					footer: {
						madeWith: 'Fait avec 💙 pour la communauté Star Citizen',
						disclaimer:
							'Non affilié à Cloud Imperium Games. Star Citizen® est une marque déposée de Cloud Imperium Rights LLC.',
						rsiWebsite: 'Site RSI',
						wiki: 'Wiki Officiel'
					}
				}
			: {
					subtitle: 'Tools for the Garden in the Hallow',
					patchNotes: {
						title: 'Patch Notes',
						version: 'Version'
					},
					wikeloCard: {
						title: 'Wikelo Emporium',
						description:
							'Rewards tracker for the Banu merchant Wikelo. Track your ingredients and rewards with style.',
						features: [
							'Real-time progression tracking',
							'60+ rewards (ships, weapons, armor)',
							'Star Citizen/Banu inspired interface',
							'Automatic local save'
						],
						cta: 'Open tracker'
					},
					inventoryCard: {
						title: 'My Inventory',
						description:
							'Manage your Wikelo ingredients inventory. Track your quantities and organize your resources.',
						features: [
							'Quick quantity management (+/-)',
							'Organization by categories',
							'Search and advanced filters',
							'Data Export/Import'
						],
						cta: 'Manage inventory'
					},
					armourViewerCard: {
						title: 'Armor Preview',
						description:
							'Preview Star Citizen armour slots on a 3D mannequin and inspect item data sourced from uploaded game files.',
						features: [
							'Interactive slot tabs (head, torso, arms, legs)',
							'Side panel with item metadata and stats',
							'Admin upload pipeline for game-file exports',
							'Database-backed armour catalogue'
						],
						cta: 'Open viewer'
					},

					comingSoon: {
						title: 'Coming Soon',
						description: 'More community tools are coming soon...'
					},
					footer: {
						madeWith: 'Made with 💙 for the Star Citizen community',
						disclaimer:
							'Not affiliated with Cloud Imperium Games. Star Citizen® is a registered trademark of Cloud Imperium Rights LLC.',
						rsiWebsite: 'RSI Website',
						wiki: 'Official Wiki'
					}
				}
	);
</script>

<svelte:head>
	<title>Avalon Tools - Star Citizen Tracker & Database</title>
	<meta
		name="description"
		content="Free Wikelo Emporium tracker for Star Citizen. Track 60+ rewards, manage ingredients, and organize your inventory. Updated for 4.5"
	/>
	<meta
		name="keywords"
		content="Star Citizen Avalon Tools, Wikelo Emporium tracker, Star Citizen rewards, Star Citizen database, Star Citizen inventory manager, Banu merchant Wikelo, Star Citizen armor tracker, Star Citizen weapons database, Star Citizen crafting guide, Xanthule Ascension Suit, Novikov Armor, Geist Snow Camo, DCP Armor, Valakkar Fang, MG Scrip, Wikelo Favor, Star Citizen ingredients, Star Citizen missions tracker, free Star Citizen Avalon Tools"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/" />
	<meta
		property="og:title"
		content="Star Citizen Avalon Tools - Wikelo Emporium Tracker & Database"
	/>
	<meta
		property="og:description"
		content="Free community tools for Star Citizen: Complete Wikelo Emporium rewards tracker, ingredient database, and inventory manager. Track all armor sets, weapons, ships, and crafting materials."
	/>
	<meta
		property="og:image"
		content="https://www.star-citizen-wikelo-tools.space/images/wikelo/wikelo_favor.webp"
	/>

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.star-citizen-wikelo-tools.space/" />
	<meta name="twitter:title" content="Star Citizen Avalon Tools - Wikelo Emporium Tracker" />
	<meta
		name="twitter:description"
		content="Free Star Citizen community tools: Wikelo rewards tracker, inventory manager, and complete database"
	/>
	<meta
		name="twitter:image"
		content="https://www.star-citizen-wikelo-tools.space/images/wikelo/wikelo_favor.webp"
	/>

	<!-- Schema.org structured data -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "Star Citizen Avalon Tools",
			"url": "https://www.star-citizen-wikelo-tools.space",
			"description": "Free community tools for Star Citizen players: Wikelo Emporium rewards tracker, ingredient database, and inventory manager",
			"applicationCategory": "GameApplication",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"potentialAction": {
				"@type": "SearchAction",
				"target": "https://www.star-citizen-wikelo-tools.space/wikelo?q={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		})}
	</script>
</svelte:head>

<LoginRequiredDialog show={showLoginRequiredDialog} onClose={closeLoginRequiredDialog} />

<div class="relative min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
	<!-- Space Background -->
	<div class="space-background">
		<div class="stars"></div>
		<div class="stars-layer-2"></div>
		<div class="nebula"></div>
	</div>

	<!-- Header -->
	<header
		class="relative z-10 overflow-hidden border-b border-white/10 bg-slate-900/85 backdrop-blur-xl"
	>
		<!-- Animated top border -->
		<div
			class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-yellow-400 to-cyan-400"
		></div>

		<!-- Language Toggle & Auth - Top Right on Desktop, Hidden on Mobile -->
		<div class="absolute top-4 right-4 z-20 hidden items-center gap-3 sm:flex">
			<LanguageToggle />
			<AuthButton variant="home" />
		</div>

		<div class="container mx-auto px-4 py-6 sm:py-12">
			<div class="mb-4 flex items-center justify-center gap-3 sm:gap-6">
				<div class="text-center">
					<h1
						class="font-orbitron mb-2 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-2xl font-black tracking-wider text-transparent uppercase sm:text-5xl"
					>
						Avalon Tools
					</h1>
					<p
						class="font-rajdhani mb-3 text-xs font-light tracking-widest text-cyan-400 uppercase sm:mb-0 sm:text-sm"
					>
						{t.subtitle}
					</p>

					<!-- Language Toggle & Auth - Below Title on Mobile Only -->
					<div class="mt-3 flex flex-col items-center gap-3 sm:hidden">
						<LanguageToggle />
						<AuthButton variant="home" />
					</div>
				</div>

				<!-- Animated Icon - Hidden on mobile -->
				<div class="animate-spin-slow text-shadow-gold hidden text-7xl text-yellow-400 sm:block">
					◈
				</div>
			</div>
		</div>

		<div class="h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent"></div>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-12">
		<div class="3xl:grid-cols-3 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Wikelo Tracker Card -->
			<a
				href="/wikelo"
				onclick={() => {
					captureEvent('navigation_clicked', {
						from: 'home',
						to: 'wikelo',
						timestamp: new Date().toISOString()
					});
				}}
				class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/20"
			>
				<!-- Animated border on hover -->
				<div
					class="absolute inset-0 bg-linear-to-r from-cyan-400 via-purple-500 to-yellow-400 opacity-0 blur-xl transition-opacity group-hover:opacity-20"
				></div>

				<div class="relative">
					<!-- Icon -->
					<div class="mb-6 text-6xl text-yellow-400">
						<span
							class="text-shadow-gold inline-block transition-transform group-hover:scale-110 group-hover:rotate-180"
						>
							◈
						</span>
					</div>

					<!-- Title -->
					<h2 class="font-orbitron mb-3 text-2xl font-bold text-yellow-400">
						{t.wikeloCard.title}
					</h2>

					<!-- Description -->
					<p class="mb-4 text-gray-400">
						{t.wikeloCard.description}
					</p>

					<!-- Features -->
					<ul class="space-y-2 text-sm text-gray-500">
						{#each t.wikeloCard.features as feature}
							<li class="flex items-center gap-2">
								<span class="text-green-400">✓</span>
								{feature}
							</li>
						{/each}
					</ul>

					<!-- CTA -->
					<div class="mt-6 flex items-center gap-2 font-semibold text-cyan-400">
						<span>{t.wikeloCard.cta}</span>
						<span class="transition-transform group-hover:translate-x-2">→</span>
					</div>
				</div>
			</a>

			<!-- Wikelo Inventory Card -->
			<a
				href="/inventory"
				onclick={() => {
					captureEvent('navigation_clicked', {
						from: 'home',
						to: 'inventory',
						timestamp: new Date().toISOString()
					});
				}}
				class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-400/20"
			>
				<!-- Animated border on hover -->
				<div
					class="absolute inset-0 bg-linear-to-r from-purple-400 via-pink-500 to-cyan-400 opacity-0 blur-xl transition-opacity group-hover:opacity-20"
				></div>

				<div class="relative">
					<!-- Icon -->
					<div class="mb-6 text-6xl">
						<span class="inline-block transition-transform group-hover:scale-110"> 📦 </span>
					</div>

					<!-- Title -->
					<h2 class="mb-3 text-2xl font-bold text-purple-400">
						{t.inventoryCard.title}
					</h2>

					<!-- Description -->
					<p class="mb-4 text-gray-400">
						{t.inventoryCard.description}
					</p>

					<!-- Features -->
					<ul class="space-y-2 text-sm text-gray-500">
						{#each t.inventoryCard.features as feature}
							<li class="flex items-center gap-2">
								<span class="text-green-400">✓</span>
								{feature}
							</li>
						{/each}
					</ul>

					<!-- CTA -->
					<div class="mt-6 flex items-center gap-2 font-semibold text-purple-400">
						<span>{t.inventoryCard.cta}</span>
						<span class="transition-transform group-hover:translate-x-2">→</span>
					</div>
				</div>
			</a>

			<!-- Armour Viewer Card -->
			<a
				href="/armor"
				onclick={() => {
					captureEvent('navigation_clicked', {
						from: 'home',
						to: 'armor_preview',
						timestamp: new Date().toISOString()
					});
				}}
				class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-400/20"
			>
				<div
					class="absolute inset-0 bg-linear-to-r from-emerald-400 via-cyan-500 to-teal-400 opacity-0 blur-xl transition-opacity group-hover:opacity-20"
				></div>

				<div class="relative">
					<div class="mb-6 text-6xl">
						<span
							class="inline-block transition-transform group-hover:scale-110 group-hover:-rotate-6"
						>
							🛡️
						</span>
					</div>

					<h2 class="mb-3 text-2xl font-bold text-emerald-400">
						{t.armourViewerCard.title}
					</h2>

					<p class="mb-4 text-gray-400">
						{t.armourViewerCard.description}
					</p>

					<ul class="space-y-2 text-sm text-gray-500">
						{#each t.armourViewerCard.features as feature}
							<li class="flex items-center gap-2">
								<span class="text-green-400">✓</span>
								{feature}
							</li>
						{/each}
					</ul>

					<div class="mt-6 flex items-center gap-2 font-semibold text-emerald-400">
						<span>{t.armourViewerCard.cta}</span>
						<span class="transition-transform group-hover:translate-x-2">→</span>
					</div>
				</div>
			</a>
		</div>

		<!-- Patch Notes Section -->
		{#if patchNotes && patchNotes.patchNotes && patchNotes.patchNotes.length > 0}
			<div
				class="mt-8 overflow-hidden rounded-xl border border-cyan-400/30 bg-slate-900/80 backdrop-blur-xl"
			>
				<!-- Header with animated border -->
				<div class="relative border-b border-cyan-400/30 bg-slate-800/50 px-6 py-4">
					<div
						class="absolute top-0 right-0 left-0 h-0.5 animate-pulse bg-linear-to-r from-transparent via-cyan-400 to-transparent"
					></div>
					<div class="flex items-center gap-3">
						<span class="text-2xl">📋</span>
						<h2 class="font-orbitron text-xl font-bold tracking-wider text-cyan-400 uppercase">
							{t.patchNotes.title}
						</h2>
					</div>
				</div>

				<!-- All patch notes with scroll -->
				<div class="custom-scrollbar max-h-[300px] space-y-6 overflow-y-auto p-6">
					{#each patchNotes.patchNotes as patch, index}
						<div class:border-t={index > 0} class:pt-6={index > 0} class="border-cyan-400/20">
							<div class="mb-4 flex items-center gap-3">
								<span
									class="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-1 text-sm font-semibold text-cyan-400"
								>
									{t.patchNotes.version}
									{patch.version}
								</span>
								<span class="text-sm text-gray-500">
									{new Date(patch.date).toLocaleDateString(
										currentLang === 'fr' ? 'fr-FR' : 'en-GB',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}
									)}
								</span>
							</div>

							<ul class="space-y-2">
								{#each patch.changes[currentLang] as change}
									{@const isImportant = change.includes('----')}
									{#if isImportant}
										<!-- Important title with special styling -->
										<li class="mt-4 mb-4 flex items-start gap-3">
											<div class="flex w-full flex-col gap-2">
												<div class="flex items-center gap-2">
													<span
														class="rounded-full border border-yellow-500/50 bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-yellow-400 uppercase"
														>Important</span
													>
													<div
														class="h-px flex-1 bg-linear-to-r from-yellow-400/50 to-transparent"
													></div>
												</div>
												<h3 class="font-orbitron text-lg font-bold tracking-wide text-yellow-400">
													{change.replace(/----/g, '').trim()}
												</h3>
											</div>
										</li>
									{:else}
										<!-- Regular change item -->
										<li class="flex items-start gap-3 text-gray-300">
											<span class="mt-1 text-green-400">✓</span>
											<span>{change}</span>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer
		class="container mx-auto mt-20 rounded-xl border border-white/10 bg-slate-900/85 p-8 backdrop-blur-xl"
	>
		<div class="mb-6 text-center">
			<p class="mb-2 text-gray-400">
				{t.footer.madeWith}
			</p>
			<p class="text-sm text-gray-500 italic">
				{t.footer.disclaimer}
			</p>
		</div>

		<!-- Links Section -->
		<div class="mb-8 flex items-center justify-center gap-6">
			<a
				href="https://robertsspaceindustries.com"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{t.footer.rsiWebsite}
			</a>
			<a
				href="https://starcitizen.tools"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{t.footer.wiki}
			</a>
		</div>

		<!-- Data Sources Section -->
		<DataSources />
	</footer>
</div>
