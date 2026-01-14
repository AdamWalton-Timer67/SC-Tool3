<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { LocationCardData, LocationType, LocationDifficulty } from '$lib/types/location';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import LanguageToggle from '$lib/components/locations/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	// Use wikeloStore for language management (synchronized with other pages)
	const currentLang = $derived(wikeloStore.currentLang);

	onMount(() => {
		// Force English as default on locations page
		wikeloStore.currentLang = 'en';
	});

	let searchQuery = $state('');
	let selectedSystem: string | 'all' = $state('all');
	let selectedDifficulty: LocationDifficulty | 'all' = $state('all');

	// Filtered locations based on search and filters
	const filteredLocations = $derived(() => {
		let results = data.locations || [];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			results = results.filter(
				(loc) =>
					loc.name_en.toLowerCase().includes(query) ||
					loc.name_fr.toLowerCase().includes(query) ||
					loc.short_description_en?.toLowerCase().includes(query) ||
					loc.short_description_fr?.toLowerCase().includes(query)
			);
		}

		// System filter
		if (selectedSystem !== 'all') {
			results = results.filter((loc) => loc.system === selectedSystem);
		}

		// Difficulty filter
		if (selectedDifficulty !== 'all') {
			results = results.filter((loc) => loc.difficulty === selectedDifficulty);
		}

		return results;
	});

	// Get unique systems
	const systems = $derived(() => {
		const systemSet = new Set(data.locations.map((l) => l.system));
		return Array.from(systemSet).sort();
	});

	// Translations
	const t = $derived({
		title: currentLang === 'fr' ? "Points d'Intérêt" : 'Points of Interest',
		subtitle:
			currentLang === 'fr'
				? 'Explorez les lieux remarquables de Star Citizen'
				: "Explore Star Citizen's remarkable locations",
		search:
			currentLang === 'fr' ? "Rechercher un point d'intérêt..." : 'Search point of interest...',
		allSystems: currentLang === 'fr' ? 'Tous les systèmes' : 'All Systems',
		systemsLabel: currentLang === 'fr' ? 'Systèmes' : 'Systems',
		allDifficulties: currentLang === 'fr' ? 'Toutes difficultés' : 'All Difficulties',
		difficultiesLabel: currentLang === 'fr' ? 'Difficulté' : 'Difficulty',
		backToHome: currentLang === 'fr' ? "Retour à l'accueil" : 'Back to home',
		ingredients: currentLang === 'fr' ? 'ingrédients' : 'ingredients',
		viewDetails: currentLang === 'fr' ? 'Voir les détails' : 'View details',
		noResults:
			currentLang === 'fr' ? "Aucun point d'intérêt trouvé" : 'No points of interest found',
		locationsAvailable:
			currentLang === 'fr' ? "points d'intérêt disponibles" : 'points of interest available',
		// Type translations (for badges in cards)
		contested_zone: currentLang === 'fr' ? "Point d'Intérêt" : 'Point of Interest',
		orbital_laser: currentLang === 'fr' ? 'Laser Orbital' : 'Orbital Laser',
		investigation: currentLang === 'fr' ? 'Investigation' : 'Investigation',
		underground_facility:
			currentLang === 'fr' ? 'Installation Souterraine' : 'Underground Facility',
		warehouse: currentLang === 'fr' ? 'Entrepôt' : 'Warehouse',
		bunker: currentLang === 'fr' ? 'Bunker' : 'Bunker',
		other: currentLang === 'fr' ? 'Autre' : 'Other',
		// Difficulty translations
		low: currentLang === 'fr' ? 'Faible' : 'Low',
		'low-medium': currentLang === 'fr' ? 'Faible-Moyen' : 'Low-Medium',
		medium: currentLang === 'fr' ? 'Moyen' : 'Medium',
		'medium-high': currentLang === 'fr' ? 'Moyen-Élevé' : 'Medium-High',
		high: currentLang === 'fr' ? 'Élevé' : 'High'
	});

	// Get type icon
	function getTypeIcon(type: LocationType): string {
		const icons: Record<LocationType, string> = {
			contested_zone: '🗺️',
			orbital_laser: '🔫',
			investigation: '🔍',
			underground_facility: '🏢',
			warehouse: '📦',
			bunker: '🛡️',
			other: '📍'
		};
		return icons[type] || '📍';
	}

	// Get difficulty color
	function getDifficultyColor(difficulty: string | undefined | null): string {
		if (!difficulty) return 'text-gray-400';
		const colors: Record<string, string> = {
			low: 'text-green-400',
			'low-medium': 'text-lime-400',
			medium: 'text-yellow-400',
			'medium-high': 'text-orange-400',
			high: 'text-red-400'
		};
		return colors[difficulty] || 'text-gray-400';
	}

	// Get name based on language
	function getName(location: LocationCardData): string {
		return currentLang === 'fr' ? location.name_fr : location.name_en;
	}

	// Get description based on language
	function getDescription(location: LocationCardData): string | null | undefined {
		return currentLang === 'fr' ? location.short_description_fr : location.short_description_en;
	}
</script>

<svelte:head>
	<title>Star Citizen Locations - Points of Interest, Underground Facilities & Orbital Lasers</title>
	<meta
		name="description"
		content="Explore Star Citizen points of interest: Hator, Orbital Lasers, Underground Facilities, Investigation sites, Warehouses, and Bunkers. Complete guide with coordinates, difficulty ratings, and detailed information for Pyro and Stanton systems. Updated for Alpha 4.5."
	/>
	<meta
		name="keywords"
		content="Star Citizen locations, Star Citizen points of interest, Pyro locations, Stanton locations, Hator Star Citizen, Orbital Laser locations, Underground Facilities Star Citizen, Investigation sites, Star Citizen Warehouses, Star Citizen Bunkers, contested zones Star Citizen, Star Citizen coordinates, POI Star Citizen, Star Citizen map, Alpha 4.5 locations, Star Citizen guide, location difficulty, Star Citizen Pyro system, Star Citizen exploration"
	/>

	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.star-citizen-wikelo-tools.space/locations" />

	<!-- Hreflang for multilingual support -->
	<link rel="alternate" hreflang="en" href="https://www.star-citizen-wikelo-tools.space/locations" />
	<link rel="alternate" hreflang="fr" href="https://www.star-citizen-wikelo-tools.space/locations" />
	<link rel="alternate" hreflang="x-default" href="https://www.star-citizen-wikelo-tools.space/locations" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/locations" />
	<meta property="og:title" content="Star Citizen Locations - Points of Interest & Facilities Guide" />
	<meta
		property="og:description"
		content="Complete guide to Star Citizen locations: Orbital Lasers, Underground Facilities, Investigation sites, and more. Explore Pyro and Stanton systems with detailed coordinates and difficulty ratings."
	/>
	<meta
		property="og:image"
		content="https://www.star-citizen-wikelo-tools.space/android-chrome-512x512.png"
	/>

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.star-citizen-wikelo-tools.space/locations" />
	<meta name="twitter:title" content="Star Citizen Locations Guide" />
	<meta
		name="twitter:description"
		content="Explore Star Citizen points of interest with detailed guides and coordinates"
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
			"@type": "ItemList",
			"name": "Star Citizen Locations and Points of Interest",
			"description": "Comprehensive database of Star Citizen locations including Orbital Lasers, Underground Facilities, Investigation sites, Warehouses, and Bunkers across Pyro and Stanton systems",
			"url": "https://www.star-citizen-wikelo-tools.space/locations",
			"numberOfItems": data.locations.length,
			"itemListElement": data.locations.slice(0, 10).map((loc, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"item": {
					"@type": "Place",
					"name": loc.name_en,
					"description": loc.short_description_en || `${loc.type} in ${loc.system} system`,
					"url": `https://www.star-citizen-wikelo-tools.space/locations/${loc.slug}`
				}
			}))
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
					"name": "Locations",
					"item": "https://www.star-citizen-wikelo-tools.space/locations"
				}
			]
		})}
	</script>
</svelte:head>

<SpaceBackground />

<div class="font-rajdhani relative z-10 container mx-auto max-w-7xl px-4 py-8">
	<!-- Top Navigation -->
	<div class="mb-4">
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
				<LanguageToggle
					currentLang={wikeloStore.currentLang}
					onLangChange={(lang) => {
						wikeloStore.currentLang = lang;
					}}
				/>
				<AuthButton variant="compact" />
			</div>
		</div>

		<!-- Second row on mobile: Language + Auth centered -->
		<div class="flex sm:hidden items-center justify-center gap-3">
			<LanguageToggle
				currentLang={wikeloStore.currentLang}
				onLangChange={(lang) => {
					wikeloStore.currentLang = lang;
				}}
			/>
			<AuthButton variant="compact" />
		</div>
	</div>

	<!-- Header -->
	<header
		class="relative mb-4 sm:mb-8 overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 backdrop-blur-xl"
	>
		<!-- Animated top border with cyan/blue theme -->
		<div
			class="absolute top-0 right-0 left-0 h-1 animate-pulse bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500"
		></div>

		<div class="p-4 sm:p-6 md:p-8">
			<div class="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 md:gap-6">
				<!-- Map icon -->
				<div class="animate-pulse text-3xl sm:text-4xl md:text-6xl text-cyan-400">🗺️</div>

				<div>
					<h1
						class="font-orbitron bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider text-transparent uppercase"
					>
						{t.title}
					</h1>
					<p class="mt-1 sm:mt-2 text-xs sm:text-sm font-light tracking-widest text-cyan-400 uppercase">
						{t.subtitle}
					</p>
				</div>
			</div>

			<div class="text-xs sm:text-sm text-gray-400">
				{filteredLocations().length}
				{t.locationsAvailable}
			</div>
		</div>

		<div class="h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent"></div>
	</header>

	<!-- Search & System Filters -->
	<div class="mb-4 rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
		<div class="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
			<!-- Search -->
			<div class="relative w-full lg:w-96">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={t.search}
					class="w-full rounded-lg border-2 border-cyan-500/30 bg-white/5 px-4 py-3 pl-12 text-white placeholder-gray-400 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
				/>
				<span class="absolute top-1/2 left-4 -translate-y-1/2 text-xl">🔍</span>
			</div>

			<!-- System Filter Badges -->
			<div class="flex flex-wrap gap-2">
				<button
					onclick={() => (selectedSystem = 'all')}
					class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedSystem === 'all'
						? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
						: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
				>
					{t.allSystems}
				</button>
				{#each systems() as system}
					<button
						onclick={() => (selectedSystem = system)}
						class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedSystem ===
						system
							? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
							: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
					>
						{system.charAt(0).toUpperCase() + system.slice(1)}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Difficulty Filters -->
	<div class="mb-8 flex flex-wrap gap-2">
		<button
			onclick={() => (selectedDifficulty = 'all')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty === 'all'
				? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t.allDifficulties}
		</button>
		<button
			onclick={() => (selectedDifficulty = 'low')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty === 'low'
				? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t.low}
		</button>
		<button
			onclick={() => (selectedDifficulty = 'low-medium')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty ===
			'low-medium'
				? 'bg-lime-500 text-white shadow-lg shadow-lime-500/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t['low-medium']}
		</button>
		<button
			onclick={() => (selectedDifficulty = 'medium')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty ===
			'medium'
				? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t.medium}
		</button>
		<button
			onclick={() => (selectedDifficulty = 'medium-high')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty ===
			'medium-high'
				? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t['medium-high']}
		</button>
		<button
			onclick={() => (selectedDifficulty = 'high')}
			class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {selectedDifficulty ===
			'high'
				? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
				: 'border border-cyan-500/30 bg-white/5 text-gray-400 hover:bg-white/10'}"
		>
			{t.high}
		</button>
	</div>

	<!-- Locations Grid -->
	<main class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredLocations() as location (location.id)}
			<a
				href="/locations/{location.slug}"
				class="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:border-cyan-500/70 hover:shadow-cyan-500/40"
			>
				<!-- Image -->
				{#if location.image_url}
					<div class="relative h-48 overflow-hidden">
						<img
							src={location.image_url}
							alt={getName(location)}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						/>
						<div class="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent"></div>
					</div>
				{:else}
					<div
						class="flex h-48 items-center justify-center bg-linear-to-br from-cyan-900/20 to-blue-900/20"
					>
						<span class="text-6xl">{getTypeIcon(location.type)}</span>
					</div>
				{/if}

				<!-- Content -->
				<div class="p-6">
					<!-- Badges -->
					<div class="mb-3 flex flex-wrap items-center gap-2">
						<span
							class="rounded-full border border-cyan-500/50 bg-cyan-500/20 px-3 py-1 text-xs font-bold tracking-wider text-cyan-400 uppercase"
						>
							{location.system}
						</span>
						{#if location.difficulty}
							<span
								class="rounded-full bg-white/5 px-3 py-1 text-xs font-bold tracking-wider uppercase {getDifficultyColor(
									location.difficulty
								)}"
							>
								{t[location.difficulty as keyof typeof t]}
							</span>
						{/if}
					</div>

					<!-- Title -->
					<h3
						class="font-orbitron mb-2 text-xl font-bold text-white transition-colors group-hover:text-cyan-400"
					>
						{getName(location)}
					</h3>

					<!-- Description -->
					{#if getDescription(location)}
						<p class="mb-4 line-clamp-2 text-sm text-gray-400">
							{getDescription(location)}
						</p>
					{/if}

					<!-- Meta Info -->
					<div class="flex items-center justify-between text-xs text-gray-500">
						{#if location.ingredient_count > 0}
							<span class="flex items-center gap-1">
								<span>📦</span>
								<span>{location.ingredient_count} {t.ingredients}</span>
							</span>
						{/if}
					</div>

					<!-- View Details Arrow -->
					<div class="mt-4 flex items-center gap-2 font-bold text-cyan-400">
						<span>{t.viewDetails}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="transition-transform group-hover:translate-x-1"
						>
							<path d="M5 12h14" />
							<path d="m12 5 7 7-7 7" />
						</svg>
					</div>
				</div>
			</a>
		{:else}
			<p class="col-span-full text-center text-gray-400 py-20 text-xl">
				{t.noResults}
			</p>
		{/each}
	</main>

	<!-- SEO-Rich Content Section -->
	<article class="mt-12 rounded-xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
		<h2 class="mb-6 text-2xl font-bold text-white">
			{currentLang === 'fr'
				? 'Guide des Points d\'Intérêt Star Citizen'
				: 'Star Citizen Points of Interest Guide'}
		</h2>
		
		<div class="space-y-4 leading-relaxed text-gray-400">
			{#if currentLang === 'fr'}
				<p>
					Découvrez tous les <strong class="text-cyan-400">points d'intérêt</strong> de Star Citizen à travers les systèmes Pyro et Stanton. Notre base de données complète répertorie les <strong>lasers orbitaux</strong>, <strong>installations souterraines</strong>, <strong>sites d'investigation</strong>, <strong>entrepôts</strong> et <strong>bunkers</strong> avec leurs coordonnées précises et niveaux de difficulté.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Types de Locations</h3>
				<p>
					Explorez différents types de sites : les <strong>zones contestées</strong> offrent des défis PvP intenses, les <strong>installations souterraines</strong> proposent des missions d'infiltration complexes, tandis que les <strong>lasers orbitaux</strong> nécessitent une approche tactique. Chaque type de location présente des récompenses et des dangers uniques.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Système Pyro et Stanton</h3>
				<p>
					Le système <strong>Pyro</strong> introduit de nouveaux points d'intérêt comme <strong>Hator</strong> et des zones de combat intensif. Le système <strong>Stanton</strong> reste riche en locations variées, des plateformes orbitales aux bunkers planétaires. Utilisez nos filtres pour trouver rapidement les sites adaptés à votre niveau et vos objectifs.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Niveaux de Difficulté</h3>
				<p>
					Chaque location est classée par difficulté (Faible, Moyen, Élevé) pour vous aider à planifier vos missions. Les débutants peuvent commencer par des sites de difficulté faible, tandis que les joueurs expérimentés peuvent s'attaquer aux installations de haute difficulté pour des récompenses plus importantes.
				</p>
			{:else}
				<p>
					Discover all <strong class="text-cyan-400">points of interest</strong> in Star Citizen across Pyro and Stanton systems. Our comprehensive database lists <strong>orbital lasers</strong>, <strong>underground facilities</strong>, <strong>investigation sites</strong>, <strong>warehouses</strong>, and <strong>bunkers</strong> with precise coordinates and difficulty ratings.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Location Types</h3>
				<p>
					Explore different site types: <strong>contested zones</strong> offer intense PvP challenges, <strong>underground facilities</strong> provide complex infiltration missions, while <strong>orbital lasers</strong> require tactical approaches. Each location type presents unique rewards and dangers.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Pyro and Stanton Systems</h3>
				<p>
					The <strong>Pyro</strong> system introduces new points of interest like <strong>Hator</strong> and intense combat zones. The <strong>Stanton</strong> system remains rich in varied locations, from orbital platforms to planetary bunkers. Use our filters to quickly find sites suited to your level and objectives.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Difficulty Levels</h3>
				<p>
					Each location is rated by difficulty (Low, Medium, High) to help you plan your missions. Beginners can start with low-difficulty sites, while experienced players can tackle high-difficulty facilities for greater rewards.
				</p>
			{/if}
		</div>
	</article>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
