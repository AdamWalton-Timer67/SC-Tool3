<script lang="ts">
	import { onMount } from 'svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import RewardCard from '$lib/components/wikelo/RewardCard.svelte';
	import IntroMission from '$lib/components/wikelo/IntroMission.svelte';
	import ContactInfo from '$lib/components/wikelo/ContactInfo.svelte';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import IngredientDialog from '$lib/components/wikelo/IngredientDialog.svelte';
	import ShipLoadoutDialog from '$lib/components/wikelo/ShipLoadoutDialog.svelte';
	import UncheckConfirmDialog from '$lib/components/wikelo/UncheckConfirmDialog.svelte';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import AuthDialog from '$lib/components/AuthDialog.svelte';
	import DataSources from '$lib/components/wikelo/DataSources.svelte';
	import LoginRequiredDialog from '$lib/components/LoginRequiredDialog.svelte';
	import { captureEvent } from '$lib/analytics';

	const stats = $derived(wikeloStore.stats);
	const filteredRewards = $derived(wikeloStore.filteredRewards);
	const t = $derived(wikeloStore.t);

	let showLoginDialog = $state(false);

	onMount(async () => {
		// Force English as default on wikelo page
		wikeloStore.currentLang = 'en';

		// Check if we're coming from admin (localStorage flag)
		const shouldReload = localStorage.getItem('wikelo_reload_needed');
		if (shouldReload === 'true') {
			console.log('🔄 Reloading data after admin changes...');
			localStorage.removeItem('wikelo_reload_needed');
			await wikeloStore.reloadData();
		} else {
			// Data is already loaded by the store constructor, just ensure it's complete
			if (!wikeloStore.dataLoaded) {
				await wikeloStore.loadData();
			}
		}

		// Track page view
		captureEvent('wikelo_page_viewed', {
			timestamp: new Date().toISOString()
		});
	});
</script>

<svelte:head>
	<title>Wikelo Emporium Tracker - Star Citizen Rewards Database</title>
	<meta
		name="description"
		content="Track 60+ Wikelo rewards: Xanthule Suit, Novikov Armor, ships & ingredients. Free tracker updated for SC 4.5. Real-time progress sync."
	/>
	<meta
		name="keywords"
		content="star citizen wikelo, wikelo emporium, star citizen wikelo tracker, star citizen wikelo rewards, wikelo star citizen, banu wikelo, star citizen wikelo emporium, wikelo armor, wikelo weapons, star citizen wikelo database, xanthule ascension suit, novikov armor, geist snow camo, dcp armor, valakkar fang, valakkar pearl, mg scrip, council scrip, wikelo favor, tevarin war service marker, asd secure drive, star citizen crafting, wikelo ingredients, star citizen wikelo guide, wikelo missions, star citizen banu merchant, wikelo dasi, wikelo kinga, wikelo selo"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/wikelo" />
	<meta
		property="og:title"
		content="⭐ Star Citizen Wikelo Emporium Tracker - Complete FREE Database"
	/>
	<meta
		property="og:description"
		content="Track ALL Star Citizen Wikelo rewards! Exclusive armor, weapons, ships & ingredients. Updated for 4.0 | 100% Free | Multi-language (EN/FR)"
	/>
	<meta
		property="og:image"
		content="https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png"
	/>
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:image:alt" content="Star Citizen Wikelo Emporium Logo" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.star-citizen-wikelo-tools.space/wikelo" />
	<meta name="twitter:title" content="⭐ Star Citizen Wikelo Tracker - Complete FREE Database" />
	<meta
		name="twitter:description"
		content="Track ALL Star Citizen Wikelo rewards! Updated for 4.0 | 100% Free | Multi-language support"
	/>
	<meta
		name="twitter:image"
		content="https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png"
	/>
	<meta name="twitter:image:alt" content="Star Citizen Wikelo Emporium Logo" />

	<!-- Schema.org structured data -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Star Citizen Wikelo Emporium Tracker",
			"alternateName": ["Wikelo Emporium", "Star Citizen Wikelo Tracker", "Wikelo Tracker"],
			"applicationCategory": "GameApplication",
			"description": "The most comprehensive Star Citizen Wikelo Emporium rewards tracker. Track all exclusive armor sets, weapons, ships, vehicles, and crafting ingredients from the Banu merchant Wikelo.",
			"url": "https://www.star-citizen-wikelo-tools.space/wikelo",
			"operatingSystem": "Web Browser",
			"browserRequirements": "Requires JavaScript",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock"
			},
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": "5",
				"bestRating": "5",
				"worstRating": "1",
				"ratingCount": "100"
			},
			"featureList": [
				"Track all Star Citizen Wikelo Emporium rewards",
				"Complete armor sets database (Xanthule, Novikov, Geist, DCP, Ana, Bokto, Corbel, Palatino)",
				"Weapons catalog with all variants",
				"Ships and vehicles tracker",
				"Crafting ingredients guide (Valakkar Fangs, Pearls, Minerals)",
				"Mission requirements checker",
				"Inventory management system",
				"Multi-language support (English/French)",
				"Real-time progression tracking",
				"Filter by rarity (Common, Uncommon, Rare, Epic, Legendary)",
				"Grid and list view modes",
				"Updated for Star Citizen 4.5"
			],
			"keywords": "star citizen wikelo, wikelo emporium, star citizen wikelo tracker, banu merchant, wikelo rewards, star citizen database",
			"inLanguage": ["en", "fr"],
			"isAccessibleForFree": true,
			"author": {
				"@type": "Organization",
				"name": "Wikelo Emporium Tracker Team"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Wikelo Emporium Tracker",
				"logo": {
					"@type": "ImageObject",
					"url": "https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png",
					"width": 512,
					"height": 512
				}
			},
			"datePublished": "2024-01-01",
			"dateModified": new Date().toISOString().split('T')[0]
		})}
	</script>

	<!-- FAQ Schema for better search visibility -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "What is Star Citizen Wikelo Emporium?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Wikelo Emporium is a Banu merchant in Star Citizen who offers exclusive rewards including legendary armor sets (Xanthule Ascension Suit, Novikov Armor, Geist Snow Camo), weapons, ships, and vehicles in exchange for rare materials and currencies like Valakkar Fangs, MG Scrip, and Wikelo Favor."
					}
				},
				{
					"@type": "Question",
					"name": "How do I track my Star Citizen Wikelo rewards?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Use this free online tracker to monitor all Wikelo Emporium rewards. Check off items you've obtained, track required ingredients (Valakkar Fangs, Pearls, minerals), and see your progression percentage. Available in English and French with real-time sync."
					}
				},
				{
					"@type": "Question",
					"name": "Where are Wikelo Emporium locations in Star Citizen?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Wikelo Emporium has three locations in Star Citizen: Dasi on Hurston, Kinga on microTech, and Selo on Yela. Each location offers the same rewards catalog."
					}
				},
				{
					"@type": "Question",
					"name": "What are the best Wikelo rewards in Star Citizen?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Top Wikelo rewards include: Xanthule Ascension Suit (legendary Xi'an armor), Novikov Ascension Exploration Suit (legendary armor), Geist Snow Camo Armor (epic stealth set), DCP Armor variants (epic camo sets), Bokto Glowing Armor (epic bioluminescent), and exclusive ships like the A2 Hercules and F8C Lightning Stealth."
					}
				}
			]
		})}
	</script>

	<!-- BreadcrumbList Schema -->
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
					"item": "https://www.star-citizen-wikelo-tools.space"
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "Star Citizen Wikelo Tracker",
					"item": "https://www.star-citizen-wikelo-tools.space/wikelo"
				},
				{
					"@type": "ListItem",
					"position": 3,
					"name": "Star Citizen Wikelo my inventory",
					"item": "https://www.star-citizen-wikelo-tools.space/inventory"
				},
				{
					"@type": "ListItem",
					"position": 4,
					"name": "Star Citizen Wikelo locations",
					"item": "https://www.star-citizen-wikelo-tools.space/locations"
				},
				{
					"@type": "ListItem",
					"position": 5,
					"name": "Star Citizen Wikelo organizations",
					"item": "https://www.star-citizen-wikelo-tools.space/organizations"
				}
			]
		})}
	</script>

	<!-- ItemList Schema - Top Rewards -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "ItemList",
			"name": "Top Star Citizen Wikelo Emporium Rewards",
			"description": "Most popular rewards from the Banu merchant Wikelo",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"item": {
						"@type": "Product",
						"name": "Wikelo Favor",
						"description": "Top ingredient needed for Wikelo rewards",
						"category": "Armor",
						"image": "https://www.star-citizen-wikelo-tools.space/images/wikelo/wikelo_favor.png"
					}
				},
				{
					"@type": "ListItem",
					"position": 2,
					"item": {
						"@type": "Product",
						"name": "Novikov Ascension Exploration Suit",
						"description": "Legendary exploration armor from Wikelo Emporium",
						"category": "Armor"
					}
				},
				{
					"@type": "ListItem",
					"position": 3,
					"item": {
						"@type": "Product",
						"name": "Geist Snow Camo Armor",
						"description": "Epic stealth armor set from Wikelo Emporium",
						"category": "Armor"
					}
				},
				{
					"@type": "ListItem",
					"position": 4,
					"item": {
						"@type": "Product",
						"name": "A2 Hercules Starlifter",
						"description": "Heavy cargo and gunship from Wikelo Emporium",
						"category": "Ship"
					}
				},
				{
					"@type": "ListItem",
					"position": 5,
					"item": {
						"@type": "Product",
						"name": "F8C Lightning Stealth",
						"description": "Elite stealth fighter from Wikelo Emporium",
						"category": "Ship"
					}
				}
			]
		})}
	</script>
</svelte:head>

<SpaceBackground />

<div class="font-rajdhani relative z-10 container mx-auto max-w-7xl px-4 py-8">
	<!-- Top Navigation - Back button + Language + Auth -->
	<div
		class="mb-4 {wikeloStore.selectedIngredient ||
		wikeloStore.selectedShip
			? 'pointer-events-none opacity-0'
			: 'opacity-100'} transition-opacity"
	>
		<!-- Top row: Back button + Auth -->
		<div class="flex items-start justify-between mb-3">
			<!-- Back to Home Button -->
			<a
				href="/"
				class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
				title={wikeloStore.currentLang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
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
						◈
					</div>

					<div>
						<h1
							class="font-orbitron bg-linear-to-r from-yellow-400 to-cyan-400 bg-clip-text text-xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
						>
							Wikelo Emporium
						</h1>
						<p class="mt-1 text-xs font-light tracking-widest text-cyan-400 uppercase sm:text-sm">
							{t.subtitle}
						</p>
					</div>
				</div>

				<!-- Stats Panel -->
				<div class="flex w-full flex-wrap justify-center gap-2 sm:w-auto sm:gap-6">
					<div
						class="flex min-w-[80px] flex-col items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:min-w-[120px] sm:px-6 sm:py-4"
					>
						<span class="mb-1 text-[10px] tracking-wider text-gray-400 uppercase sm:text-xs"
							>{t.totalRewards}</span
						>
						<span class="font-orbitron text-shadow-glow text-xl font-bold text-cyan-400 sm:text-3xl"
							>{stats.totalRewards}</span
						>
					</div>

					<div
						class="flex min-w-[80px] flex-col items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:min-w-[120px] sm:px-6 sm:py-4"
					>
						<span class="mb-1 text-[10px] tracking-wider text-gray-400 uppercase sm:text-xs"
							>{t.completed}</span
						>
						<span
							class="font-orbitron text-shadow-glow text-xl font-bold text-green-400 sm:text-3xl"
							>{stats.completedRewards}</span
						>
					</div>

					<div
						class="flex min-w-[80px] flex-col items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:min-w-[120px] sm:px-6 sm:py-4"
					>
						<span class="mb-1 text-[10px] tracking-wider text-gray-400 uppercase sm:text-xs"
							>{t.progression}</span
						>
						<span
							class="font-orbitron text-shadow-glow text-xl font-bold text-yellow-400 sm:text-3xl"
							>{stats.progressPercent}%</span
						>
					</div>
				</div>
			</div>
		</div>

		<div class="h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent"></div>
	</header>

	<!-- Version Info Alert -->
	<div class="mb-4 rounded-xl border border-yellow-400/30 bg-yellow-900/20 p-4 backdrop-blur-xl sm:p-6">
		<div class="flex items-start gap-3">
			<span class="text-2xl">ℹ️</span>
			<div class="flex-1">
				<h3 class="font-orbitron mb-2 text-lg font-bold text-yellow-400">
					{wikeloStore.currentLang === 'fr' ? 'Version 4.4 - Mise à jour 4.5 à venir' : 'Version 4.4 - Update 4.5 Coming'}
				</h3>
				<p class="text-sm text-gray-300 leading-relaxed">
					{#if wikeloStore.currentLang === 'fr'}
						Les éléments affichés ci-dessous représentent les récompenses disponibles dans la version <strong>4.4</strong> de Star Citizen. 
						Veuillez noter que <strong>la plupart des récompenses changeront avec l'arrivée de la version 4.5</strong> et qu'une nouvelle réputation fera son apparition.
					{:else}
						The items displayed below represent the rewards available in Star Citizen version <strong>4.4</strong>. 
						Please note that <strong>most rewards will change with the arrival of version 4.5</strong> and a new reputation will be introduced.
					{/if}
				</p>
			</div>
		</div>
	</div>

	<!-- Intro Mission Alert -->
	<IntroMission />

	<!-- Filter Bar -->
	<div class="mb-4 rounded-xl border border-white/10 bg-slate-900/85 p-4 backdrop-blur-xl sm:p-6">
		<!-- Première ligne : Search + Rarity Filters -->
		<div class="flex flex-wrap items-center gap-3 sm:gap-6 mb-3">
			<!-- Search -->
			<div class="relative min-w-[200px] flex-1 sm:min-w-[250px]">
				<input
					type="text"
					bind:value={wikeloStore.searchQuery}
					oninput={() => {
						captureEvent('wikelo_search_used', {
							query: wikeloStore.searchQuery,
							timestamp: new Date().toISOString()
						});
					}}
					placeholder={t.searchPlaceholder}
					class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 pl-12 text-sm text-white placeholder-gray-400 transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none sm:text-base"
				/>
				<span class="absolute top-1/2 left-4 -translate-y-1/2 text-xl">🔍</span>
			</div>

			<!-- Rarity Filters - Hidden on mobile -->
			<div class="hidden flex-wrap gap-2 sm:flex">
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'all';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'all' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'all'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.allRarities}
				</button>
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'legendary';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'legendary' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'legendary'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.legendary}
				</button>
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'epic';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'epic' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'epic'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.epic}
				</button>
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'rare';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'rare' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'rare'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.rare}
				</button>
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'uncommon';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'uncommon' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'uncommon'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.uncommon}
				</button>
				<button
					onclick={() => {
						wikeloStore.currentRarity = 'common';
						captureEvent('wikelo_rarity_filter_changed', { rarity: 'common' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{wikeloStore.currentRarity === 'common'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.common}
				</button>
			</div>
		</div>

		<!-- Deuxième ligne : View Toggle + Favorites + Compact Mode -->
		<div class="flex flex-wrap items-center gap-3 sm:gap-4">
			<!-- View Toggle - Hidden on mobile -->
			<div class="hidden gap-2 sm:flex">
				<button
					onclick={() => {
						wikeloStore.viewMode = 'grid';
						captureEvent('wikelo_view_mode_changed', { viewMode: 'grid' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-1.5 font-semibold transition-all
						{wikeloStore.viewMode === 'grid'
						? 'border-yellow-400 bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}"
				>
					<span class="text-lg">⊞</span>
					{t.gridView}
				</button>

				<button
					onclick={() => {
						wikeloStore.viewMode = 'list';
						captureEvent('wikelo_view_mode_changed', { viewMode: 'list' });
					}}
					class="cursor-pointer rounded-lg border px-4 py-1.5 font-semibold transition-all
						{wikeloStore.viewMode === 'list'
						? 'border-yellow-400 bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}"
				>
					<span class="text-lg">☰</span>
					{t.listView}
				</button>
			</div>

			<!-- Favorites Filter - Visible on all screens -->
			<button
				onclick={() => {
					wikeloStore.favoritesOnly = !wikeloStore.favoritesOnly;
					captureEvent('wikelo_favorites_filter_toggled', { enabled: wikeloStore.favoritesOnly });
				}}
				class="cursor-pointer flex items-center gap-2 rounded-lg border transition-all hover:scale-105 px-3 py-2 sm:px-4
					{wikeloStore.favoritesOnly
					? 'border-pink-500 bg-pink-500/20 text-pink-400 shadow-lg shadow-pink-500/20'
					: 'border-white/10 bg-white/5 text-gray-400 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300'}"
				title={t.favoritesOnly}
			>
				<span class={wikeloStore.favoritesOnly ? 'animate-pulse' : ''}>❤️</span>
				<span class="font-bold text-xs sm:text-sm">{t.favoritesOnly}</span>
			</button>

			<!-- Compact Mode Toggle - Visible on all screens -->
			<button
				onclick={() => {
					wikeloStore.toggleCompactView();
					captureEvent('wikelo_compact_mode_toggled', { enabled: wikeloStore.isCompactView });
				}}
				class="cursor-pointer flex items-center gap-2 rounded-lg border px-3 py-1.5 sm:px-4 font-semibold transition-all
					{wikeloStore.isCompactView
					? 'border-indigo-400 bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/20'
					: 'border-white/10 bg-white/5 text-gray-400 hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-indigo-300'}"
				title={t.compactView}
			>
				<span class="text-lg">↕</span>
				<span class="text-xs font-bold uppercase tracking-wider sm:text-sm xl:inline">{t.compactView}</span>
			</button>
		</div>
	</div>

	<!-- Categories Navigation -->
	<nav class="mb-4 flex flex-wrap gap-2 sm:gap-3">
		<button
			onclick={() => {
				wikeloStore.currentCategory = 'all';
				captureEvent('wikelo_category_filter_changed', { category: 'all' });
			}}
			class="flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all sm:gap-2 sm:px-6 sm:py-3 sm:text-sm {wikeloStore.currentCategory ===
			'all'
				? 'border-transparent bg-linear-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10 sm:hover:-translate-y-1'}"
		>
			<span class="text-sm sm:text-base">⭐</span>
			<span>{t.allCategories}</span>
		</button>

		{#each wikeloStore.rewards as category}
			<button
				onclick={() => {
					wikeloStore.currentCategory = category.id;
					captureEvent('wikelo_category_filter_changed', { category: category.id });
				}}
				class="flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all sm:gap-2 sm:px-6 sm:py-3 sm:text-sm {wikeloStore.currentCategory ===
				category.id
					? 'border-transparent bg-linear-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/50'
					: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10 sm:hover:-translate-y-1'}"
			>
				<span class="text-sm sm:text-base">{category.icon}</span>
				<span>{wikeloStore.getText(category.name)}</span>
			</button>
		{/each}
	</nav>

	<!-- Loading State -->
	{#if wikeloStore.isLoading}
		<div class="py-20 text-center">
			<div
				class="inline-block h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"
			></div>
			<p class="mt-4 text-gray-400">{t.loading}</p>
		</div>
	{:else if wikeloStore.error}
		<div class="py-20 text-center text-red-400">
			<p class="mb-2 text-xl font-bold">{t.loadingError}</p>
			<p>{wikeloStore.error}</p>
		</div>
	{:else}
		<!-- Rewards Grid -->
		<main
			class="rewards-grid mb-4 grid gap-6
			{wikeloStore.viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}"
		>
			{#each filteredRewards as reward, index (reward.id)}
				<RewardCard {reward} priority={index} onLoginRequired={() => (showLoginDialog = true)} />
			{:else}
				<p class="col-span-full text-center text-gray-400 py-20">
					{t.noResults}
				</p>
			{/each}
		</main>
	{/if}

	<!-- Contact Info - Hidden while loading -->
	{#if !wikeloStore.isLoading}
		<ContactInfo />
	{/if}

	<!-- Footer -->
	<footer
		class="footer mt-12 rounded-xl border border-white/10 bg-slate-900/85 p-8 backdrop-blur-xl"
	>
		<div class="mb-6 text-center">
			<p class="mb-2 text-gray-400">{t.footerVersion}</p>
			<p class="text-sm text-gray-500 italic">
				{t.footerDisclaimer}
			</p>
		</div>

		<!-- Links Section -->
		<div class="mb-8 flex items-center justify-center gap-6">
			<a
				href="https://robertsspaceindustries.com"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{t.rsiWebsite}
			</a>
			<a
				href="https://starcitizen.tools/Wikelo"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{t.officialWiki}
			</a>
		</div>

		<!-- Data Sources Section -->
		<DataSources />
	</footer>

	<!-- Dialogs -->
	<IngredientDialog />
	<ShipLoadoutDialog />
	<UncheckConfirmDialog />
	<AuthDialog />
	<LoginRequiredDialog bind:show={showLoginDialog} onClose={() => (showLoginDialog = false)} />

	<!-- SEO-Rich Content Section (hidden, bottom of page for SEO) -->
	<article
		class="mt-8 rounded-xl border border-white/10 bg-slate-900/50 p-6 opacity-70 backdrop-blur-xl"
	>
		<section>
			<h2 class="font-orbitron mb-4 text-xl font-bold text-cyan-400">
				Complete Star Citizen Wikelo Emporium Database
			</h2>
			<div class="space-y-2 text-sm leading-relaxed text-gray-300">
				<p>
					Welcome to the most comprehensive <strong>Wikelo Emporium rewards tracker</strong> for
					<strong>Star Citizen</strong>. Track all exclusive armor sets, weapons, ships, vehicles,
					and crafting ingredients from the Banu merchant Wikelo. Our database includes legendary
					items like the <strong>Xanthule Ascension Suit</strong>,
					<strong>Novikov Ascension Exploration Suit</strong>,
					<strong>Geist Snow Camo Armor</strong>, and more.
				</p>
				<p>
					Find detailed mission requirements for every reward, including rare materials such as <strong
						>Valakkar Fangs</strong
					>
					(Juvenile, Adult, Apex), <strong>Valakkar Pearls Grade AAA</strong>,
					<strong>Tevarin War Service Markers</strong>, <strong>ASD Secure Drives</strong>, and
					currencies like <strong>MG Scrip</strong>, <strong>Council Scrip</strong>, and
					<strong>Wikelo Favor</strong>.
				</p>
				<p>
					Our tracker features <strong>epic armor sets</strong> including
					<strong>Ana Armor Endro Set</strong>, <strong>Bokto Glowing Armor</strong> with
					bioluminescent properties, <strong>DCP Armor</strong> variants (Jungle Camo, Hunter Camo,
					Cobalt Camo), <strong>Corbel Crush Set</strong>, and <strong>Palatino Mark I</strong>. All
					items include ingredient lists, crafting requirements, and locations for mining materials
					like <strong>Carinite</strong>, <strong>Jaclium</strong>, <strong>Saldynium</strong>, and
					<strong>Quantanium</strong>.
				</p>
				<p class="text-xs text-gray-500 italic">
					Track your progression across all Wikelo Emporium locations: Dasi (Hurston), Kinga
					(microTech), and Selo (Yela). Filter by rarity (Common, Uncommon, Rare, Epic, Legendary)
					and manage your inventory with our built-in tracker.
				</p>
			</div>
		</section>
	</article>
</div>
