<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import LanguageToggle from '$lib/components/locations/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';

	let { data }: { data: PageData } = $props();
	let currentLang = $state<'en' | 'fr'>('en');

	const location = data.location;
	const showFullDetails = env.PUBLIC_SHOW_FULL_LOCATION_DETAILS === 'true';

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

	// Get text based on language
	function getText(
		enText: string | null | undefined,
		frText: string | null | undefined,
		deText?: string | null | undefined
	): string {
		if (currentLang === 'fr' && frText) return frText;
		if (currentLang === 'en' && enText) return enText;
		return enText || '';
	}

	// Translations
	const t = $derived({
		backToLocations:
			currentLang === 'fr' ? "Retour aux points d'intérêt" : 'Back to points of interest',
		description: currentLang === 'fr' ? 'Description' : 'Description',
		howToAccess: currentLang === 'fr' ? 'Comment accéder' : 'How to Access',
		missionTypes: currentLang === 'fr' ? 'Types de missions' : 'Mission Types',
		lootTypes: currentLang === 'fr' ? 'Types de butin' : 'Loot Types',
		requirements: currentLang === 'fr' ? 'Prérequis' : 'Requirements',
		rewards: currentLang === 'fr' ? 'Récompenses' : 'Rewards',
		relatedIngredients: currentLang === 'fr' ? 'Ingrédients liés' : 'Related Ingredients',
		crateTypes: currentLang === 'fr' ? 'Types de caisses' : 'Crate Types',
		relatedMissions: currentLang === 'fr' ? 'Missions liées' : 'Related Missions',
		coordinates: currentLang === 'fr' ? 'Coordonnées' : 'Coordinates',
		system: currentLang === 'fr' ? 'Système' : 'System',
		planet: currentLang === 'fr' ? 'Planète' : 'Planet',
		moon: currentLang === 'fr' ? 'Lune' : 'Moon',
		difficulty: currentLang === 'fr' ? 'Difficulté' : 'Difficulty',
		type: currentLang === 'fr' ? 'Type' : 'Type',
		// Type translations
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

	onMount(() => {
		currentLang = 'en';
	});
</script>

<svelte:head>
	<title>{getText(location.name_en, location.name_fr)} - Star Citizen Locations</title>
	<meta
		name="description"
		content={getText(location.short_description_en, location.short_description_fr) ||
			getText(location.description_en, location.description_fr) ||
			''}
	/>
</svelte:head>

<SpaceBackground />

<div class="font-rajdhani relative z-10 container mx-auto max-w-5xl px-4 py-8">
	<!-- Top Navigation -->
	<div class="mb-6 flex items-center justify-between">
		<!-- Back Button -->
		<button
			onclick={() => goto('/locations')}
			class="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 px-4 py-2 font-bold text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
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
				<path d="m12 19-7-7 7-7" />
				<path d="M19 12H5" />
			</svg>
			<span>{t.backToLocations}</span>
		</button>

		<!-- Right side: Language + Auth -->
		<div class="flex items-center gap-3">
			<LanguageToggle
				bind:currentLang
				onLangChange={(lang) => {
					currentLang = lang;
					if (typeof window !== 'undefined') {
						localStorage.setItem('wikelo-lang', lang);
					}
				}}
			/>
			<AuthButton variant="compact" />
		</div>
	</div>

	<!-- Header with Image -->
	<header
		class="mb-8 overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 backdrop-blur-xl"
	>
		{#if location.image_url}
			<div class="relative h-64 overflow-hidden md:h-96">
				<img
					src={location.image_url}
					alt={getText(location.name_en, location.name_fr)}
					class="h-full w-full object-cover"
				/>
				<div
					class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"
				></div>

				<!-- Title overlay on image -->
				<div class="absolute right-0 bottom-0 left-0 p-8">
					<div class="mb-3 flex items-center gap-4">
						<div>
							<h1
								class="font-orbitron text-4xl font-black tracking-wider text-white uppercase drop-shadow-lg md:text-5xl"
							>
								{getText(location.name_en, location.name_fr)}
							</h1>
							<p class="mt-2 text-lg font-light tracking-widest text-cyan-400 uppercase">
								{t[location.type as keyof typeof t]}
							</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-linear-to-br from-cyan-900/20 to-blue-900/20 p-8">
				<div class="flex items-center gap-4">
					<div>
						<h1
							class="font-orbitron text-4xl font-black tracking-wider text-white uppercase md:text-5xl"
						>
							{getText(location.name_en, location.name_fr)}
						</h1>
						<p class="mt-2 text-lg font-light tracking-widest text-cyan-400 uppercase">
							{t[location.type as keyof typeof t]}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<div class="h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent"></div>
	</header>

	<!-- Meta Information -->
	<div class="mb-8 rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<div class="flex flex-col">
				<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">{t.system}</span>
				<span class="text-lg font-bold text-cyan-400"
					>{location.system.charAt(0).toUpperCase() + location.system.slice(1)}</span
				>
			</div>

			{#if showFullDetails && location.planet}
				<div class="flex flex-col">
					<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">{t.planet}</span>
					<span class="text-lg font-bold text-white">{location.planet}</span>
				</div>
			{/if}

			{#if showFullDetails && location.moon}
				<div class="flex flex-col">
					<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">{t.moon}</span>
					<span class="text-lg font-bold text-white">{location.moon}</span>
				</div>
			{/if}

			{#if location.difficulty}
				<div class="flex flex-col">
					<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">{t.difficulty}</span>
					<span class="text-lg font-bold {getDifficultyColor(location.difficulty)}">
						{t[location.difficulty as keyof typeof t]}
					</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="space-y-8">
		<!-- Under Construction Notice -->
		{#if !showFullDetails}
			<div class="rounded-xl border-2 border-yellow-500/40 bg-yellow-900/20 p-4 backdrop-blur-xl">
				<div class="flex items-start gap-3">
					<span class="text-2xl">🚧</span>
					<div class="flex-1">
						<h3 class="font-orbitron mb-2 text-lg font-bold text-yellow-400">
							{currentLang === 'fr'
								? 'Sections en cours de construction'
								: 'Sections Under Construction'}
						</h3>
						<p class="text-sm leading-relaxed text-gray-300">
							{currentLang === 'fr'
								? 'Certaines informations détaillées (accès, missions, butins, coordonnées, etc.) sont actuellement en cours de développement et seront bientôt disponibles.'
								: 'Some detailed information (access, missions, loot, coordinates, etc.) is currently under development and will be available soon.'}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Description -->
		{#if location.description_en || location.description_fr}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-2xl font-bold text-cyan-400">
					<span>📖</span>
					<span>{t.description}</span>
				</h2>
				<p class="leading-relaxed whitespace-pre-line text-gray-300">
					{getText(location.description_en, location.description_fr, location.description_de)}
				</p>
			</section>
		{/if}

		<!-- How to Access -->
		{#if showFullDetails && (location.how_to_access_en || location.how_to_access_fr)}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-2xl font-bold text-cyan-400">
					<span>🚀</span>
					<span>{t.howToAccess}</span>
				</h2>
				<p class="leading-relaxed whitespace-pre-line text-gray-300">
					{getText(location.how_to_access_en, location.how_to_access_fr, location.how_to_access_de)}
				</p>
			</section>
		{/if}

		<!-- Two Column Layout for Mission Types and Loot -->
		{#if showFullDetails}
			<div class="grid gap-8 md:grid-cols-2">
				<!-- Mission Types -->
				{#if location.mission_types_en || location.mission_types_fr}
					<section
						class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl"
					>
						<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
							<span>🎯</span>
							<span>{t.missionTypes}</span>
						</h2>
						<p class="leading-relaxed text-gray-300">
							{getText(
								location.mission_types_en,
								location.mission_types_fr,
								location.mission_types_de
							)}
						</p>
					</section>
				{/if}

				<!-- Loot Types -->
				{#if location.loot_types_en || location.loot_types_fr}
					<section
						class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl"
					>
						<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
							<span>💎</span>
							<span>{t.lootTypes}</span>
						</h2>
						<p class="leading-relaxed text-gray-300">
							{getText(location.loot_types_en, location.loot_types_fr, location.loot_types_de)}
						</p>
					</section>
				{/if}
			</div>
		{/if}

		<!-- Requirements and Rewards -->
		{#if showFullDetails}
			<div class="grid gap-8 md:grid-cols-2">
				<!-- Requirements -->
				{#if location.requirements}
					<section
						class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl"
					>
						<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
							<span>⚠️</span>
							<span>{t.requirements}</span>
						</h2>
						<p class="leading-relaxed text-gray-300">
							{location.requirements}
						</p>
					</section>
				{/if}

				<!-- Rewards -->
				{#if location.rewards}
					<section
						class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl"
					>
						<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
							<span>🏆</span>
							<span>{t.rewards}</span>
						</h2>
						<p class="leading-relaxed text-gray-300">
							{location.rewards}
						</p>
					</section>
				{/if}
			</div>
		{/if}

		<!-- Crate Types -->
		{#if showFullDetails && location.crate_types && location.crate_types.length > 0}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
					<span>📦</span>
					<span>{t.crateTypes}</span>
				</h2>
				<ul class="space-y-2">
					{#each location.crate_types as crateType}
						<li class="flex items-center gap-2 text-gray-300">
							<span class="text-cyan-400">▸</span>
							<span>{crateType.replace(/_/g, ' ').toUpperCase()}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Related Missions -->
		{#if showFullDetails && location.related_missions && location.related_missions.length > 0}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
					<span>📋</span>
					<span>{t.relatedMissions}</span>
				</h2>
				<ul class="space-y-2">
					{#each location.related_missions as mission}
						<li class="flex items-center gap-2 text-gray-300">
							<span class="text-cyan-400">▸</span>
							<span>{mission}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Related Ingredients -->
		{#if location.ingredients && location.ingredients.length > 0}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
					<span>🧪</span>
					<span>{t.relatedIngredients}</span>
				</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each location.ingredients as ingredient}
						<a
							href="/wikelo"
							class="flex cursor-pointer items-center gap-3 rounded-lg border border-cyan-500/30 bg-white/5 p-4 transition-all hover:border-cyan-500/70 hover:bg-white/10"
						>
							{#if ingredient.ingredient_image_url}
								<img
									src={ingredient.ingredient_image_url}
									alt={currentLang === 'fr'
										? ingredient.ingredient_name_fr
										: ingredient.ingredient_name_en}
									class="h-12 w-12 rounded object-cover"
								/>
							{/if}
							<div>
								<div class="font-bold text-white">
									{currentLang === 'fr'
										? ingredient.ingredient_name_fr
										: ingredient.ingredient_name_en}
								</div>
								<div class="text-xs text-gray-400 uppercase">
									{ingredient.ingredient_category}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Coordinates (if available) -->
		{#if showFullDetails && location.coordinates}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-xl font-bold text-cyan-400">
					<span>📍</span>
					<span>{t.coordinates}</span>
				</h2>
				<code class="block rounded-lg bg-black/50 p-4 font-mono text-sm text-cyan-400">
					{location.coordinates}
				</code>
			</section>
		{/if}

		<!-- Cheatsheet Image -->
		{#if location.cheatsheet_image_url}
			<section class="rounded-xl border-2 border-cyan-500/30 bg-slate-900/85 p-6 backdrop-blur-xl">
				<h2 class="font-orbitron mb-4 flex items-center gap-2 text-2xl font-bold text-cyan-400">
					<span>📋</span>
					<span>{currentLang === 'fr' ? 'Guide Visuel' : 'Visual Guide'}</span>
				</h2>
				<a
					href={location.cheatsheet_image_url}
					target="_blank"
					rel="noopener noreferrer"
					class="group block cursor-pointer overflow-hidden rounded-lg border border-cyan-500/20 transition-all hover:border-cyan-500/50"
				>
					<img
						src={location.cheatsheet_image_url}
						alt="{getText(location.name_en, location.name_fr)} cheatsheet"
						class="h-auto w-full bg-black/30 object-contain transition-opacity group-hover:opacity-90"
					/>
				</a>
				<p class="mt-2 text-center text-xs text-gray-400">
					{currentLang === 'fr'
						? 'Cliquez pour ouvrir en plein écran'
						: 'Click to open in full screen'}
				</p>
			</section>
		{/if}
	</div>
</div>
