<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	const locationTypes = [
		{ value: 'all', label: 'All Types', icon: '📍' },
		{ value: 'contested_zone', label: 'Point of Interest', icon: '🗺️' },
		{ value: 'orbital_laser', label: 'Orbital Laser', icon: '🔫' },
		{ value: 'investigation', label: 'Investigation', icon: '🔍' },
		{ value: 'underground_facility', label: 'Underground Facility', icon: '🏢' },
		{ value: 'warehouse', label: 'Warehouse', icon: '📦' },
		{ value: 'bunker', label: 'Bunker', icon: '🛡️' },
		{ value: 'other', label: 'Other', icon: '📍' }
	];

	const difficulties = [
		{ value: 'all', label: 'All Difficulties' },
		{ value: 'low', label: 'Low', color: 'green' },
		{ value: 'low-medium', label: 'Low-Medium', color: 'lime' },
		{ value: 'medium', label: 'Medium', color: 'yellow' },
		{ value: 'medium-high', label: 'Medium-High', color: 'orange' },
		{ value: 'high', label: 'High', color: 'red' }
	];

	let searchInput = $state(data.filters?.search || '');
	let deleteConfirm = $state<string | null>(null);
	let uploadResult = $state('');
	let isUploading = $state(false);

	const locationTemplate = {
		id: '',
		slug: '',
		name_en: '',
		name_fr: '',
		system: 'pyro',
		planet: '',
		moon: '',
		type: 'other',
		difficulty: 'low',
		short_description_en: '',
		short_description_fr: '',
		description_en: '',
		description_fr: '',
		how_to_access_en: '',
		how_to_access_fr: '',
		mission_types_en: '',
		mission_types_fr: '',
		loot_types_en: '',
		loot_types_fr: '',
		requirements: '',
		rewards: '',
		coordinates: '',
		crate_types: '',
		related_missions: '',
		image_url: '',
		cheatsheet_image_url: ''
	};

	function applyFilters(system: string, difficulty: string, type: string, search: string) {
		const params = new URLSearchParams();
		if (system !== 'all') params.set('system', system);
		if (difficulty !== 'all') params.set('difficulty', difficulty);
		if (type !== 'all') params.set('type', type);
		if (search) params.set('search', search);
		goto(`/admin/locations?${params.toString()}`);
	}

	function handleSystemChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		applyFilters(
			target.value,
			data.filters?.difficulty || 'all',
			data.filters?.type || 'all',
			searchInput
		);
	}

	function handleDifficultyChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		applyFilters(
			data.filters?.system || 'all',
			target.value,
			data.filters?.type || 'all',
			searchInput
		);
	}

	function handleTypeChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		applyFilters(
			data.filters?.system || 'all',
			data.filters?.difficulty || 'all',
			target.value,
			searchInput
		);
	}

	function handleSearch() {
		applyFilters(
			data.filters?.system || 'all',
			data.filters?.difficulty || 'all',
			data.filters?.type || 'all',
			searchInput
		);
	}

	async function deleteLocation(id: string) {
		if (deleteConfirm !== id) {
			deleteConfirm = id;
			setTimeout(() => (deleteConfirm = null), 3000);
			return;
		}

		try {
			const response = await fetch(`/api/admin/locations/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				goto('/admin/locations', { invalidateAll: true });
			} else {
				alert('Error deleting location');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error deleting location');
		}
	}

	function downloadTemplate() {
		const blob = new Blob([JSON.stringify([locationTemplate], null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'locations-upload-template.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	async function uploadLocations(event: Event) {
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

			const response = await fetch('/api/admin/locations', {
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
			await goto('/admin/locations', { invalidateAll: true });
		} catch (error) {
			uploadResult = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			isUploading = false;
			input.value = '';
		}
	}

	function getDifficultyColor(difficulty: string | null): string {
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

	function getTypeIcon(type: string): string {
		const icons: Record<string, string> = {
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
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🗺️</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
				>
					Manage Locations
				</h2>
			</div>
			<p class="text-sm text-cyan-300/60">
				Total: {data.locations.length} locations
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={downloadTemplate}
				class="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-500/20"
			>
				⬇️ Download Template
			</button>
			<label
				for="location-upload"
				class="cursor-pointer rounded-lg border border-purple-500/40 bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-200 transition-all hover:bg-purple-500/30"
			>
				{isUploading ? 'Uploading...' : 'Upload Locations'}
			</label>
			<input
				id="location-upload"
				type="file"
				accept="application/json"
				class="hidden"
				onchange={uploadLocations}
				disabled={isUploading}
			/>
			<a
				href="/admin/locations/new"
				class="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black transition-all hover:bg-cyan-400"
			>
				<span>➕</span>
				<span>Add Location</span>
			</a>
		</div>
	</div>

	{#if uploadResult}
		<div
			class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200"
		>
			{uploadResult}
		</div>
	{/if}

	<!-- Filters -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- Search -->
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Search locations..."
				class="flex-1 rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white placeholder-gray-400"
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<button
				type="button"
				onclick={handleSearch}
				class="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400"
			>
				🔍
			</button>
		</div>

		<!-- System Filter -->
		<select
			value={data.filters?.system || 'all'}
			onchange={handleSystemChange}
			class="rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
		>
			<option value="all">All Systems</option>
			{#each data.systems as systemRaw}
				<option value={String(systemRaw)}
					>{String(systemRaw).charAt(0).toUpperCase() + String(systemRaw).slice(1)}</option
				>
			{/each}
		</select>

		<!-- Difficulty Filter -->
		<select
			value={data.filters?.difficulty || 'all'}
			onchange={handleDifficultyChange}
			class="rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
		>
			{#each difficulties as diff}
				<option value={diff.value}>{diff.label}</option>
			{/each}
		</select>

		<!-- Type Filter -->
		<select
			value={data.filters?.type || 'all'}
			onchange={handleTypeChange}
			class="rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
		>
			{#each locationTypes as locType}
				<option value={locType.value}>{locType.icon} {locType.label}</option>
			{/each}
		</select>
	</div>

	<!-- Locations Table -->
	<div class="overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-slate-900/50">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-cyan-500/10">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">Image</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">Name</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">System</th
						>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase">Type</th>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase"
							>Difficulty</th
						>
						<th class="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-cyan-500/10">
					{#each data.locations as location}
						<tr class="transition-colors hover:bg-cyan-500/5">
							<td class="px-4 py-3">
								{#if location.image_url}
									<img
										src={location.image_url}
										alt={location.name_en}
										class="h-16 w-16 rounded object-cover"
										onerror={(event) => {
											const image = event.currentTarget as HTMLImageElement;
											image.onerror = null;
											image.src = '/images/wikelo/wikelo_favor.webp';
										}}
									/>
								{:else}
									<div
										class="flex h-16 w-16 items-center justify-center rounded bg-slate-800 text-2xl"
									>
										{getTypeIcon(location.type)}
									</div>
								{/if}
							</td>
							<td class="px-4 py-3">
								<div class="font-medium text-white">{location.name_en}</div>
								<div class="text-sm text-gray-400">{location.name_fr}</div>
								<div class="mt-1 text-xs text-cyan-400">{location.slug}</div>
							</td>
							<td class="px-4 py-3">
								<span class="rounded bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-400">
									{location.system}
								</span>
							</td>
							<td class="px-4 py-3">
								<span class="text-sm text-gray-300">
									{getTypeIcon(location.type)}
									{location.type.replace(/_/g, ' ')}
								</span>
							</td>
							<td class="px-4 py-3">
								{#if location.difficulty}
									<span class="text-sm font-semibold {getDifficultyColor(location.difficulty)}">
										{location.difficulty}
									</span>
								{:else}
									<span class="text-sm text-gray-500">-</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a
										href={`/admin/locations/${encodeURIComponent(location.id)}`}
										class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-400"
									>
										✏️ Edit
									</a>
									<button
										onclick={() => deleteLocation(location.id)}
										class="px-3 py-1 {deleteConfirm === location.id
											? 'bg-red-600'
											: 'bg-red-500'} rounded text-sm text-white hover:bg-red-400"
									>
										{deleteConfirm === location.id ? '⚠️ Confirm?' : '🗑️ Delete'}
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-8 text-center text-gray-400">
								No locations found. Create your first location!
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
