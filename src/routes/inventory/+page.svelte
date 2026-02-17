<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { onMount } from 'svelte';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import DataSources from '$lib/components/wikelo/DataSources.svelte';
	import ContactInfo from '$lib/components/wikelo/ContactInfo.svelte';
	import LoginRequiredDialog from '$lib/components/LoginRequiredDialog.svelte';
	import { captureEvent } from '$lib/analytics';
	import {
		getCategoryIcon,
		getCategoryTranslation,
		getAllCategoryTranslations,
	} from '$lib/utils/categories';

	let searchQuery = $state('');
	let selectedCategory = $state('all');

	let selectedRarity = $state('all');
	let favoritesOnly = $state(false);
	let showLoginDialog = $state(false);

	onMount(async () => {
		// Force English as default on inventory page
		wikeloStore.currentLang = 'en';

		// Check if we're coming from admin (localStorage flag)
		const shouldReload = localStorage.getItem('wikelo_reload_needed');
		if (shouldReload === 'true') {
			localStorage.removeItem('wikelo_reload_needed');
			await wikeloStore.reloadData();
		} else {
			// Data is already loaded by the store constructor, just ensure it's complete
			if (!wikeloStore.dataLoaded) {
				await wikeloStore.loadData();
			}
		}

		// Track page view
		captureEvent('inventory_page_viewed', {
			timestamp: new Date().toISOString()
		});
	});

	// Get ingredient categories from index
	const ingredientCategories = $derived.by(() => {
		if (wikeloStore.isLoading || wikeloStore.ingredients.length === 0) {
			return [];
		}

		const categories = new Map<
			string,
			{ id: string; name: { en: string; fr: string }; ingredients: any[] }
		>();

		wikeloStore.ingredients.forEach((ingredient) => {
			if (!categories.has(ingredient.category)) {
				categories.set(ingredient.category, {
					id: ingredient.category,
					name: { en: ingredient.category, fr: ingredient.category },
					ingredients: []
				});
			}
			categories.get(ingredient.category)!.ingredients.push(ingredient);
		});

		return Array.from(categories.values());
	});

	// Filter ingredients based on search, category, and rarity
	const filteredIngredients = $derived.by(() => {
		if (wikeloStore.isLoading || wikeloStore.ingredients.length === 0) {
			return [];
		}

		let filtered = wikeloStore.ingredients;

		// Category filter
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((ing) => ing.category === selectedCategory);
		}

		// Rarity filter
		if (selectedRarity !== 'all') {
			filtered = filtered.filter((ing) => ing.rarity === selectedRarity);
		}

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(ing) =>
					wikeloStore.getText(ing.name).toLowerCase().includes(query) ||
					wikeloStore.getText(ing.description).toLowerCase().includes(query)
			);
		}

		// Favorites filter
		if (favoritesOnly) {
			filtered = filtered.filter((ing) => wikeloStore.isFavoriteIngredient(ing.id));
		}

		return filtered;
	});

	// Group filtered ingredients by category
	const groupedIngredients = $derived.by(() => {
		const groups = new Map<string, any[]>();

		filteredIngredients.forEach((ingredient) => {
			if (!groups.has(ingredient.category)) {
				groups.set(ingredient.category, []);
			}
			groups.get(ingredient.category)!.push(ingredient);
		});

		return Array.from(groups.entries()).map(([category, ingredients]) => ({
			category,
			ingredients: ingredients.sort((a, b) =>
				wikeloStore.getText(a.name).localeCompare(wikeloStore.getText(b.name))
			)
		}));
	});

	function handleQuantityInput(ingredientId: string, value: string, ingredientName?: string) {
		if (!wikeloStore.isAuthenticated) {
			showLoginDialog = true;
			return;
		}

		const num = parseInt(value) || 0;
		wikeloStore.setInventoryQuantity(ingredientId, Math.max(0, num));
		captureEvent('inventory_quantity_input_changed', {
			ingredientId,
			ingredientName,
			newQuantity: Math.max(0, num),
			method: 'input'
		});
	}

	function handleQuantityButton(ingredientId: string, adjustment: number, ingredientName?: string) {
		if (!wikeloStore.isAuthenticated) {
			showLoginDialog = true;
			return;
		}

		wikeloStore.adjustInventoryQuantity(ingredientId, adjustment);
		captureEvent('inventory_quantity_button_clicked', {
			ingredientId,
			ingredientName,
			adjustment,
			method: 'button'
		});
	}

	// Utiliser les traductions centralisées
	const categoryTranslations = $derived(getAllCategoryTranslations(wikeloStore.currentLang));

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Inventaire Wikelo',
					subtitle: 'Banu Trading Systems • Gestion des Ressources',
					search: 'Rechercher un ingrédient...',
					noResults: 'Aucun ingrédient trouvé',
					quantity: 'Quantité',
					quantityOwned: 'Quantité possédée',
					total: 'Total des Objets',
					items: 'objets',
					uniqueTypes: 'Types Uniques',
					different: 'différents',
					allCategories: 'Toutes',
					allRarities: 'Toutes',
					favoritesOnly: 'Favoris',
					...categoryTranslations
				}
			: {
					title: 'Wikelo my Inventory',
					subtitle: 'Banu Trading Systems • Resource Management',
					search: 'Search for an ingredient...',
					noResults: 'No ingredients found',
					quantity: 'Quantity',
					quantityOwned: 'Quantity owned',
					total: 'Total Items',
					items: 'items',
					uniqueTypes: 'Unique Types',
					different: 'different',
					allCategories: 'All',

					allRarities: 'All',
					favoritesOnly: 'Favorites',
					...categoryTranslations
				}
	);

	const totalItems = $derived(
		Object.values(wikeloStore.inventory).reduce((sum, qty) => sum + qty, 0)
	);
	const uniqueItems = $derived(Object.keys(wikeloStore.inventory).length);

	// Get unique rarities avec traductions
	const rarities = $derived.by(() => {
		if (wikeloStore.isLoading || wikeloStore.ingredients.length === 0) {
			return [];
		}

		const raritySet = new Set(wikeloStore.ingredients.map((i) => i.rarity));
		return Array.from(raritySet).sort();
	});
</script>

<svelte:head>
	<title>Wikelo Inventory Manager - Star Citizen Materials Tracker & Database</title>
	<meta
		name="description"
		content="Free Star Citizen Wikelo inventory manager. Track Valakkar Fangs, Pearls, Carinite, Jaclium, MG Scrip, Council Scrip, and 60+ crafting materials. Real-time sync, CSV export/import, multi-language support. Updated for Alpha 4.5."
	/>
	<meta
		name="keywords"
		content="Star Citizen inventory manager, Wikelo ingredients tracker, Wikelo Emporium inventory, Star Citizen crafting materials, Valakkar Fang tracker, Valakkar Pearl tracker, Carinite inventory, Jaclium tracker, Saldynium tracker, Quantanium tracker, MG Scrip calculator, Council Scrip tracker, Wikelo Favor calculator, Star Citizen materials database, inventory tracker, Star Citizen CSV export, Star Citizen resources manager, Banu merchant inventory, Star Citizen Alpha 4.5, free inventory tool, Tevarin War Service Markers, ASD Secure Drives, mining materials tracker, organic materials Star Citizen"
	/>

	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.star-citizen-wikelo-tools.space/inventory" />

	<!-- Hreflang for multilingual support -->
	<link rel="alternate" hreflang="en" href="https://www.star-citizen-wikelo-tools.space/inventory" />
	<link rel="alternate" hreflang="fr" href="https://www.star-citizen-wikelo-tools.space/inventory" />
	<link rel="alternate" hreflang="x-default" href="https://www.star-citizen-wikelo-tools.space/inventory" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/inventory" />
	<meta property="og:title" content="Wikelo Inventory Manager - Star Citizen Ingredient Tracker" />
	<meta
		property="og:description"
		content="Free inventory manager for Star Citizen Wikelo Emporium ingredients. Track all crafting materials, currencies, and resources with CSV export/import support."
	/>
	<meta
		property="og:image"
		content="https://www.star-citizen-wikelo-tools.space/images/wikelo/wikelo_favor.webp"
	/>

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.star-citizen-wikelo-tools.space/inventory" />
	<meta name="twitter:title" content="Wikelo Inventory Manager - Star Citizen" />
	<meta
		name="twitter:description"
		content="Track and manage your Star Citizen Wikelo Emporium ingredients inventory"
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
			"@type": "WebApplication",
			"name": "Wikelo Inventory Manager",
			"url": "https://www.star-citizen-wikelo-tools.space/inventory",
			"description": "Free inventory management tool for Star Citizen Wikelo Emporium ingredients. Track crafting materials, currencies, and resources with real-time synchronization.",
			"applicationCategory": "GameApplication",
			"operatingSystem": "Web Browser",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"featureList": [
				"Track 60+ Wikelo ingredients",
				"Real-time inventory synchronization",
				"CSV export and import",
				"Multi-language support (English/French)",
				"Category-based organization",
				"Search and filter functionality",
				"Favorites system",
				"Automatic cloud save"
			],
			"screenshot": "https://www.star-citizen-wikelo-tools.space/images/wikelo/wikelo_favor.webp",
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
					"name": "Inventory",
					"item": "https://www.star-citizen-wikelo-tools.space/inventory"
				}
			]
		})}
	</script>
</svelte:head>

<div class="space-background">
	<div class="stars"></div>
	<div class="stars-layer-2"></div>
	<div class="nebula"></div>
</div>

<div class="font-rajdhani relative z-10 container mx-auto max-w-7xl px-4 py-8">
	<!-- Top Navigation - Back button + Language + Auth -->
	<div class="mb-4">
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
		class="relative mb-8 overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 backdrop-blur-xl"
	>
		<!-- Animated top border -->
		<div
			class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-purple-500 to-cyan-400"
		></div>

		<div class="p-4 sm:p-8">
			<div class="flex flex-wrap items-center justify-between gap-4 sm:gap-8">
				<!-- Logo Section -->
				<div class="flex items-center gap-3 sm:gap-6">
					<div class="animate-pulse text-3xl text-purple-400 sm:text-6xl">📦</div>

					<div>
						<h1
							class="font-orbitron bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
						>
							{t.title}
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
							>{t.total}</span
						>
						<span class="font-orbitron text-shadow-glow text-xl font-bold text-cyan-400 sm:text-3xl"
							>{totalItems}</span
						>
					</div>

					<div
						class="flex min-w-[80px] flex-col items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 sm:min-w-[120px] sm:px-6 sm:py-4"
					>
						<span class="mb-1 text-[10px] tracking-wider text-gray-400 uppercase sm:text-xs"
							>{t.uniqueTypes}</span
						>
						<span
							class="font-orbitron text-shadow-glow text-xl font-bold text-purple-400 sm:text-3xl"
							>{uniqueItems}</span
						>
					</div>
				</div>
			</div>
		</div>

		<div class="h-px bg-linear-to-r from-transparent via-purple-400 to-transparent"></div>
	</header>

	<!-- Filter Bar -->
	<div class="mb-4 rounded-xl border border-white/10 bg-slate-900/85 p-4 backdrop-blur-xl sm:p-6">
		<div class="flex flex-wrap items-center gap-3 sm:gap-6">
			<!-- Search -->
			<div class="relative min-w-[200px] flex-1 sm:min-w-[250px]">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={t.search}
					class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 pl-12 text-sm text-white placeholder-gray-400 transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none sm:text-base"
				/>
				<span class="absolute top-1/2 left-4 -translate-y-1/2 text-xl">🔍</span>
			</div>

			<!-- Favorites Filter -->
			<button
				onclick={() => {
					favoritesOnly = !favoritesOnly;
					captureEvent('inventory_favorites_filter_toggled', { enabled: favoritesOnly });
				}}
				class="hidden cursor-pointer items-center gap-2 rounded-lg border transition-all hover:scale-105 sm:flex px-4 py-2
					{favoritesOnly
					? 'border-pink-500 bg-pink-500/20 text-pink-400 shadow-lg shadow-pink-500/20'
					: 'border-white/10 bg-white/5 text-gray-400 hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-300'}"
				title={t.favoritesOnly}
			>
				<span class={favoritesOnly ? 'animate-pulse' : ''}>❤️</span>
				<span class="font-bold">{t.favoritesOnly}</span>
			</button>

			<!-- Rarity Filters -->
			<div class="hidden flex-wrap gap-2 sm:flex">
				<button
					onclick={() => (selectedRarity = 'all')}
					class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
						{selectedRarity === 'all'
						? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
						: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
				>
					{t.allRarities}
				</button>
				{#each rarities as rarity}
					<button
						onclick={() => (selectedRarity = rarity)}
						class="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all
							{selectedRarity === rarity
							? 'border-cyan-400 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
							: 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10'}"
					>
						{t[rarity.toLowerCase() as keyof typeof t] || rarity}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Categories Navigation -->
	<nav class="mb-4 flex flex-wrap gap-2 sm:gap-3">
		<button
			onclick={() => {
				selectedCategory = 'all';
				captureEvent('inventory_category_filter_changed', { category: 'all' });
			}}
			class="flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all sm:gap-2 sm:px-6 sm:py-3 sm:text-sm {selectedCategory ===
			'all'
				? 'border-transparent bg-linear-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10 sm:hover:-translate-y-1'}"
		>
			<span class="text-sm sm:text-base">📦</span>
			<span>{t.allCategories}</span>
		</button>

		{#each ingredientCategories as category}
			<button
				onclick={() => {
					selectedCategory = category.id;
					captureEvent('inventory_category_filter_changed', { category: category.id });
				}}
				class="flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-all sm:gap-2 sm:px-6 sm:py-3 sm:text-sm {selectedCategory ===
				category.id
					? 'border-transparent bg-linear-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/50'
					: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-cyan-400/50 hover:bg-white/10 sm:hover:-translate-y-1'}"
			>
				<span class="text-sm sm:text-base">{getCategoryIcon(category.id)}</span>
				<span>{t[category.id as keyof typeof t] || category.id}</span>
			</button>
		{/each}
	</nav>

	<!-- Main Content -->
	<main>
		{#if wikeloStore.isLoading}
			<div class="py-20 text-center">
				<div
					class="inline-block h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"
				></div>
				<p class="font-rajdhani mt-4 text-gray-400">
					{wikeloStore.currentLang === 'fr' ? 'Chargement...' : 'Loading...'}
				</p>
			</div>
		{:else if groupedIngredients.length === 0}
			<div class="py-20 text-center">
				<p class="font-rajdhani text-xl text-gray-400">{t.noResults}</p>
			</div>
		{:else}
			{#each groupedIngredients as group}
				<section class="mb-12">
					<!-- Category Title -->
					<div class="mb-6 flex items-center gap-4">
						<div
							class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
						></div>
						<h2
							class="font-orbitron flex items-center gap-3 text-2xl font-bold tracking-wider text-cyan-400 uppercase"
						>
							<span class="text-2xl">{getCategoryIcon(group.category)}</span>
							{getCategoryTranslation(group.category, wikeloStore.currentLang)}
							<span class="font-rajdhani text-sm text-gray-500 normal-case"
								>({group.ingredients.length})</span
							>
						</h2>
						<div
							class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
						></div>
					</div>

					<!-- Ingredients Grid - Max 2 per row -->
					<div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
						{#each group.ingredients as ingredient}
							{@const quantity = wikeloStore.getInventoryQuantity(ingredient.id)}
							<div
								class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 p-4 backdrop-blur-xl transition-all hover:border-cyan-500/50 sm:p-6"
							>
								<!-- Hover effect -->
								<div
									class="absolute inset-0 bg-linear-to-r from-cyan-400/5 via-purple-500/5 to-cyan-400/5 opacity-0 transition-opacity group-hover:opacity-100"
								></div>

								<!-- Favorite Button (Absolute Top Right) -->
								<div class="absolute top-2 right-2 z-20">
									<button
										onclick={(e) => {
											e.stopPropagation();
											if (!wikeloStore.currentUser) {
												showLoginDialog = true;
												return;
											}
											wikeloStore.toggleFavoriteIngredient(ingredient.id);
											captureEvent('inventory_favorite_toggled', {
												ingredientId: ingredient.id,
												ingredientName: wikeloStore.getText(ingredient.name),
												isFavorite: !wikeloStore.isFavoriteIngredient(ingredient.id)
											});
										}}
										class="rounded-full bg-slate-900/50 p-2 backdrop-blur-sm transition-all hover:bg-pink-500/10 hover:scale-110"
										title={wikeloStore.isFavoriteIngredient(ingredient.id)
											? 'Remove from favorites'
											: 'Add to favorites'}
									>
										<span
											class="text-xl transition-transform duration-300 {wikeloStore.isFavoriteIngredient(
												ingredient.id
											)
												? 'text-pink-500'
												: 'text-gray-400 hover:text-pink-400'}"
										>
											{wikeloStore.isFavoriteIngredient(ingredient.id) ? '❤️' : '🤍'}
										</span>
									</button>
								</div>

								<!-- MOBILE LAYOUT -->
								<div class="relative sm:hidden">
									<div class="mb-4 flex gap-3">
										<!-- Image Left - Improved Style -->
										<div class="relative shrink-0">
											<!-- Glow effect -->
											<div
												class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-md"
											></div>
											<!-- Image container with burned edges style -->
											<div
												class="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-cyan-400/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-cyan-400/20"
											>
												<img
													src={ingredient.image}
													alt={wikeloStore.getText(ingredient.name)}
													class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
													onerror={(e) => {
														const img = e.currentTarget as HTMLImageElement;
														img.style.display = 'none';
														const parent = img.parentElement;
														if (parent && !parent.querySelector('.image-placeholder')) {
															const placeholder = document.createElement('div');
															placeholder.className =
																'image-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
															placeholder.innerHTML = `
																<div class="text-3xl mb-1 opacity-40">⚠</div>
																<div class="text-[8px] text-cyan-400/60 uppercase tracking-widest font-orbitron">Data Lost</div>
															`;
															parent.appendChild(placeholder);
														}
													}}
												/>
											</div>
										</div>

										<!-- Right Side: Name + Quantity Input -->
										<div class="flex flex-1 flex-col justify-between">
											<!-- Name -->
											<h3 class="font-rajdhani mb-2 text-sm font-bold text-white">
												{wikeloStore.getText(ingredient.name)}
											</h3>

											<!-- Quantity Input with Label -->
											<div class="flex flex-col gap-1">
												<label
													for="quantity-{ingredient.id}"
													class="text-[10px] font-semibold tracking-wide text-cyan-400 uppercase"
												>
													{t.quantityOwned}
												</label>
												<input
													id="quantity-{ingredient.id}"
													type="number"
													value={quantity}
													oninput={(e) =>
														handleQuantityInput(
															ingredient.id,
															e.currentTarget.value,
															wikeloStore.getText(ingredient.name)
														)}
													min="0"
													class="font-orbitron w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2 py-2 text-center text-base font-bold text-white focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none"
												/>
											</div>
										</div>
									</div>

									<!-- Buttons Below -->
									<div class="grid grid-cols-4 gap-1.5 mt-2">
										<button
											onclick={() =>
												handleQuantityButton(
													ingredient.id,
													-5,
													wikeloStore.getText(ingredient.name)
												)}
											class="font-orbitron rounded-lg border border-red-500/50 bg-red-500/20 px-2 py-2.5 text-xs font-bold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/30"
										>
											-5
										</button>
										<button
											onclick={() =>
												handleQuantityButton(
													ingredient.id,
													-1,
													wikeloStore.getText(ingredient.name)
												)}
											class="font-orbitron rounded-lg border border-red-500/50 bg-red-500/20 px-2 py-2.5 text-xs font-bold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/30"
										>
											-1
										</button>
										<button
											onclick={() =>
												handleQuantityButton(
													ingredient.id,
													1,
													wikeloStore.getText(ingredient.name)
												)}
											class="font-orbitron rounded-lg border border-green-500/50 bg-green-500/20 px-2 py-2.5 text-xs font-bold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/30"
										>
											+1
										</button>
										<button
											onclick={() =>
												handleQuantityButton(
													ingredient.id,
													5,
													wikeloStore.getText(ingredient.name)
												)}
											class="font-orbitron rounded-lg border border-green-500/50 bg-green-500/20 px-2 py-2.5 text-xs font-bold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/30"
										>
											+5
										</button>
									</div>
								</div>

								<!-- DESKTOP LAYOUT -->
								<div class="relative hidden sm:block">
									<div class="flex gap-6">
										<!-- Image - Improved Style -->
										<div class="relative shrink-0">
											<!-- Glow effect -->
											<div
												class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-lg"
											></div>
											<!-- Image container with burned edges style -->
											<div
												class="relative h-32 w-32 overflow-hidden rounded-xl border-2 border-cyan-400/40 bg-gradient-to-br from-slate-800 to-slate-900 p-1 shadow-2xl shadow-cyan-400/30"
											>
												<img
													src={ingredient.image}
													alt={wikeloStore.getText(ingredient.name)}
													class="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
													onerror={(e) => {
														const img = e.currentTarget as HTMLImageElement;
														img.style.display = 'none';
														const parent = img.parentElement;
														if (parent && !parent.querySelector('.image-placeholder')) {
															const placeholder = document.createElement('div');
															placeholder.className =
																'image-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg';
															placeholder.innerHTML = `
																<div class="text-5xl mb-2 opacity-40">⚠</div>
																<div class="text-xs text-cyan-400/60 uppercase tracking-widest font-orbitron">Data Lost</div>
																<div class="text-[10px] text-red-400/40 uppercase tracking-wider font-orbitron mt-1">Signal Corrupt</div>
															`;
															parent.appendChild(placeholder);
														}
													}}
												/>
											</div>
										</div>

										<!-- Info & Controls -->
										<div class="flex flex-1 flex-col">
											<!-- Name -->
											<h3 class="font-rajdhani mb-1 text-lg font-bold text-white">
												{wikeloStore.getText(ingredient.name)}
											</h3>

											<!-- Current Quantity Display -->
											{#if quantity > 0}
												<div
													class="mb-3 inline-flex items-center gap-2 self-start rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1"
												>
													<span class="text-xs text-gray-400 uppercase">{t.quantity}:</span>
													<span class="font-orbitron text-lg font-bold text-cyan-400"
														>{quantity}</span
													>
												</div>
											{/if}

											<!-- Quantity Controls -->
											<div class="mt-auto flex flex-wrap items-center gap-2">
												<!-- Decrease buttons -->
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															-10,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-sm font-bold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/30"
												>
													-10
												</button>
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															-5,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-sm font-bold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/30"
												>
													-5
												</button>
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															-1,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-sm font-bold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/30"
												>
													-1
												</button>

												<!-- Manual input -->
												<input
													type="number"
													value={quantity}
													oninput={(e) =>
														handleQuantityInput(
															ingredient.id,
															e.currentTarget.value,
															wikeloStore.getText(ingredient.name)
														)}
													min="0"
													class="font-orbitron w-20 rounded-lg border border-cyan-500/30 bg-black/50 px-3 py-2 text-center text-sm font-bold text-white focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none"
												/>

												<!-- Increase buttons -->
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															1,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2 text-sm font-bold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/30"
												>
													+1
												</button>
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															5,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2 text-sm font-bold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/30"
												>
													+5
												</button>
												<button
													onclick={() =>
														handleQuantityButton(
															ingredient.id,
															10,
															wikeloStore.getText(ingredient.name)
														)}
													class="font-orbitron rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2 text-sm font-bold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/30"
												>
													+10
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		{/if}
	</main>

	<!-- SEO-Rich Content Section -->
	<article class="mt-12 rounded-xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
		<h2 class="mb-6 text-2xl font-bold text-white">
			{wikeloStore.currentLang === 'fr'
				? 'Gestionnaire d\'Inventaire Wikelo - Guide Complet'
				: 'Wikelo Inventory Manager - Complete Guide'}
		</h2>
		
		<div class="space-y-4 leading-relaxed text-gray-400">
			{#if wikeloStore.currentLang === 'fr'}
				<p>
					Le <strong class="text-cyan-400">Gestionnaire d'Inventaire Wikelo</strong> est l'outil gratuit le plus complet pour suivre vos ingrédients et matériaux de fabrication dans Star Citizen. Gérez efficacement plus de 60 ingrédients différents nécessaires pour débloquer les récompenses exclusives du marchand Banu Wikelo.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Fonctionnalités Principales</h3>
				<p>
					Notre système de gestion d'inventaire vous permet de suivre en temps réel vos <strong>Crocs de Valakkar</strong> (Juvénile, Adulte, Apex), <strong>Perles Valakkar Grade AAA</strong>, <strong>Marqueurs de Service de Guerre Tevarin</strong>, et tous les matériaux de minage comme la <strong>Carinite</strong>, le <strong>Jaclium</strong>, et le <strong>Saldynium</strong>. Ajustez rapidement les quantités avec les boutons +/- ou saisissez directement les valeurs.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Organisation et Filtres</h3>
				<p>
					Organisez votre inventaire par catégories : monnaies (<strong>MG Scrip</strong>, <strong>Council Scrip</strong>, <strong>Wikelo Favor</strong>), matériaux organiques, minerais, et composants spéciaux. Utilisez la recherche avancée et les filtres par rareté pour trouver rapidement ce dont vous avez besoin. Le système de favoris vous permet de marquer vos ingrédients les plus importants.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Synchronisation et Sauvegarde</h3>
				<p>
					Vos données sont automatiquement sauvegardées dans le cloud lorsque vous êtes connecté. Accédez à votre inventaire depuis n'importe quel appareil et ne perdez jamais vos données. L'interface multilingue (Français/Anglais) s'adapte à vos préférences.
				</p>
			{:else}
				<p>
					The <strong class="text-cyan-400">Wikelo Inventory Manager</strong> is the most comprehensive free tool for tracking your crafting ingredients and materials in Star Citizen. Efficiently manage over 60 different ingredients needed to unlock exclusive rewards from the Banu merchant Wikelo.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Key Features</h3>
				<p>
					Our inventory management system allows you to track in real-time your <strong>Valakkar Fangs</strong> (Juvenile, Adult, Apex), <strong>Valakkar Pearls Grade AAA</strong>, <strong>Tevarin War Service Markers</strong>, and all mining materials like <strong>Carinite</strong>, <strong>Jaclium</strong>, and <strong>Saldynium</strong>. Quickly adjust quantities with +/- buttons or enter values directly.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Organization and Filters</h3>
				<p>
					Organize your inventory by categories: currencies (<strong>MG Scrip</strong>, <strong>Council Scrip</strong>, <strong>Wikelo Favor</strong>), organic materials, ores, and special components. Use advanced search and rarity filters to quickly find what you need. The favorites system lets you mark your most important ingredients.
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">Synchronization and Backup</h3>
				<p>
					Your data is automatically saved to the cloud when you're logged in. Access your inventory from any device and never lose your data. The multilingual interface (French/English) adapts to your preferences.
				</p>
			{/if}
		</div>
	</article>

	<!-- Contact Info -->
	<ContactInfo />

	<!-- Footer -->
	<footer class="mt-12 rounded-xl border border-white/10 bg-slate-900/85 p-6 backdrop-blur-xl">
		<div class="mb-6 text-center">
			<p class="mb-2 text-gray-400">
				{wikeloStore.currentLang === 'fr'
					? 'Fait avec 💙 pour la communauté Star Citizen'
					: 'Made with 💙 for the Star Citizen community'}
			</p>
			<p class="text-sm text-gray-500 italic">
				{wikeloStore.currentLang === 'fr'
					? 'Non affilié à Cloud Imperium Games. Star Citizen® est une marque déposée de Cloud Imperium Rights LLC.'
					: 'Not affiliated with Cloud Imperium Games. Star Citizen® is a registered trademark of Cloud Imperium Rights LLC.'}
			</p>
		</div>

		<!-- Links Section -->
		<div class="mb-6 flex items-center justify-center gap-6">
			<a
				href="https://robertsspaceindustries.com"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{wikeloStore.currentLang === 'fr' ? 'Site RSI' : 'RSI Website'}
			</a>
			<a
				href="https://starcitizen.tools"
				target="_blank"
				class="cursor-pointer font-semibold text-cyan-400 transition-colors hover:text-yellow-400"
			>
				{wikeloStore.currentLang === 'fr' ? 'Wiki Officiel' : 'Official Wiki'}
			</a>
		</div>

		<!-- Data Sources Section -->
		<DataSources />
	</footer>

	<!-- Login Required Dialog -->
	<LoginRequiredDialog bind:show={showLoginDialog} onClose={() => (showLoginDialog = false)} />
</div>
