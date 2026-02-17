<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	import ContributeHelp from './ContributeHelp.svelte';
	import SuggestionDialog from '$lib/components/SuggestionDialog.svelte';
	import { captureEvent } from '$lib/analytics';

	const ingredient = $derived(wikeloStore.selectedIngredient);
	const isOpen = $derived(ingredient !== null);
	const getText = (obj: { en?: string; fr?: string } | undefined | null) =>
		wikeloStore.getText(obj);

	let isSuggestionDialogOpen = $state(false);

	// Check if ingredient has unknown/missing information
	const hasUnknownInfo = $derived(
		ingredient !== null &&
			((ingredient.howToObtain &&
				getText(ingredient.howToObtain).toLowerCase().includes('unknown')) ||
				(ingredient.locations &&
					(ingredient.locations.en.some((loc) => {
						const locStr = typeof loc === 'string' ? loc : String(loc);
						return locStr.toLowerCase().includes('unknown');
					}) ||
						ingredient.locations.fr.some((loc) => {
							const locStr = typeof loc === 'string' ? loc : String(loc);
							return locStr.toLowerCase().includes('unknown');
						}))))
	);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					close: 'Fermer',
					closeLabel: 'Fermer',
					description: 'Description',
					howToObtain: 'Comment Obtenir',
					locations: "Point d'Intérêt",
					locationDetails: "Voir les détails du point d'intérêt",
					imageCredit: 'Crédits image:',
					documentation: 'Documentation',
					market: 'Marché',
					suggest: 'Suggérer une amélioration'
				}
			: {
					close: 'Close',
					closeLabel: 'Close',
					description: 'Description',
					howToObtain: 'How to Obtain',
					locations: 'Point of Interest',
					locationDetails: 'View point of interest details',
					imageCredit: 'Image credits:',
					documentation: 'Documentation',
					market: 'Market',
					suggest: 'Suggest an improvement'
				}
	);

	// Favorite logic
	const isFavorite = $derived(ingredient ? wikeloStore.isFavoriteIngredient(ingredient.id) : false);

	async function handleToggleFavorite() {
		if (!ingredient) return;
		// Authentication check is handled inside store but we can add UI feedback if needed
		if (!wikeloStore.currentUser) {
			// Trigger logic to show login dialog? Or assume store handles it?
			// The store method requires currentUser.
			// Let's just try, if not logged in nothing happens (or we should trigger login dialog)
			// But we don't have access to login dialog state here easily unless we pass it or emit event.
			// Ideally we should show toast or something.
			// For now, let's just call it.
		}
		await wikeloStore.toggleFavoriteIngredient(ingredient.id);
		captureEvent('wikelo_ingredient_favorite_toggled', {
			ingredientId: ingredient.id,
			ingredientName: getText(ingredient.name),
			isFavorite: !isFavorite
		});
	}

	const rarityColors: Record<string, string> = {
		legendary: 'from-purple-500 via-pink-500 to-yellow-500',
		epic: 'from-purple-600 to-blue-500',
		rare: 'from-blue-500 to-cyan-400',
		uncommon: 'from-emerald-500 to-green-600',
		common: 'from-gray-500 to-gray-400'
	};

	function handleClose() {
		wikeloStore.closeIngredientDialog();
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if isOpen && ingredient}
	<div
		class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={handleOverlayClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-800 shadow-2xl"
		>
			<!-- Close button -->
			<button
				onclick={handleClose}
				class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10 sm:top-4 sm:right-4 sm:h-10 sm:w-10"
				aria-label={t.closeLabel}
			>
				<span class="text-xl text-white sm:text-2xl">×</span>
			</button>

			<!-- Content -->
			<div class="p-4 sm:p-6 md:p-8">
				<!-- Header: Image + Title + Rarity -->
				<div class="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:gap-6">
					<!-- Image with glitch effect -->
					<div class="flex shrink-0 justify-center sm:justify-start">
						<div class="group relative">
							<!-- Glitch layers (hover only) -->
							<div
								class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div class="animate-glitch-1 absolute inset-0 bg-cyan-400/20 blur-sm"></div>
								<div class="animate-glitch-2 absolute inset-0 bg-purple-500/20 blur-sm"></div>
							</div>

							<!-- Base shadow layers (always visible) -->
							<div class="absolute inset-0 bg-cyan-400/10 blur-md"></div>
							<div class="absolute inset-0 bg-purple-500/5 blur-lg"></div>

							<!-- Image avec bordure glitch irrégulière -->
							<div
								class="animate-glitch-border relative rounded-lg border-2 border-cyan-400/30 p-1.5 shadow-md shadow-cyan-400/20 transition-all duration-300 group-hover:border-cyan-400/70 group-hover:shadow-lg group-hover:shadow-cyan-400/40 sm:p-2"
							>
								<ImageWithFallback
									src={ingredient.image}
									alt={getText(ingredient.name)}
									itemName={getText(ingredient.name)}
									class="relative z-10 h-24 w-24 rounded-lg object-contain sm:h-32 sm:w-32 md:h-40 md:w-40"
								/>
							</div>
						</div>
					</div>

					<!-- Title + Rarity Badge -->
					<div class="flex min-w-0 flex-1 flex-col justify-center">
						<!-- Title -->
						<div class="flex items-center justify-center gap-3 sm:justify-start">
							<h2
								class="font-orbitron text-xl font-bold tracking-wide break-words text-yellow-400 uppercase sm:text-2xl md:text-3xl"
							>
								{getText(ingredient.name)}
							</h2>
							<button
								onclick={() => handleToggleFavorite()}
								class="group/fav rounded-full bg-slate-900/50 p-2 backdrop-blur-sm transition-all hover:bg-pink-500/10 hover:scale-110"
								title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
							>
								<span
									class="text-xl transition-transform duration-300 group-hover/fav:scale-125 {isFavorite
										? 'text-pink-500'
										: 'text-gray-400 group-hover/fav:text-pink-400'}"
								>
									{isFavorite ? '❤️' : '🤍'}
								</span>
							</button>
						</div>

						<!-- Rarity Badge -->
						<div class="flex justify-center sm:justify-start">
							<span
								class="rounded-full bg-linear-to-r px-3 py-1.5 text-xs font-bold tracking-wider uppercase sm:px-4 sm:py-2 sm:text-sm {rarityColors[
									ingredient.rarity
								] || rarityColors.common} text-white shadow-lg"
							>
								{ingredient.rarity}
							</span>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div class="mb-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:mb-4 sm:p-4">
					<h3
						class="font-orbitron mb-1.5 text-xs font-bold tracking-wider text-cyan-400 uppercase sm:mb-2 sm:text-sm"
					>
						📝 {t.description}
					</h3>
					<p class="text-sm leading-relaxed text-gray-300 sm:text-base">
						{getText(ingredient.description)}
					</p>
				</div>

				<!-- How to Obtain -->
				<div class="mb-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:mb-4 sm:p-4">
					<h3
						class="font-orbitron mb-1.5 text-xs font-bold tracking-wider text-cyan-400 uppercase sm:mb-2 sm:text-sm"
					>
						🎯 {t.howToObtain}
					</h3>
					<p class="text-sm leading-relaxed text-gray-300 sm:text-base">
						{getText(ingredient.howToObtain)}
					</p>
				</div>

				<!-- Contribute Help (when unknown info) -->
				{#if hasUnknownInfo}
					<div class="mb-3 sm:mb-4">
						<ContributeHelp />
					</div>
				{/if}

				<!-- Location Link (priority - if structured location exists) -->
				{#if ingredient.location_slug}
					<div
						class="mb-3 rounded-lg border-2 border-blue-500/30 bg-blue-500/10 p-3 sm:mb-4 sm:p-4"
					>
						<h3
							class="font-orbitron mb-2 text-xs font-bold tracking-wider text-blue-400 uppercase sm:mb-3 sm:text-sm"
						>
							🗺️ {t.locations}
						</h3>
						<a
							href="/locations/{ingredient.location_slug}"
							class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-400/20 sm:text-base"
						>
							<span>📍</span>
							<span
								>{wikeloStore.currentLang === 'fr'
									? ingredient.location_name_fr
									: ingredient.location_name_en}</span
							>
							<span>→</span>
						</a>
						<p class="mt-2 text-xs text-gray-400">
							{t.locationDetails}
						</p>
					</div>
				{/if}

				<!-- Locations (fallback - textual locations) -->
				{#if ingredient.locations && !ingredient.location_slug}
					<div class="mb-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:mb-4 sm:p-4">
						<h3
							class="font-orbitron mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase sm:mb-3 sm:text-sm"
						>
							📍 {t.locations}
						</h3>
						<ul class="space-y-1.5 sm:space-y-2">
							{#each wikeloStore.currentLang === 'fr' ? ingredient.locations.fr : ingredient.locations.en as location}
								<li class="flex items-start gap-2 text-sm text-gray-300 sm:text-base">
									<span class="mt-0.5 text-sm text-yellow-400 sm:mt-1 sm:text-base">▸</span>
									<span>{typeof location === 'string' ? location : String(location)}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Links (if available) -->
				{#if ingredient.links && (ingredient.links.documentation || ingredient.links.market)}
					<div class="mt-3 space-y-3 sm:mt-4">
						<!-- Documentation Links -->
						{#if ingredient.links.documentation && Object.keys(ingredient.links.documentation).length > 0}
							<div class="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
								<h3
									class="font-orbitron mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase sm:mb-3 sm:text-sm"
								>
									📚 {t.documentation}
								</h3>
								<div class="flex flex-wrap gap-2">
									{#if ingredient.links.documentation.starcitizen_tools}
										<a
											href={ingredient.links.documentation.starcitizen_tools}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-400/20 sm:text-sm"
										>
											<span>🛠️</span>
											<span>Star Citizen Tools</span>
											<span class="text-[10px]">↗</span>
										</a>
									{/if}
									{#if ingredient.links.documentation.cstone_finder}
										<a
											href={ingredient.links.documentation.cstone_finder}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 rounded-lg border border-purple-400/30 bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:border-purple-400/50 hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-400/20 sm:text-sm"
										>
											<span>🔍</span>
											<span>CStone Finder</span>
											<span class="text-[10px]">↗</span>
										</a>
									{/if}
								</div>
							</div>
						{/if}

						<!-- Market Links -->
						{#if ingredient.links.market && Object.keys(ingredient.links.market).length > 0}
							<div class="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
								<h3
									class="font-orbitron mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase sm:mb-3 sm:text-sm"
								>
									💰 {t.market}
								</h3>
								<div class="flex flex-wrap gap-2">
									{#if ingredient.links.market.uexcorp}
										<a
											href={ingredient.links.market.uexcorp}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 transition-all hover:border-yellow-400/50 hover:bg-yellow-500/30 hover:shadow-lg hover:shadow-yellow-400/20 sm:text-sm"
										>
											<span>🏪</span>
											<span>UEX Corp</span>
											<span class="text-[10px]">↗</span>
										</a>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Credits (if available) -->
				{#if ingredient.credit}
					<div class="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-2 sm:mt-4 sm:p-3">
						<p class="text-[10px] leading-relaxed text-gray-500 sm:text-xs">
							<span class="text-gray-400">📷 {t.imageCredit} </span>
							{ingredient.credit}
						</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="mt-4 flex flex-col justify-center gap-3 sm:mt-6 sm:flex-row">
					<button
						onclick={() => (isSuggestionDialogOpen = true)}
						class="rounded-lg border border-cyan-400/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:border-cyan-400/50 hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
					>
						💡 {t.suggest}
					</button>
					<button
						onclick={handleClose}
						class="rounded-lg bg-linear-to-r from-cyan-400 to-purple-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cyan-400/50 sm:px-6 sm:py-3 sm:text-base"
					>
						{t.close}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Suggestion Dialog -->
{#if ingredient}
	<SuggestionDialog
		bind:isOpen={isSuggestionDialogOpen}
		itemType="ingredient"
		itemId={ingredient.id}
		itemName={getText(ingredient.name)}
		lang={wikeloStore.currentLang}
		onClose={() => (isSuggestionDialogOpen = false)}
	/>
{/if}

<style>
	.animate-fade-in {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Custom Scrollbar - Banu Style */
	.max-h-\[90vh\]::-webkit-scrollbar {
		width: 12px;
	}

	.max-h-\[90vh\]::-webkit-scrollbar-track {
		background: rgba(15, 23, 42, 0.8);
		border-radius: 10px;
		border: 1px solid rgba(34, 211, 238, 0.1);
	}

	.max-h-\[90vh\]::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, rgba(34, 211, 238, 0.6), rgba(168, 85, 247, 0.6));
		border-radius: 10px;
		border: 2px solid rgba(15, 23, 42, 0.5);
		box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
	}

	.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, rgba(34, 211, 238, 0.8), rgba(168, 85, 247, 0.8));
		box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
	}

	/* Firefox */
	.max-h-\[90vh\] {
		scrollbar-width: thin;
		scrollbar-color: rgba(34, 211, 238, 0.6) rgba(15, 23, 42, 0.8);
	}
</style>
