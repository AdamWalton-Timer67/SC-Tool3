<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const categories = [
		{ value: 'all', label: 'All Categories', icon: '📦' },
		{ value: 'ship', label: 'Ship', icon: '🚀' },
		{ value: 'weapon', label: 'Weapon', icon: '⚔️' },
		{ value: 'armor', label: 'Armor', icon: '🛡️' },
		{ value: 'utility', label: 'Utility', icon: '🔧' },
		{ value: 'vehicle', label: 'Vehicle', icon: '🚜' },
		{ value: 'currency', label: 'Currency', icon: '💎' }
	];

	const rarities = [
		{ value: 'all', label: 'All Rarities' },
		{ value: 'common', label: 'Common' },
		{ value: 'uncommon', label: 'Uncommon' },
		{ value: 'rare', label: 'Rare' },
		{ value: 'epic', label: 'Epic' },
		{ value: 'legendary', label: 'Legendary' }
	];

	let searchInput = $state(data.filters?.search || '');
	let deleteConfirm = $state<string | null>(null);
	let uploadResult = $state('');
	let isUploading = $state(false);

	const rewardTemplate = {
		id: '',
		name_en: '',
		name_fr: '',
		category: 'weapons',
		rarity: 'common',
		type_en: '',
		type_fr: '',
		description_en: '',
		description_fr: '',
		location_en: '',
		location_fr: '',
		stats: '',
		image_url: '',
		has_loadout: false,
		components: []
	};

	function applyFilters(category: string, rarity: string, search: string) {
		const params = new URLSearchParams();
		if (category !== 'all') params.set('category', category);
		if (rarity !== 'all') params.set('rarity', rarity);
		if (search) params.set('search', search);
		goto(`/admin/rewards?${params.toString()}`);
	}

	async function deleteReward(id: string) {
		if (deleteConfirm !== id) {
			deleteConfirm = id;
			setTimeout(() => (deleteConfirm = null), 3000);
			return;
		}

		try {
			const response = await fetch(`/api/admin/rewards/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				goto('/admin/rewards', { invalidateAll: true });
			} else {
				alert('Error deleting reward');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error deleting reward');
		}
	}

	function downloadTemplate() {
		const blob = new Blob([JSON.stringify([rewardTemplate], null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'rewards-upload-template.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	async function uploadRewards(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploadResult = '';
		isUploading = true;

		try {
			const parsed = JSON.parse(await file.text());
			const items = Array.isArray(parsed) ? parsed : parsed?.items;
			if (!Array.isArray(items) || items.length === 0) {
				uploadResult = 'Upload failed: JSON must be an array or { items: [...] }.';
				return;
			}

			const response = await fetch('/api/admin/rewards', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ bulk: true, items })
			});
			const result = await response.json();
			if (!response.ok && response.status !== 207) {
				uploadResult = `Upload failed: ${result?.error || 'Unknown error'}`;
				return;
			}

			uploadResult = `Upload complete: ${result.inserted ?? 0} inserted, ${result.updated ?? 0} updated, ${(result.errors ?? []).length} errors.`;
			await goto('/admin/rewards', { invalidateAll: true });
		} catch (error) {
			uploadResult = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			isUploading = false;
			input.value = '';
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
			ship: '🚀',
			weapon: '⚔️',
			armor: '🛡️',
			utility: '🔧',
			vehicle: '🚜',
			currency: '💎'
		};
		return icons[category] || '🎁';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🎁</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-purple-300 uppercase sm:text-3xl"
				>
					Rewards Management
				</h2>
			</div>
			<p class="text-sm text-purple-300/60">
				{data.rewards.length} reward{data.rewards.length !== 1 ? 's' : ''} found
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={downloadTemplate}
				class="font-orbitron rounded-lg border-2 border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm tracking-wide text-purple-300 uppercase transition-all hover:border-purple-500/60 hover:bg-purple-500/20"
			>
				⬇️ Download Template
			</button>
			<label
				for="reward-upload"
				class="font-orbitron cursor-pointer rounded-lg border-2 border-cyan-500/30 bg-cyan-500/20 px-4 py-3 text-sm tracking-wide text-cyan-300 uppercase transition-all hover:border-cyan-500/60 hover:bg-cyan-500/30"
			>
				{isUploading ? 'Uploading...' : 'Upload Rewards'}
			</label>
			<input
				id="reward-upload"
				type="file"
				accept="application/json"
				class="hidden"
				onchange={uploadRewards}
				disabled={isUploading}
			/>
			<a
				href="/admin/rewards/new"
				class="font-orbitron flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 sm:px-6"
			>
				<span class="text-xl">➕</span>
				<span>Add New Reward</span>
			</a>
		</div>
	</div>

	<div class="h-px bg-linear-to-r from-purple-400/50 via-pink-400/50 to-transparent"></div>

	{#if uploadResult}
		<div
			class="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-200"
		>
			{uploadResult}
		</div>
	{/if}

	<!-- Filters -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div>
			<label
				for="category"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
			>
				Category
			</label>
			<select
				id="category"
				value={data.filters?.category || 'all'}
				onchange={(e) =>
					applyFilters(
						(e.target as HTMLSelectElement).value,
						data.filters?.rarity || 'all',
						searchInput
					)}
				class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
			>
				{#each categories as cat}
					<option value={cat.value}>{cat.icon} {cat.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label
				for="rarity"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
			>
				Rarity
			</label>
			<select
				id="rarity"
				value={data.filters?.rarity || 'all'}
				onchange={(e) =>
					applyFilters(
						data.filters?.category || 'all',
						(e.target as HTMLSelectElement).value,
						searchInput
					)}
				class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
			>
				{#each rarities as rar}
					<option value={rar.value}>{rar.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label
				for="search"
				class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
			>
				Search
			</label>
			<div class="flex gap-2">
				<input
					id="search"
					type="text"
					bind:value={searchInput}
					onkeydown={(e) =>
						e.key === 'Enter' &&
						applyFilters(
							data.filters?.category || 'all',
							data.filters?.rarity || 'all',
							searchInput
						)}
					placeholder="Search by name..."
					class="font-rajdhani flex-1 rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
				/>
				<button
					type="button"
					onclick={() =>
						applyFilters(
							data.filters?.category || 'all',
							data.filters?.rarity || 'all',
							searchInput
						)}
					class="rounded-lg border-2 border-purple-500/30 bg-purple-500/20 px-4 py-3 text-purple-300 transition-all hover:scale-105 hover:border-purple-500/60 hover:bg-purple-500/30"
				>
					🔍
				</button>
			</div>
		</div>
	</div>

	<!-- Rewards Grid -->
	{#if data.rewards.length === 0}
		<div class="rounded-xl border-2 border-purple-500/20 bg-purple-500/5 p-12 text-center">
			<div class="mb-4 text-6xl opacity-50">🔍</div>
			<p class="font-orbitron text-lg text-purple-300/60">No rewards found</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each data.rewards as reward}
				<div
					class="group rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-black/40 to-black/20 p-4 backdrop-blur-sm transition-all hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30"
				>
					<div class="flex gap-4">
						<div class="relative flex-shrink-0">
							<div
								class="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-md"
							></div>
							{#if reward.image_url}
								<img
									src={reward.image_url}
									alt={reward.name_en}
									class="relative h-24 w-24 rounded-lg border-2 border-purple-500/30 bg-black/50 object-cover transition-all group-hover:border-purple-500/60"
								/>
							{:else}
								<div
									class="relative flex h-24 w-24 items-center justify-center rounded-lg border-2 border-purple-500/30 bg-black/50 text-4xl transition-all group-hover:border-purple-500/60"
								>
									{getCategoryIcon(reward.category)}
								</div>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<div class="mb-2 flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<h3 class="font-rajdhani truncate text-lg font-bold text-purple-300">
										{reward.name_en}
									</h3>
									<p class="truncate text-sm text-purple-300/60">{reward.name_fr}</p>
								</div>
								<div
									class="font-orbitron flex-shrink-0 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white uppercase shadow-lg {getRarityColor(
										reward.rarity
									)}"
								>
									{reward.rarity}
								</div>
							</div>

							<div class="mb-3 flex flex-wrap gap-2 text-xs">
								<span
									class="font-orbitron rounded-lg border border-purple-500/30 bg-purple-500/20 px-3 py-1.5 text-purple-300"
								>
									{getCategoryIcon(reward.category)}
									{reward.category}
								</span>
								{#if reward.has_loadout}
									<span
										class="font-orbitron rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-3 py-1.5 text-cyan-300"
										>⚙️ Loadout</span
									>
								{/if}
							</div>

							{#if reward.type_en}
								<p class="font-rajdhani mb-2 truncate text-xs text-purple-300/70">
									{reward.type_en}
								</p>
							{/if}

							<div class="flex gap-2">
								<a
									href={`/admin/rewards/${encodeURIComponent(reward.id)}`}
									class="font-orbitron flex-1 cursor-pointer rounded-lg border-2 border-purple-500/30 bg-purple-500/20 px-3 py-2 text-center text-sm tracking-wide text-purple-300 uppercase transition-all hover:border-purple-500/60 hover:bg-purple-500/30"
								>
									✏️ Edit
								</a>
								<button
									onclick={() => deleteReward(reward.id)}
									class="font-orbitron rounded-lg border-2 px-3 py-2 text-sm tracking-wide uppercase transition-all {deleteConfirm ===
									reward.id
										? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/50'
										: 'border-red-500/30 bg-red-500/20 text-red-300 hover:border-red-500/60 hover:bg-red-500/30'}"
								>
									{deleteConfirm === reward.id ? '⚠️ Confirm?' : '🗑️'}
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
