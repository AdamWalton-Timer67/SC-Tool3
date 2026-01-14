<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { uploadImage } from '$lib/upload';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	// Form state
	let form = $state({
		id: data.ingredient?.id || '',
		name_en: data.ingredient?.name_en || '',
		name_fr: data.ingredient?.name_fr || '',
		category: data.ingredient?.category || 'mining',
		rarity: data.ingredient?.rarity || 'common',
		image_url: data.ingredient?.image_url || '',
		image_credit: data.ingredient?.image_credit || '',
		description_en: data.ingredient?.description_en || '',
		description_fr: data.ingredient?.description_fr || '',
		how_to_obtain_en: data.ingredient?.how_to_obtain_en || '',
		how_to_obtain_fr: data.ingredient?.how_to_obtain_fr || '',
		location_id: data.ingredient?.location_id || '',
		locations_en: data.ingredient?.locations_en?.join('\n') || '',
		locations_fr: data.ingredient?.locations_fr?.join('\n') || '',
		links: data.ingredient?.links || {}
	});

	let saving = $state(false);
	let uploadingImage = $state(false);

	const categories = [
		{ value: 'mining', label: '⛏️ Mining' },
		{ value: 'currency', label: '💎 Currency' },
		{ value: 'organic', label: '🌿 Organic' },
		{ value: 'weapon', label: '⚔️ Weapon' },
		{ value: 'armor', label: '🛡️ Armor' },
		{ value: 'special', label: '✨ Special' }
	];

	const rarities = [
		{ value: 'common', label: 'Common' },
		{ value: 'uncommon', label: 'Uncommon' },
		{ value: 'rare', label: 'Rare' },
		{ value: 'epic', label: 'Epic' },
		{ value: 'legendary', label: 'Legendary' }
	];

	async function handleSubmit() {
		if (!form.id || !form.name_en || !form.name_fr) {
			alert('Please fill in required fields (ID, English name, French name)');
			return;
		}

		saving = true;

		try {
			const payload = {
				id: form.id,
				name_en: form.name_en,
				name_fr: form.name_fr,
				category: form.category,
				rarity: form.rarity,
				image_url: form.image_url || null,
				image_credit: form.image_credit || null,
				description_en: form.description_en || null,
				description_fr: form.description_fr || null,
				how_to_obtain_en: form.how_to_obtain_en || null,
				how_to_obtain_fr: form.how_to_obtain_fr || null,
				location_id: form.location_id || null,
				locations_en: form.locations_en
					? form.locations_en.split('\n').filter((l: string) => l.trim())
					: null,
				locations_fr: form.locations_fr
					? form.locations_fr.split('\n').filter((l: string) => l.trim())
					: null,
				links: form.links
			};

			const url = data.isNew
				? '/api/admin/ingredients'
				: `/api/admin/ingredients/${data.ingredient.id}`;

			const method = data.isNew ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				// Set flag to reload data on wikelo/inventory pages
				localStorage.setItem('wikelo_reload_needed', 'true');
				goto('/admin/ingredients');
			} else {
				const error = await response.json();
				alert(`Error: ${error.message || 'Failed to save ingredient'}`);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error saving ingredient');
		} finally {
			saving = false;
		}
	}

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		uploadingImage = true;

		try {
			const url = await uploadImage(files[0]);
			form.image_url = url;
			alert('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading image:', error);
			alert('Error uploading image: ' + (error as Error).message);
		} finally {
			uploadingImage = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🧪</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
				>
					{data.isNew ? 'Create Ingredient' : `Edit: ${data.ingredient.name_en}`}
				</h2>
			</div>
			<p class="text-sm text-cyan-300/60">
				{data.isNew ? 'Add a new ingredient to the database' : 'Modify ingredient information'}
			</p>
		</div>
		<a
			href="/admin/ingredients"
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

	<div class="h-px bg-linear-to-r from-cyan-400/50 via-purple-400/50 to-transparent"></div>

	<!-- Form -->
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<!-- Basic Info Card -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase">
					📝 Basic Information
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- ID -->
				<div class="md:col-span-2">
					<label
						for="id"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						ID <span class="text-red-400">*</span>
					</label>
					<input
						id="id"
						type="text"
						bind:value={form.id}
						disabled={!data.isNew}
						required
						placeholder="e.g., quantanium"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none disabled:opacity-50"
					/>
					{#if !data.isNew}
						<p class="font-rajdhani mt-1 text-xs text-cyan-300/50">
							ID cannot be changed after creation
						</p>
					{/if}
				</div>

				<!-- English Name -->
				<div>
					<label
						for="name_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						English Name <span class="text-red-400">*</span>
					</label>
					<input
						id="name_en"
						type="text"
						bind:value={form.name_en}
						required
						placeholder="Quantanium"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>

				<!-- French Name -->
				<div>
					<label
						for="name_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						French Name <span class="text-red-400">*</span>
					</label>
					<input
						id="name_fr"
						type="text"
						bind:value={form.name_fr}
						required
						placeholder="Quantanium"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>

				<!-- Category -->
				<div>
					<label
						for="category"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Category <span class="text-red-400">*</span>
					</label>
					<select
						id="category"
						bind:value={form.category}
						required
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					>
						{#each categories as cat}
							<option value={cat.value}>{cat.label}</option>
						{/each}
					</select>
				</div>

				<!-- Rarity -->
				<div>
					<label
						for="rarity"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Rarity <span class="text-red-400">*</span>
					</label>
					<select
						id="rarity"
						bind:value={form.rarity}
						required
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					>
						{#each rarities as rar}
							<option value={rar.value}>{rar.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Image Card -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase">
					🖼️ Image
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Image URL -->
				<div class="md:col-span-2">
					<label
						for="image_url"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Image URL
					</label>
					<input
						id="image_url"
						type="url"
						bind:value={form.image_url}
						placeholder="https://example.com/image.png"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>

				<!-- Image Upload -->
				<div class="md:col-span-2">
					<label
						for="image-upload"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Or Upload Image
					</label>
					<input
						id="image-upload"
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						disabled={uploadingImage}
						class="w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all file:mr-4 file:rounded file:border-0 file:bg-cyan-500/20 file:px-4 file:py-1 file:text-sm file:text-cyan-300 hover:file:bg-cyan-500/30 focus:outline-none disabled:opacity-50"
					/>
				</div>

				<!-- Image Credit -->
				<div class="md:col-span-2">
					<label
						for="image_credit"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Image Credit
					</label>
					<input
						id="image_credit"
						type="text"
						bind:value={form.image_credit}
						placeholder="Source or author"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>

				<!-- Image Preview -->
				{#if form.image_url}
					<div class="md:col-span-2">
						<p
							class="font-orbitron mb-2 text-sm font-medium tracking-wider text-cyan-300 uppercase"
						>
							Preview
						</p>
						<div class="relative inline-block">
							<div
								class="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-lg"
							></div>
							<img
								src={form.image_url}
								alt="Preview"
								class="relative h-32 w-32 rounded-lg border-2 border-cyan-500/30 object-cover"
								onerror={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
								}}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Description Card -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase">
					📄 Description
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Description EN -->
				<div class="md:col-span-1">
					<label
						for="description_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						English Description
					</label>
					<textarea
						id="description_en"
						bind:value={form.description_en}
						rows="4"
						placeholder="Description in English"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- Description FR -->
				<div class="md:col-span-1">
					<label
						for="description_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						French Description
					</label>
					<textarea
						id="description_fr"
						bind:value={form.description_fr}
						rows="4"
						placeholder="Description en français"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- How to Obtain EN -->
				<div class="md:col-span-1">
					<label
						for="how_to_obtain_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						How to Obtain (English)
					</label>
					<textarea
						id="how_to_obtain_en"
						bind:value={form.how_to_obtain_en}
						rows="3"
						placeholder="How to obtain in English"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- How to Obtain FR -->
				<div class="md:col-span-1">
					<label
						for="how_to_obtain_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						How to Obtain (French)
					</label>
					<textarea
						id="how_to_obtain_fr"
						bind:value={form.how_to_obtain_fr}
						rows="3"
						placeholder="Comment l'obtenir en français"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Locations Card -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase">
					📍 Locations
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
			</div>

			<!-- Structured Location (Priority) -->
			<div class="mb-6 rounded-lg border-2 border-red-500/30 bg-red-500/5 p-4">
				<label
					for="location_id"
					class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-red-400 uppercase"
				>
					📍 Structured Location (Priority - will override textual locations)
				</label>
				<select
					id="location_id"
					bind:value={form.location_id}
					class="font-rajdhani w-full rounded-lg border-2 border-red-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
				>
					<option value="">None (use textual locations below)</option>
					{#each data.locations as location}
						<option value={location.id}>
							{location.name_en} ({location.system}) - {location.type}
						</option>
					{/each}
				</select>
				<p class="font-rajdhani mt-2 text-xs text-red-300/70">
					If a structured location is selected, it will be displayed as a link with Vanduul theme
					(red) in the ingredient dialog, with priority over the textual locations below.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Locations EN -->
				<div>
					<label
						for="locations_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						English Locations (one per line)
					</label>
					<textarea
						id="locations_en"
						bind:value={form.locations_en}
						rows="5"
						placeholder="Location 1&#10;Location 2&#10;Location 3"
						class="w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 font-mono text-sm text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- Locations FR -->
				<div>
					<label
						for="locations_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						French Locations (one per line)
					</label>
					<textarea
						id="locations_fr"
						bind:value={form.locations_fr}
						rows="5"
						placeholder="Emplacement 1&#10;Emplacement 2&#10;Emplacement 3"
						class="w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 font-mono text-sm text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-4 sm:flex-row">
			<button
				type="submit"
				disabled={saving}
				class="font-orbitron flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-4 text-lg font-semibold tracking-wide text-white uppercase transition-all hover:scale-105 hover:from-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if saving}
					<span class="animate-spin text-2xl">⚙️</span>
					<span>Saving...</span>
				{:else}
					<span class="text-2xl">{data.isNew ? '✅' : '💾'}</span>
					<span>{data.isNew ? 'Create Ingredient' : 'Save Changes'}</span>
				{/if}
			</button>

			<a
				href="/admin/ingredients"
				class="font-orbitron flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-cyan-500/30 px-6 py-4 text-lg tracking-wide text-cyan-300 uppercase transition-all hover:scale-105 hover:border-cyan-500/60 hover:bg-cyan-500/10"
			>
				<span class="text-2xl">❌</span>
				<span>Cancel</span>
			</a>
		</div>
	</form>
</div>
