<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { uploadImage } from '$lib/upload';
	import { normalizeImageUrl } from '$lib/utils/imageUrl';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	// Form state
	let form = $state({
		slug: data.location?.slug || '',
		name_en: data.location?.name_en || '',
		name_fr: data.location?.name_fr || '',
		system: data.location?.system || 'stanton',
		planet: data.location?.planet || '',
		moon: data.location?.moon || '',
		type: data.location?.type || 'contested_zone',
		difficulty: data.location?.difficulty || 'medium',
		image_url: normalizeImageUrl(data.location?.image_url) || '',
		cheatsheet_image_url: normalizeImageUrl(data.location?.cheatsheet_image_url) || '',
		short_description_en: data.location?.short_description_en || '',
		short_description_fr: data.location?.short_description_fr || '',
		description_en: data.location?.description_en || '',
		description_fr: data.location?.description_fr || '',
		how_to_access_en: data.location?.how_to_access_en || '',
		how_to_access_fr: data.location?.how_to_access_fr || '',
		mission_types_en: data.location?.mission_types_en || '',
		mission_types_fr: data.location?.mission_types_fr || '',
		loot_types_en: data.location?.loot_types_en || '',
		loot_types_fr: data.location?.loot_types_fr || '',
		requirements: data.location?.requirements || '',
		rewards: data.location?.rewards || '',
		coordinates: data.location?.coordinates || '',
		crate_types: data.location?.crate_types?.join('\n') || '',
		related_missions: data.location?.related_missions?.join('\n') || ''
	});

	let saving = $state(false);
	let uploadingImage = $state(false);
	let uploadingCheatsheet = $state(false);

	const locationTypes = [
		{ value: 'contested_zone', label: '🗺️ Point of Interest' },
		{ value: 'orbital_laser', label: '🔫 Orbital Laser' },
		{ value: 'investigation', label: '🔍 Investigation' },
		{ value: 'underground_facility', label: '🏢 Underground Facility' },
		{ value: 'warehouse', label: '📦 Warehouse' },
		{ value: 'bunker', label: '🛡️ Bunker' },
		{ value: 'other', label: '📍 Other' }
	];

	const difficulties = [
		{ value: 'low', label: 'Low' },
		{ value: 'low-medium', label: 'Low-Medium' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'medium-high', label: 'Medium-High' },
		{ value: 'high', label: 'High' }
	];

	const systems = [
		{ value: 'stanton', label: 'Stanton' },
		{ value: 'pyro', label: 'Pyro' },
		{ value: 'nyx', label: 'Nyx' }
	];

	async function handleSubmit() {
		if (!form.slug || !form.name_en || !form.name_fr) {
			alert('Please fill in required fields (Slug, English name, French name)');
			return;
		}

		saving = true;

		try {
			const payload = {
				slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
				name_en: form.name_en,
				name_fr: form.name_fr,
				system: form.system,
				planet: form.planet || null,
				moon: form.moon || null,
				type: form.type,
				difficulty: form.difficulty || null,
				image_url: normalizeImageUrl(form.image_url) || null,
				cheatsheet_image_url: normalizeImageUrl(form.cheatsheet_image_url) || null,
				short_description_en: form.short_description_en || null,
				short_description_fr: form.short_description_fr || null,
				description_en: form.description_en || null,
				description_fr: form.description_fr || null,
				how_to_access_en: form.how_to_access_en || null,
				how_to_access_fr: form.how_to_access_fr || null,
				mission_types_en: form.mission_types_en || null,
				mission_types_fr: form.mission_types_fr || null,
				loot_types_en: form.loot_types_en || null,
				loot_types_fr: form.loot_types_fr || null,
				requirements: form.requirements || null,
				rewards: form.rewards || null,
				coordinates: form.coordinates || null,
				crate_types: form.crate_types
					? form.crate_types.split('\n').filter((l: string) => l.trim())
					: null,
				related_missions: form.related_missions
					? form.related_missions.split('\n').filter((l: string) => l.trim())
					: null
			};

			const url = data.isNew ? '/api/admin/locations' : `/api/admin/locations/${data.location.id}`;

			const method = data.isNew ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				goto('/admin/locations', { invalidateAll: true });
			} else {
				const error = await response.json();
				alert(`Error: ${error.message || 'Failed to save location'}`);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error saving location');
		} finally {
			saving = false;
		}
	}

	async function handleImageUpload(event: Event, type: 'main' | 'cheatsheet') {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		if (type === 'main') {
			uploadingImage = true;
		} else {
			uploadingCheatsheet = true;
		}

		try {
			const url = normalizeImageUrl(await uploadImage(files[0]));
			if (type === 'main') {
				form.image_url = url;
			} else {
				form.cheatsheet_image_url = url;
			}
			alert('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading image:', error);
			alert('Error uploading image: ' + (error as Error).message);
		} finally {
			if (type === 'main') {
				uploadingImage = false;
			} else {
				uploadingCheatsheet = false;
			}
		}
	}
</script>

<div class="mx-auto max-w-6xl space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🗺️</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
				>
					{data.isNew ? 'Create Location' : `Edit: ${data.location.name_en}`}
				</h2>
			</div>
			<p class="text-sm text-cyan-300/60">
				{data.isNew ? 'Add a new location to the database' : 'Modify location information'}
			</p>
		</div>
		<a
			href="/admin/locations"
			class="font-orbitron flex cursor-pointer items-center gap-2 rounded-lg border-2 border-cyan-500/30 px-4 py-2.5 tracking-wide text-cyan-300 uppercase transition-all hover:scale-105 hover:border-cyan-500/60 hover:bg-cyan-500/10"
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
			<span>Back</span>
		</a>
	</div>

	<!-- Form -->
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<!-- Basic Information -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6"
		>
			<h3 class="font-orbitron mb-4 text-xl font-bold text-cyan-300 uppercase">
				📝 Basic Information
			</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="loc-slug" class="mb-1 block text-sm font-medium text-cyan-300">
						Slug * (URL)
					</label>
					<input
						id="loc-slug"
						type="text"
						bind:value={form.slug}
						placeholder="hator-data-center"
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						required
					/>
					<p class="mt-1 text-xs text-gray-400">Lowercase, no spaces (use dashes)</p>
				</div>

				<div>
					<label for="loc-system" class="mb-1 block text-sm font-medium text-cyan-300">
						System *
					</label>
					<select
						id="loc-system"
						bind:value={form.system}
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						required
					>
						{#each systems as sys}
							<option value={sys.value}>{sys.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="loc-name-en" class="mb-1 block text-sm font-medium text-cyan-300">
						Name (English) *
					</label>
					<input
						id="loc-name-en"
						type="text"
						bind:value={form.name_en}
						placeholder="Hator Data Center"
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						required
					/>
				</div>

				<div>
					<label for="loc-name-fr" class="mb-1 block text-sm font-medium text-cyan-300">
						Name (French) *
					</label>
					<input
						id="loc-name-fr"
						type="text"
						bind:value={form.name_fr}
						placeholder="Centre de Données Hator"
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						required
					/>
				</div>

				<div>
					<label for="loc-type" class="mb-1 block text-sm font-medium text-cyan-300">
						Type *
					</label>
					<select
						id="loc-type"
						bind:value={form.type}
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						required
					>
						{#each locationTypes as locType}
							<option value={locType.value}>{locType.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="loc-difficulty" class="mb-1 block text-sm font-medium text-cyan-300">
						Difficulty
					</label>
					<select
						id="loc-difficulty"
						bind:value={form.difficulty}
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
					>
						<option value="">None</option>
						{#each difficulties as diff}
							<option value={diff.value}>{diff.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="loc-planet" class="mb-1 block text-sm font-medium text-cyan-300">
						Planet
					</label>
					<input
						id="loc-planet"
						type="text"
						bind:value={form.planet}
						placeholder="Hurston"
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
					/>
				</div>

				<div>
					<label for="loc-moon" class="mb-1 block text-sm font-medium text-cyan-300"> Moon </label>
					<input
						id="loc-moon"
						type="text"
						bind:value={form.moon}
						placeholder="Aberdeen"
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
					/>
				</div>
			</div>
		</div>

		<!-- Images -->
		<div
			class="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6"
		>
			<h3 class="font-orbitron mb-4 text-xl font-bold text-purple-300 uppercase">🖼️ Images</h3>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Main Image -->
				<div>
					<label for="loc-image-url" class="mb-1 block text-sm font-medium text-purple-300">
						Main Image URL
					</label>
					<input
						id="loc-image-url"
						type="text"
						bind:value={form.image_url}
						placeholder="https://... or /images/..."
						class="w-full rounded-lg border border-purple-500/30 bg-slate-800 px-3 py-2 text-white"
					/>
					<div class="mt-2">
						<label
							class="inline-block cursor-pointer rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-400"
						>
							{uploadingImage ? 'Uploading...' : '📤 Upload Image'}
							<input
								type="file"
								accept="image/*"
								onchange={(e) => handleImageUpload(e, 'main')}
								class="hidden"
								disabled={uploadingImage}
							/>
						</label>
					</div>
					{#if normalizeImageUrl(form.image_url)}
						<img
							src={normalizeImageUrl(form.image_url)}
							alt="Preview"
							class="mt-2 h-32 w-full rounded object-cover"
						/>
					{/if}
				</div>

				<!-- Cheatsheet Image -->
				<div>
					<label for="loc-cheatsheet-url" class="mb-1 block text-sm font-medium text-purple-300">
						Cheatsheet/Guide Image URL
					</label>
					<input
						id="loc-cheatsheet-url"
						type="text"
						bind:value={form.cheatsheet_image_url}
						placeholder="https://... or /images/..."
						class="w-full rounded-lg border border-purple-500/30 bg-slate-800 px-3 py-2 text-white"
					/>
					<div class="mt-2">
						<label
							class="inline-block cursor-pointer rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-400"
						>
							{uploadingCheatsheet ? 'Uploading...' : '📤 Upload Cheatsheet'}
							<input
								type="file"
								accept="image/*"
								onchange={(e) => handleImageUpload(e, 'cheatsheet')}
								class="hidden"
								disabled={uploadingCheatsheet}
							/>
						</label>
					</div>
					{#if normalizeImageUrl(form.cheatsheet_image_url)}
						<img
							src={normalizeImageUrl(form.cheatsheet_image_url)}
							alt="Preview"
							class="mt-2 h-32 w-full rounded object-cover"
						/>
					{/if}
				</div>
			</div>
		</div>

		<!-- Descriptions -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6"
		>
			<h3 class="font-orbitron mb-4 text-xl font-bold text-cyan-300 uppercase">📄 Descriptions</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="loc-short-desc-en" class="mb-1 block text-sm font-medium text-cyan-300">
							Short Description (EN)
						</label>
						<textarea
							id="loc-short-desc-en"
							bind:value={form.short_description_en}
							rows="2"
							placeholder="Brief description for card view"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
					<div>
						<label for="loc-short-desc-fr" class="mb-1 block text-sm font-medium text-cyan-300">
							Short Description (FR)
						</label>
						<textarea
							id="loc-short-desc-fr"
							bind:value={form.short_description_fr}
							rows="2"
							placeholder="Brève description pour la vue carte"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="loc-desc-en" class="mb-1 block text-sm font-medium text-cyan-300">
							Description (EN)
						</label>
						<textarea
							id="loc-desc-en"
							bind:value={form.description_en}
							rows="4"
							placeholder="Full description"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
					<div>
						<label for="loc-desc-fr" class="mb-1 block text-sm font-medium text-cyan-300">
							Description (FR)
						</label>
						<textarea
							id="loc-desc-fr"
							bind:value={form.description_fr}
							rows="4"
							placeholder="Description complète"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="loc-access-en" class="mb-1 block text-sm font-medium text-cyan-300">
							How to Access (EN)
						</label>
						<textarea
							id="loc-access-en"
							bind:value={form.how_to_access_en}
							rows="3"
							placeholder="How to reach this location"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
					<div>
						<label for="loc-access-fr" class="mb-1 block text-sm font-medium text-cyan-300">
							How to Access (FR)
						</label>
						<textarea
							id="loc-access-fr"
							bind:value={form.how_to_access_fr}
							rows="3"
							placeholder="Comment atteindre ce lieu"
							class="w-full resize-none rounded-lg border border-cyan-500/30 bg-slate-800 px-3 py-2 text-white"
						></textarea>
					</div>
				</div>
			</div>
		</div>

		<!-- Gameplay Details -->
		<div
			class="rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-6"
		>
			<h3 class="font-orbitron mb-4 text-xl font-bold text-green-300 uppercase">🎮 Gameplay</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="loc-mission-en" class="mb-1 block text-sm font-medium text-green-300">
						Mission Types (EN)
					</label>
					<textarea
						id="loc-mission-en"
						bind:value={form.mission_types_en}
						rows="3"
						placeholder="Available mission types"
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>
				<div>
					<label for="loc-mission-fr" class="mb-1 block text-sm font-medium text-green-300">
						Mission Types (FR)
					</label>
					<textarea
						id="loc-mission-fr"
						bind:value={form.mission_types_fr}
						rows="3"
						placeholder="Types de missions disponibles"
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>

				<div>
					<label for="loc-loot-en" class="mb-1 block text-sm font-medium text-green-300">
						Loot Types (EN)
					</label>
					<textarea
						id="loc-loot-en"
						bind:value={form.loot_types_en}
						rows="3"
						placeholder="Available loot"
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>
				<div>
					<label for="loc-loot-fr" class="mb-1 block text-sm font-medium text-green-300">
						Loot Types (FR)
					</label>
					<textarea
						id="loc-loot-fr"
						bind:value={form.loot_types_fr}
						rows="3"
						placeholder="Butin disponible"
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>

				<div>
					<label for="loc-requirements" class="mb-1 block text-sm font-medium text-green-300">
						Requirements
					</label>
					<textarea
						id="loc-requirements"
						bind:value={form.requirements}
						rows="2"
						placeholder="Required equipment, skills, etc."
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>

				<div>
					<label for="loc-rewards" class="mb-1 block text-sm font-medium text-green-300">
						Rewards
					</label>
					<textarea
						id="loc-rewards"
						bind:value={form.rewards}
						rows="2"
						placeholder="Typical rewards"
						class="w-full resize-none rounded-lg border border-green-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Additional Data -->
		<div
			class="rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6"
		>
			<h3 class="font-orbitron mb-4 text-xl font-bold text-yellow-300 uppercase">
				📍 Additional Data
			</h3>
			<div class="space-y-4">
				<div>
					<label for="loc-coordinates" class="mb-1 block text-sm font-medium text-yellow-300">
						Coordinates
					</label>
					<input
						id="loc-coordinates"
						type="text"
						bind:value={form.coordinates}
						placeholder="OM-1, 45.2, -23.7"
						class="w-full rounded-lg border border-yellow-500/30 bg-slate-800 px-3 py-2 text-white"
					/>
				</div>

				<div>
					<label for="loc-crates" class="mb-1 block text-sm font-medium text-yellow-300">
						Crate Types (one per line)
					</label>
					<textarea
						id="loc-crates"
						bind:value={form.crate_types}
						rows="3"
						placeholder="medpen&#10;medgun&#10;weapon"
						class="w-full resize-none rounded-lg border border-yellow-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>

				<div>
					<label for="loc-missions" class="mb-1 block text-sm font-medium text-yellow-300">
						Related Missions (one per line)
					</label>
					<textarea
						id="loc-missions"
						bind:value={form.related_missions}
						rows="3"
						placeholder="Defend Location&#10;Clear Hostiles"
						class="w-full resize-none rounded-lg border border-yellow-500/30 bg-slate-800 px-3 py-2 text-white"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex gap-4">
			<button
				type="submit"
				disabled={saving}
				class="flex-1 rounded-lg bg-cyan-500 px-6 py-3 text-lg font-bold text-black transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{saving ? '⏳ Saving...' : data.isNew ? '✅ Create Location' : '💾 Save Changes'}
			</button>
			<a
				href="/admin/locations"
				class="rounded-lg bg-slate-700 px-6 py-3 font-bold text-white transition-all hover:bg-slate-600"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
