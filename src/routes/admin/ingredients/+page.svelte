<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	// Filters
	const categories = [
		{ value: 'all', label: 'All Categories', icon: '📦' },
		{ value: 'mining', label: 'Mining', icon: '⛏️' },
		{ value: 'currency', label: 'Currency', icon: '💎' },
		{ value: 'organic', label: 'Organic', icon: '🌿' },
		{ value: 'weapon', label: 'Weapon', icon: '⚔️' },
		{ value: 'armor', label: 'Armor', icon: '🛡️' },
		{ value: 'special', label: 'Special', icon: '✨' }
	];

	const rarities = [
		{ value: 'all', label: 'All Rarities' },
		{ value: 'common', label: 'Common', color: 'gray' },
		{ value: 'uncommon', label: 'Uncommon', color: 'green' },
		{ value: 'rare', label: 'Rare', color: 'blue' },
		{ value: 'epic', label: 'Epic', color: 'purple' },
		{ value: 'legendary', label: 'Legendary', color: 'yellow' }
	];

	let searchInput = $state(data.filters?.search || '');
	let deleteConfirm = $state<string | null>(null);

	function applyFilters(category: string, rarity: string, search: string) {
		const params = new URLSearchParams();
		if (category !== 'all') params.set('category', category);
		if (rarity !== 'all') params.set('rarity', rarity);
		if (search) params.set('search', search);
		goto(`/admin/ingredients?${params.toString()}`);
	}

	function handleCategoryChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		applyFilters(target.value, data.filters?.rarity || 'all', searchInput);
	}

	function handleRarityChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		applyFilters(data.filters?.category || 'all', target.value, searchInput);
	}

	function handleSearch() {
		applyFilters(data.filters?.category || 'all', data.filters?.rarity || 'all', searchInput);
	}

	async function deleteIngredient(id: string) {
		if (deleteConfirm !== id) {
			deleteConfirm = id;
			setTimeout(() => (deleteConfirm = null), 3000);
			return;
		}

		try {
			const response = await fetch(`/api/admin/ingredients/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				goto('/admin/ingredients', { invalidateAll: true });
			} else {
				alert('Error deleting ingredient');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error deleting ingredient');
		}
	}

	function getRarityColor(rarity: string): string {
		const colors: Record<string, string> = {
			common: 'from-gray-500 to-gray-400',
			uncommon: 'from-emerald-500 to-green-600',
			rare: 'from-blue-500 to-cyan-400',
			epic: 'from-purple-600 to-blue-500',
			legendary: 'from-purple-500 via-pink-500 to-yellow-500'
		};
		return colors[rarity] || colors.common;
	}

	function getCategoryIcon(category: string): string {
		const icons: Record<string, string> = {
			mining: '⛏️',
			currency: '💎',
			organic: '🌿',
			weapon: '⚔️',
			armor: '🛡️',
			special: '✨'
		};
		return icons[category] || '📦';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🧪</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
				>
					Ingredients Management
				</h2>
			</div>
			<p class="text-sm text-cyan-300/60">
				{data.ingredients.length} ingredient{data.ingredients.length !== 1 ? 's' : ''} found
			</p>
		</div>
		<a
			href="/admin/ingredients/new"
			class="font-orbitron flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-all hover:scale-105 hover:from-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50 sm:px-6"
		>
			<span class="text-xl">➕</span>
			<span>Add New Ingredient</span>
		</a>
	</div>

	<div class="h-px bg-linear-to-r from-cyan-400/50 via-purple-400/50 to-transparent"></div>

	<!-- Filters -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<!-- Category Filter -->
		<div>
			<label
				for="category"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
			>
				Category
			</label>
			<select
				id="category"
				value={data.filters?.category || 'all'}
				onchange={handleCategoryChange}
				class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
			>
				{#each categories as cat}
					<option value={cat.value}>{cat.icon} {cat.label}</option>
				{/each}
			</select>
		</div>

		<!-- Rarity Filter -->
		<div>
			<label
				for="rarity"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
			>
				Rarity
			</label>
			<select
				id="rarity"
				value={data.filters?.rarity || 'all'}
				onchange={handleRarityChange}
				class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
			>
				{#each rarities as rar}
					<option value={rar.value}>{rar.label}</option>
				{/each}
			</select>
		</div>

		<!-- Search -->
		<div>
			<label
				for="search"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
			>
				Search
			</label>
			<div class="flex gap-2">
				<input
					id="search"
					type="text"
					bind:value={searchInput}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Search by name..."
					class="font-rajdhani flex-1 rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
				/>
				<button
					onclick={handleSearch}
					class="rounded-lg border-2 border-cyan-500/30 bg-cyan-500/20 px-4 py-3 text-cyan-300 transition-all hover:scale-105 hover:border-cyan-500/60 hover:bg-cyan-500/30"
				>
					🔍
				</button>
			</div>
		</div>
	</div>

	<!-- Ingredients Grid -->
	{#if data.ingredients.length === 0}
		<div class="rounded-xl border-2 border-cyan-500/20 bg-cyan-500/5 p-12 text-center">
			<div class="mb-4 text-6xl opacity-50">🔍</div>
			<p class="font-orbitron text-lg text-cyan-300/60">No ingredients found</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each data.ingredients as ingredient}
				<div
					class="group rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-4 backdrop-blur-sm transition-all hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/30"
				>
					<div class="flex gap-4">
						<!-- Image -->
						<div class="relative flex-shrink-0">
							<div
								class="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-md"
							></div>
							{#if ingredient.image_url}
								<img
									src={ingredient.image_url}
									alt={ingredient.name_en}
									class="relative h-24 w-24 rounded-lg border-2 border-cyan-500/30 bg-black/50 object-cover transition-all group-hover:border-cyan-500/60"
								/>
							{:else}
								<div
									class="relative flex h-24 w-24 items-center justify-center rounded-lg border-2 border-cyan-500/30 bg-black/50 text-4xl transition-all group-hover:border-cyan-500/60"
								>
									{getCategoryIcon(ingredient.category)}
								</div>
							{/if}
						</div>

						<!-- Info -->
						<div class="min-w-0 flex-1">
							<div class="mb-2 flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<h3 class="font-rajdhani truncate text-lg font-bold text-cyan-300">
										{ingredient.name_en}
									</h3>
									<p class="truncate text-sm text-cyan-300/60">{ingredient.name_fr}</p>
								</div>
								<div
									class="font-orbitron flex-shrink-0 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white uppercase shadow-lg {getRarityColor(
										ingredient.rarity
									)}"
								>
									{ingredient.rarity}
								</div>
							</div>

							<div class="mb-3 flex flex-wrap gap-2 text-xs">
								<span
									class="font-orbitron rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-3 py-1.5 text-cyan-300"
									title="Category"
								>
									{getCategoryIcon(ingredient.category)}
									{ingredient.category}
								</span>
							</div>

							{#if ingredient.description_en}
								<p class="font-rajdhani mb-3 line-clamp-2 text-sm text-cyan-300/70">
									{ingredient.description_en}
								</p>
							{/if}

							<!-- Actions -->
							<div class="flex gap-2">
								<a
									href="/admin/ingredients/{ingredient.id}"
									class="font-orbitron flex-1 cursor-pointer rounded-lg border-2 border-cyan-500/30 bg-cyan-500/20 px-3 py-2 text-center text-sm tracking-wide text-cyan-300 uppercase transition-all hover:border-cyan-500/60 hover:bg-cyan-500/30"
								>
									✏️ Edit
								</a>
								<button
									onclick={() => deleteIngredient(ingredient.id)}
									class="font-orbitron rounded-lg border-2 px-3 py-2 text-sm tracking-wide uppercase transition-all {deleteConfirm ===
									ingredient.id
										? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/50'
										: 'border-red-500/30 bg-red-500/20 text-red-300 hover:border-red-500/60 hover:bg-red-500/30'}"
								>
									{deleteConfirm === ingredient.id ? '⚠️ Confirm?' : '🗑️'}
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
