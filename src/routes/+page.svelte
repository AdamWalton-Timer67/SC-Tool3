<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/styles/wikelo.css';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import DataSources from '$lib/components/wikelo/DataSources.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { captureEvent } from '$lib/analytics';

	let mounted = $state(false);
	let patchNotes = $state<any>(null);

	// Set default language to English on mount
	onMount(async () => {
		mounted = true;
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

	const currentLang = $derived(wikeloStore.currentLang);

	const t = $derived(
		currentLang === 'fr'
			? {
					subtitle: 'Star citizen • Outils communautaires • Secteur Stanton',
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
						title: 'Wikelo My Inventory',
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
					subtitle: 'Star citizen • Community Tools • Stanton Sector',
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
						title: 'Wikelo My Inventory',
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

	const content = $derived(
		currentLang === 'fr'
			? {
					title: "Suite Complète d'Outils Star Citizen Wikelo Emporium",
					intro:
						"Bienvenue sur la collection d'outils gratuits la plus complète pour suivre les <strong>récompenses Wikelo Emporium</strong>. Notre suite comprend un <strong>tracker de récompenses</strong> complet, une <strong>base de données d'ingrédients</strong> et un <strong>gestionnaire d'inventaire</strong> conçus spécifiquement pour les missions du marchand Banu Wikelo.",
					rewardsTitle: 'Tracker de Récompenses Wikelo Emporium',
					rewardsText:
						"Suivez plus de 30 récompenses exclusives du <strong>marchand Banu Wikelo</strong> incluant des ensembles d'armures légendaires comme la <strong>Combinaison Xanthule Ascension</strong>, la <strong>Combinaison d'Exploration Novikov Ascension</strong>, l'<strong>Armure Geist Camo Neige</strong>, les variantes d'<strong>Armure DCP</strong> (Camo Jungle, Camo Chasseur, Camo Cobalt), l'<strong>Ensemble d'Armure Ana Endro</strong>, l'<strong>Armure Bokto Luminescente</strong>, l'<strong>Ensemble Corbel Crush</strong> et l'<strong>Armure Palatino Mark I</strong>.",
					ingredientsTitle: 'Base de Données Complète des Ingrédients',
					ingredientsText:
						'Accédez aux informations détaillées pour tous les matériaux de fabrication et monnaies incluant les <strong>Crocs de Valakkar</strong> (Juvénile, Adulte, Apex), les <strong>Perles Valakkar Grade AAA</strong>, les <strong>Marqueurs de Service de Guerre Tevarin</strong>, les <strong>Disques Sécurisés ASD</strong>, <strong>MG Scrip</strong>, <strong>Council Scrip</strong>, <strong>Wikelo Favor</strong>, matériaux de minage (<strong>Carinite</strong>, <strong>Jaclium</strong>, <strong>Saldynium</strong>, <strong>Quantanium</strong>, <strong>Cuivre</strong>, <strong>Tungstène</strong>, <strong>Corindon</strong>), matériaux organiques et composants spéciaux.',
					featuresTitle: 'Fonctionnalités & Avantages',
					features: [
						'<strong>Suivi de progression en temps réel</strong> pour toutes les missions Wikelo Emporium',
						'<strong>Sauvegarde automatique locale</strong> pour protéger vos données et votre vie privée',
						'<strong>Support multilingue</strong> (Anglais/Français)',
						'<strong>Filtrage avancé</strong> par rareté (Commun, Inhabituel, Rare, Épique, Légendaire)',
						"<strong>Gestion d'inventaire</strong> avec ajustements rapides des quantités +/-",
						"<strong>Informations détaillées sur les ingrédients</strong> avec emplacements et guides d'obtention",
						"<strong>Fonctionnalité de recherche</strong> pour trouver rapidement n'importe quelle récompense ou ingrédient",
						"<strong>Interface spatiale magnifique</strong> inspirée de l'esthétique Star Citizen et Banu"
					],
					locationsTitle: 'Emplacements Wikelo Emporium',
					locationsText:
						'Trouvez les Wikelo Emporiums à trois emplacements dans le système Stanton : <strong>Wikelo Emporium Dasi</strong> (orbite de Hurston), <strong>Wikelo Emporium Kinga</strong> (orbite de microTech) et <strong>Wikelo Emporium Selo</strong> (orbite de Yela). Chaque emplacement offre les mêmes récompenses, mais suivre votre progression vous aide à planifier vos routes de farming efficacement.',
					footer:
						"Cette collection d'outils a été créée par et pour la <strong>communauté Star Citizen</strong>. Tous les outils sont entièrement gratuits sans publicités ni fonctionnalités premium. Vos données sont sauvegardées localement dans votre navigateur pour garantir la confidentialité. Les futures mises à jour incluront la synchronisation cloud sur plusieurs appareils."
				}
			: {
					title: 'Complete Star Citizen Wikelo Emporium Tools Suite',
					intro:
						"Welcome to the most comprehensive free <strong>Star Citizen Wikelo Tools collection</strong> for tracking <strong>Wikelo Emporium rewards</strong>. Our suite includes a complete <strong>rewards tracker</strong>, <strong>ingredient database</strong>, and <strong>inventory manager</strong> designed specifically for the Banu merchant Wikelo's missions.",
					rewardsTitle: 'Wikelo Emporium Rewards Tracker',
					rewardsText:
						'Track over 60+ exclusive rewards from the <strong>Banu merchant Wikelo</strong> including legendary armor sets like <strong>Xanthule Ascension Suit</strong>, <strong>Novikov Ascension Exploration Suit</strong>, <strong>Geist Snow Camo Armor Set</strong>, <strong>DCP Armor</strong> variants (Jungle Camo, Hunter Camo, Cobalt Camo), <strong>Ana Armor Endro Set</strong>, <strong>Bokto Glowing Armor</strong>, <strong>Corbel Crush Set</strong>, and <strong>Palatino Mark I Armor</strong>.',
					ingredientsTitle: 'Complete Ingredient Database',
					ingredientsText:
						'Access detailed information for all crafting materials and currencies including <strong>Valakkar Fangs</strong> (Juvenile, Adult, Apex), <strong>Valakkar Pearls Grade AAA</strong>, <strong>Tevarin War Service Markers</strong>, <strong>ASD Secure Drives</strong>, <strong>MG Scrip</strong>, <strong>Council Scrip</strong>, <strong>Wikelo Favor</strong>, mining materials (<strong>Carinite</strong>, <strong>Jaclium</strong>, <strong>Saldynium</strong>, <strong>Quantanium</strong>, <strong>Copper</strong>, <strong>Tungsten</strong>, <strong>Corundum</strong>), organic materials, and special components.',
					featuresTitle: 'Features & Benefits',
					features: [
						'<strong>Real-time progression tracking</strong> for all Wikelo Emporium missions',
						'<strong>Automatic local save</strong> to protect your data and privacy',
						'<strong>Multi-language support</strong> (English/French)',
						'<strong>Advanced filtering</strong> by rarity (Common, Uncommon, Rare, Epic, Legendary)',
						'<strong>Inventory management</strong> with quick +/- quantity adjustments',
						'<strong>Detailed ingredient information</strong> with locations and how-to-obtain guides',
						'<strong>Search functionality</strong> to quickly find any reward or ingredient',
						'<strong>Beautiful space-themed UI</strong> inspired by Star Citizen and Banu aesthetics'
					],
					locationsTitle: 'Wikelo Emporium Locations',
					locationsText:
						'Find Wikelo Emporiums at three locations in the Stanton system: <strong>Wikelo Emporium Dasi</strong> (Hurston orbit), <strong>Wikelo Emporium Kinga</strong> (microTech orbit), and <strong>Wikelo Emporium Selo</strong> (Yela orbit). Each location offers the same rewards but tracking your progression helps you plan your farming routes efficiently.',
					footer:
						'This tool collection was created by and for the <strong>Star Citizen community</strong>. All tools are completely free with no ads or premium features. Your data is saved locally in your browser to ensure privacy. Future updates will include cloud synchronization across multiple devices.'
				}
	);
</script>

<svelte:head>
	<title>Wikelo Tools - Star Citizen Tracker & Database</title>
	<meta
		name="description"
		content="Free Wikelo Emporium tracker for Star Citizen. Track 60+ rewards, manage ingredients, and organize your inventory. Updated for 4.5"
	/>
	<meta
		name="keywords"
		content="Star Citizen Wikelo Tools, Wikelo Emporium tracker, Star Citizen rewards, Star Citizen database, Star Citizen inventory manager, Banu merchant Wikelo, Star Citizen armor tracker, Star Citizen weapons database, Star Citizen crafting guide, Xanthule Ascension Suit, Novikov Armor, Geist Snow Camo, DCP Armor, Valakkar Fang, MG Scrip, Wikelo Favor, Star Citizen ingredients, Star Citizen missions tracker, free Star Citizen Wikelo Tools"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.star-citizen-wikelo-tools.space/" />
	<meta
		property="og:title"
		content="Star Citizen Wikelo Tools - Wikelo Emporium Tracker & Database"
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
	<meta name="twitter:title" content="Star Citizen Wikelo Tools - Wikelo Emporium Tracker" />
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
			"name": "Star Citizen Wikelo Tools",
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
						Wikelo Tools
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
		<!-- Temporary Alpha 4.5 Notice -->
		<div class="mb-8 overflow-hidden rounded-xl border border-orange-400/50 bg-linear-to-r from-orange-900/30 via-yellow-900/30 to-orange-900/30 backdrop-blur-xl">
			<div class="relative border-b border-orange-400/30 bg-orange-800/20 px-6 py-3">
				<div class="absolute top-0 right-0 left-0 h-0.5 animate-pulse bg-linear-to-r from-transparent via-orange-400 to-transparent"></div>
				<div class="flex items-center gap-3">
					<span class="text-2xl">⚠️</span>
					<h3 class="font-orbitron text-lg font-bold tracking-wider text-orange-400 uppercase">
						{currentLang === 'fr' ? 'Mise à jour importante à venir' : 'Important Update Coming'}
					</h3>
				</div>
			</div>
			<div class="p-6">
				<p class="text-gray-300 leading-relaxed">
					{#if currentLang === 'fr'}
						<strong class="text-orange-400">Star Citizen Alpha 4.5</strong> arrive bientôt avec des changements majeurs au système Wikelo Emporium.
						De nouvelles récompenses, ingrédients et mécaniques de jeu seront ajoutées.
						Nous mettrons à jour les outils dès que possible après la sortie du patch.
						Merci de votre patience ! 🚀
					{:else}
						<strong class="text-orange-400">Star Citizen Alpha 4.5</strong> is coming soon with major changes to the Wikelo Emporium system.
						New rewards, ingredients, and game mechanics will be added.
						We will update the tools as soon as possible after the patch release.
						Thank you for your patience! 🚀
					{/if}
				</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2 3xl:grid-cols-3">
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
								<li class="flex items-start gap-3 mb-4 mt-4">
									<div class="flex flex-col gap-2 w-full">
										<div class="flex items-center gap-2">
											<span class="rounded-full bg-yellow-500/20 border border-yellow-500/50 px-2 py-0.5 text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Important</span>
											<div class="h-px flex-1 bg-linear-to-r from-yellow-400/50 to-transparent"></div>
										</div>
										<h3 class="font-orbitron text-lg font-bold text-yellow-400 tracking-wide">
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

		<!-- SEO-Rich Info Section -->
		<article class="mt-8 rounded-xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold text-white">{content.title}</h2>
			</div>
			<div class="space-y-4 leading-relaxed text-gray-400">
				<p>
					{@html content.intro}
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">{content.rewardsTitle}</h3>
				<p>
					{@html content.rewardsText}
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">{content.ingredientsTitle}</h3>
				<p>
					{@html content.ingredientsText}
				</p>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">{content.featuresTitle}</h3>
				<ul class="list-inside list-disc space-y-2 text-gray-400">
					{#each content.features as feature}
						<li>{@html feature}</li>
					{/each}
				</ul>

				<h3 class="mt-6 mb-3 text-lg font-bold text-cyan-400">{content.locationsTitle}</h3>
				<p>
					{@html content.locationsText}
				</p>

				<p class="mt-6">
					{@html content.footer}
				</p>
			</div>
			<p class="mt-4 text-sm text-gray-500 italic">
				{t.footer.disclaimer}
			</p>
		</article>
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
