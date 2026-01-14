<script lang="ts">
	import type { OrganizationInventoryItem } from '$lib/types/organizations';
	import type { Ingredient } from '$lib/stores/wikelo.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { getCategoryIcon, getCategoryTranslation } from '$lib/utils/categories';
	import IngredientDetailsModal from './IngredientDetailsModal.svelte';
	import IngredientImage from '$lib/components/IngredientImage.svelte';

	type InventoryItemWithDetails = OrganizationInventoryItem & { ingredient: Ingredient };

	interface Props {
		inventory: OrganizationInventoryItem[];
	}

	let { inventory }: Props = $props();

	let selectedIngredient = $state<Ingredient | null>(null);
	let showModal = $state(false);

	function handleIngredientClick(ingredient: Ingredient) {
		selectedIngredient = ingredient;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedIngredient = null;
	}

	// Group ingredients by category
	const groupedInventory = $derived.by(() => {
		if (!inventory || inventory.length === 0) {
			return [];
		}

		// Get ingredient details from wikeloStore
		const inventoryWithDetails = inventory
			.map((item) => {
				const ingredient = wikeloStore.ingredients.find((ing) => ing.id === item.ingredient_id);
				return ingredient
					? {
							...item,
							ingredient
						}
					: null;
			})
			.filter((item): item is InventoryItemWithDetails => item !== null);

		// Group by category
		const groups = new Map<string, typeof inventoryWithDetails>();

		inventoryWithDetails.forEach((item) => {
			const category = item.ingredient.category;
			if (!groups.has(category)) {
				groups.set(category, []);
			}
			groups.get(category)!.push(item);
		});

		// Convert to array and sort items within each group
		return Array.from(groups.entries()).map(([category, items]) => ({
			category,
			items: items.sort((a, b) =>
				wikeloStore.getText(a.ingredient.name).localeCompare(wikeloStore.getText(b.ingredient.name))
			)
		}));
	});

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Inventaire de l\'Organisation',
					noInventory: 'Aucun inventaire',
					noInventoryMessage: 'Cette organisation n\'a pas encore d\'inventaire',
					totalQuantity: 'Quantité totale'
				}
			: {
					title: 'Organization Inventory',
					noInventory: 'No inventory',
					noInventoryMessage: 'This organization doesn\'t have any inventory yet',
					totalQuantity: 'Total quantity'
				}
	);

	// Total items
	const totalItems = $derived(inventory.reduce((sum, item) => sum + item.total_quantity, 0));
	const uniqueItems = $derived(inventory.length);
</script>

<!-- Inventory Section -->
<div>
	<!-- Section Header -->
	<div class="mb-8 flex items-center gap-3">
		<div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
		<h2
			class="font-orbitron text-3xl font-bold text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
		>
			<span class="inline-flex items-center gap-2">
				<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					/>
				</svg>
				{t.title}
				<span
					class="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-bold text-purple-400 ring-1 ring-purple-500/50"
				>
					{uniqueItems}
				</span>
			</span>
		</h2>
		<div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
	</div>

	<!-- Stats -->
	{#if inventory.length > 0}
		<div class="mb-6 flex justify-center gap-4">
			<div
				class="flex min-w-[120px] flex-col items-center rounded-lg border border-purple-500/30 bg-slate-900/50 px-6 py-4 backdrop-blur-sm"
			>
				<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">Total Items</span>
				<span class="font-orbitron text-3xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
					>{totalItems}</span
				>
			</div>

			<div
				class="flex min-w-[120px] flex-col items-center rounded-lg border border-cyan-500/30 bg-slate-900/50 px-6 py-4 backdrop-blur-sm"
			>
				<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase">Unique Types</span>
				<span class="font-orbitron text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
					>{uniqueItems}</span
				>
			</div>
		</div>
	{/if}

	<!-- Inventory Grid -->
	{#if groupedInventory.length === 0}
		<div
			class="rounded-xl border border-purple-500/20 bg-slate-900/50 py-12 text-center backdrop-blur-sm"
		>
			<p class="mb-2 text-6xl">📦</p>
			<p class="text-xl font-semibold text-gray-400">{t.noInventory}</p>
			<p class="mt-2 text-sm text-gray-500">{t.noInventoryMessage}</p>
		</div>
	{:else}
		{#each groupedInventory as group}
			<section class="mb-10">
				<!-- Category Title -->
				<div class="mb-4 flex items-center gap-3">
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
					<h3 class="font-orbitron flex items-center gap-2 text-xl font-bold tracking-wider text-purple-400 uppercase">
						<span class="text-xl">{getCategoryIcon(group.category)}</span>
						{getCategoryTranslation(group.category, wikeloStore.currentLang)}
						<span class="font-rajdhani text-sm text-gray-500 normal-case">({group.items.length})</span>
					</h3>
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
				</div>

				<!-- Items Grid -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
					{#each group.items as item}
						<button
							type="button"
							onclick={() => handleIngredientClick(item.ingredient)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleIngredientClick(item.ingredient);
								}
							}}
							class="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 p-4 text-left backdrop-blur-xl transition-all hover:border-purple-500/50 hover:cursor-pointer hover:scale-[1.02]"
						>
							<!-- Hover effect -->
							<div
								class="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-cyan-500/5 to-purple-400/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>

							<div class="relative flex gap-4">
								<!-- Image -->
								<div class="relative shrink-0">
									<!-- Glow effect -->
									<div
										class="absolute inset-0 rounded-xl bg-linear-to-br from-purple-400/20 to-cyan-500/20 blur-md"
									></div>
									<!-- Image container -->
									<IngredientImage
										src={item.ingredient.image}
										alt={wikeloStore.getText(item.ingredient.name)}
										size="md"
									/>
								</div>

								<!-- Info -->
								<div class="flex flex-1 flex-col justify-between">
									<!-- Name -->
									<h4 class="font-rajdhani mb-2 text-base font-bold text-white">
										{wikeloStore.getText(item.ingredient.name)}
									</h4>

									<!-- Quantity Badge -->
									<div
										class="inline-flex items-center gap-2 self-start rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1"
									>
										<span class="text-xs text-gray-400 uppercase">{t.totalQuantity}:</span>
										<span class="font-orbitron text-lg font-bold text-purple-400"
											>{item.total_quantity}</span
										>
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>
		{/each}
	{/if}
</div>

<!-- Ingredient Details Modal -->
{#if organizationsStore.currentOrganization}
	<IngredientDetailsModal
		bind:isOpen={showModal}
		ingredient={selectedIngredient}
		organizationId={organizationsStore.currentOrganization.id}
		onClose={closeModal}
	/>
{/if}
