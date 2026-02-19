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
		id: data.reward?.id || '',
		name_en: data.reward?.name_en || '',
		name_fr: data.reward?.name_fr || '',
		category: data.reward?.category || 'ships',
		rarity: data.reward?.rarity || 'common',
		type_en: data.reward?.type_en || '',
		type_fr: data.reward?.type_fr || '',
		image_url: normalizeImageUrl(data.reward?.image_url) || '',
		image_credit: data.reward?.image_credit || '',
		description_en: data.reward?.description_en || '',
		description_fr: data.reward?.description_fr || '',
		mission_name_en: data.reward?.mission_name_en || '',
		mission_name_fr: data.reward?.mission_name_fr || '',
		has_loadout: data.reward?.has_loadout || false,
		components: data.reward?.components || [],
		not_released: data.reward?.not_released || false
	});

	// Requirements state
	let requirements = $state(
		data.requirements.map((req: any) => ({
			ingredient_id: req.ingredient_id,
			quantity: req.quantity,
			unit: req.unit || 'units',
			// Supabase returns the relation as "ingredients" (plural)
			// even though it's a one-to-one relationship
			ingredient: req.ingredients
		}))
	);

	// Reputation requirements state
	let reputationRequirements = $state(
		data.reputationRequirements.map((req: any) => ({
			id: req.id,
			reputation_name_en: req.reputation_name_en,
			reputation_name_fr: req.reputation_name_fr,
			required_level: req.required_level
		}))
	);

	// New requirement form
	let newRequirement = $state({
		ingredient_id: '',
		quantity: 1,
		unit: 'units'
	});

	// New reputation requirement form
	let newReputationRequirement = $state({
		reputation_name_en: '',
		reputation_name_fr: '',
		required_level: 1
	});

	// Component form (for ships)
	let newComponent = $state({
		count: 1,
		name: '',
		category: '',
		class: '',
		grade: ''
	});

	let saving = $state(false);
	let uploadingImage = $state(false);

	const categories = [
		{ value: 'ships', label: '🚀 Ships' },
		{ value: 'weapons', label: '⚔️ Weapons' },
		{ value: 'armor', label: '🛡️ Armor' },
		{ value: 'utilities', label: '🔧 Utilities' },
		{ value: 'vehicles', label: '🚜 Vehicles' },
		{ value: 'currency', label: '💎 Currency' }
	];

	const rarities = [
		{ value: 'common', label: 'Common' },
		{ value: 'uncommon', label: 'Uncommon' },
		{ value: 'rare', label: 'Rare' },
		{ value: 'epic', label: 'Epic' },
		{ value: 'legendary', label: 'Legendary' }
	];

	function addRequirement() {
		if (!newRequirement.ingredient_id || newRequirement.quantity < 1) {
			alert('Please select an ingredient and enter a valid quantity');
			return;
		}

		const ingredient = data.ingredients.find(
			(i: { id: string }) => i.id === newRequirement.ingredient_id
		);
		if (!ingredient) return;

		requirements.push({
			ingredient_id: newRequirement.ingredient_id,
			quantity: newRequirement.quantity,
			unit: newRequirement.unit,
			ingredient: ingredient
		});

		// Reset form
		newRequirement = {
			ingredient_id: '',
			quantity: 1,
			unit: 'units'
		};
	}

	function removeRequirement(index: number) {
		requirements.splice(index, 1);
	}

	function addReputationRequirement() {
		if (
			!newReputationRequirement.reputation_name_en ||
			!newReputationRequirement.reputation_name_fr ||
			newReputationRequirement.required_level < 1
		) {
			alert('Please fill in all reputation fields with valid values');
			return;
		}

		reputationRequirements.push({
			id: undefined,
			reputation_name_en: newReputationRequirement.reputation_name_en,
			reputation_name_fr: newReputationRequirement.reputation_name_fr,
			required_level: newReputationRequirement.required_level
		});

		// Reset form
		newReputationRequirement = {
			reputation_name_en: '',
			reputation_name_fr: '',
			required_level: 1
		};
	}

	function removeReputationRequirement(index: number) {
		reputationRequirements.splice(index, 1);
	}

	function addComponent() {
		if (!newComponent.name || !newComponent.category) {
			alert('Please fill in component name and category');
			return;
		}

		form.components = [...form.components, { ...newComponent }];

		// Reset form
		newComponent = {
			count: 1,
			name: '',
			category: '',
			class: '',
			grade: ''
		};
	}

	function removeComponent(index: number) {
		form.components = form.components.filter((_: unknown, i: number) => i !== index);
	}

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
				type_en: form.type_en || null,
				type_fr: form.type_fr || null,
				image_url: normalizeImageUrl(form.image_url) || null,
				image_credit: form.image_credit || null,
				description_en: form.description_en || null,
				description_fr: form.description_fr || null,
				mission_name_en: form.mission_name_en || null,
				mission_name_fr: form.mission_name_fr || null,
				has_loadout: form.has_loadout,
				components: form.components.length > 0 ? form.components : null,
				not_released: form.not_released
			};

			const url = data.isNew ? '/api/admin/rewards' : `/api/admin/rewards/${data.reward.id}`;
			const method = data.isNew ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const error = await response.json();
				alert(`Error: ${error.message || 'Failed to save reward'}`);
				saving = false;
				return;
			}

			// Save requirements
			await saveRequirements(form.id);

			// Save reputation requirements
			await saveReputationRequirements(form.id);

			// Set flag to reload data on wikelo/inventory pages
			localStorage.setItem('wikelo_reload_needed', 'true');

			goto('/admin/rewards', { invalidateAll: true });
		} catch (error) {
			console.error('Error:', error);
			alert('Error saving reward');
			saving = false;
		}
	}

	async function saveRequirements(rewardId: string) {
		// Delete existing requirements
		await fetch(`/api/admin/rewards/${rewardId}/requirements`, {
			method: 'DELETE'
		});

		// Insert new requirements
		if (requirements.length > 0) {
			const requirementsPayload = requirements.map(
				(req: { ingredient_id: string; quantity: number; unit: string | null }) => ({
					reward_id: rewardId,
					ingredient_id: req.ingredient_id,
					quantity: req.quantity,
					unit: req.unit
				})
			);

			await fetch(`/api/admin/rewards/${rewardId}/requirements`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requirementsPayload)
			});
		}
	}

	async function saveReputationRequirements(rewardId: string) {
		try {
			// Delete all existing reputation requirements
			const deleteResponse = await fetch(`/api/admin/rewards/${rewardId}/reputation`, {
				method: 'DELETE'
			});

			if (!deleteResponse.ok) {
				const error = await deleteResponse.json();
				console.error('Error deleting reputation requirements:', error);
				throw new Error(
					`Failed to delete reputation requirements: ${error.message || 'Unknown error'}`
				);
			}

			// Insert new reputation requirements
			for (const req of reputationRequirements) {
				const response = await fetch(`/api/admin/rewards/${rewardId}/reputation`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						reputation_name_en: req.reputation_name_en,
						reputation_name_fr: req.reputation_name_fr,
						required_level: req.required_level
					})
				});

				if (!response.ok) {
					const error = await response.json();
					console.error('Error saving reputation requirement:', error);
					throw new Error(
						`Failed to save reputation requirement: ${error.message || 'Unknown error'}`
					);
				}

				const result = await response.json();
			}
		} catch (error) {
			console.error('Error in saveReputationRequirements:', error);
			alert(`Error saving reputation requirements: ${(error as Error).message}`);
			throw error;
		}
	}

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		uploadingImage = true;

		try {
			const url = await uploadImage(files[0]);
			form.image_url = normalizeImageUrl(url);
			alert('Image uploaded successfully!');
		} catch (error) {
			console.error('Error uploading image:', error);
			alert('Error uploading image: ' + (error as Error).message);
		} finally {
			uploadingImage = false;
		}
	}
</script>

<div class="mx-auto max-w-6xl space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<span class="text-4xl">🎁</span>
				<h2
					class="font-orbitron text-2xl font-bold tracking-wider text-purple-300 uppercase sm:text-3xl"
				>
					{data.isNew ? 'Create Reward' : `Edit: ${data.reward.name_en}`}
				</h2>
			</div>
			<p class="text-sm text-purple-300/60">
				{data.isNew ? 'Add a new reward to the database' : 'Modify reward information'}
			</p>
		</div>
		<a
			href="/admin/rewards"
			class="font-orbitron flex cursor-pointer items-center gap-2 rounded-lg border-2 border-purple-500/30 px-4 py-2.5 tracking-wide text-purple-300 uppercase transition-all hover:scale-105 hover:border-purple-500/60 hover:bg-purple-500/10"
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

	<div class="h-px bg-linear-to-r from-purple-400/50 via-pink-400/50 to-transparent"></div>

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
			class="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-purple-300 uppercase">
					📝 Basic Information
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- ID -->
				<div class="md:col-span-2">
					<label
						for="id"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						ID <span class="text-red-400">*</span>
					</label>
					<input
						id="id"
						type="text"
						bind:value={form.id}
						disabled={!data.isNew}
						required
						placeholder="e.g., nox"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
					/>
					{#if !data.isNew}
						<p class="font-rajdhani mt-1 text-xs text-purple-300/50">
							ID cannot be changed after creation
						</p>
					{/if}
				</div>

				<!-- English Name -->
				<div>
					<label
						for="name_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						English Name <span class="text-red-400">*</span>
					</label>
					<input
						id="name_en"
						type="text"
						bind:value={form.name_en}
						required
						placeholder="Nox"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- French Name -->
				<div>
					<label
						for="name_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						French Name <span class="text-red-400">*</span>
					</label>
					<input
						id="name_fr"
						type="text"
						bind:value={form.name_fr}
						required
						placeholder="Nox"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- Category -->
				<div>
					<label
						for="category"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Category <span class="text-red-400">*</span>
					</label>
					<select
						id="category"
						bind:value={form.category}
						required
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
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
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Rarity <span class="text-red-400">*</span>
					</label>
					<select
						id="rarity"
						bind:value={form.rarity}
						required
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					>
						{#each rarities as rar}
							<option value={rar.value}>{rar.label}</option>
						{/each}
					</select>
				</div>

				<!-- Not Released -->
				<div class="md:col-span-2">
					<label
						class="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/10 p-3 transition-all hover:bg-yellow-500/20"
					>
						<input
							type="checkbox"
							bind:checked={form.not_released}
							class="h-5 w-5 rounded border-2 border-yellow-500/30 bg-black/50 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
						/>
						<span class="font-orbitron text-sm font-medium tracking-wide text-yellow-300 uppercase">
							🚧 Pas encore implémentée dans le jeu
						</span>
					</label>
					<p class="font-rajdhani mt-2 ml-8 text-xs text-purple-300/60">
						Cochez cette case si la récompense n'est pas encore disponible dans le jeu. Seuls
						l'image et le titre seront affichés.
					</p>
				</div>

				<!-- Type EN -->
				<div>
					<label
						for="type_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Type (English)
					</label>
					<input
						id="type_en"
						type="text"
						bind:value={form.type_en}
						placeholder="Space Bike | Competition - Racing"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- Type FR -->
				<div>
					<label
						for="type_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Type (French)
					</label>
					<input
						id="type_fr"
						type="text"
						bind:value={form.type_fr}
						placeholder="Moto Spatiale | Competition - Course"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>
			</div>
		</div>

		<!-- Image Card -->
		<div
			class="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-purple-300 uppercase">
					🖼️ Image
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Image URL -->
				<div class="md:col-span-2">
					<label
						for="image_url"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Image URL
					</label>
					<input
						id="image_url"
						type="text"
						bind:value={form.image_url}
						placeholder="https://example.com/image.png or /images/..."
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- Image Upload -->
				<div class="md:col-span-2">
					<label
						for="reward-image-upload"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
						>Or Upload Image</label
					>
					<input
						id="reward-image-upload"
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						disabled={uploadingImage}
						class="w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 transition-all file:mr-4 file:rounded file:border-0 file:bg-purple-500/20 file:px-4 file:py-1 file:text-sm file:text-purple-300 hover:file:bg-purple-500/30 focus:outline-none disabled:opacity-50"
					/>
				</div>

				<!-- Image Credit -->
				<div class="md:col-span-2">
					<label
						for="image_credit"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Image Credit
					</label>
					<input
						id="image_credit"
						type="text"
						bind:value={form.image_credit}
						placeholder="Source or author"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- Image Preview -->
				{#if form.image_url}
					<div class="md:col-span-2">
						<p
							class="font-orbitron mb-2 text-sm font-medium tracking-wider text-purple-300 uppercase"
						>
							Preview
						</p>
						<div class="relative inline-block">
							<div
								class="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-lg"
							></div>
							<img
								src={form.image_url}
								alt="Preview"
								class="relative h-32 w-32 rounded-lg border-2 border-purple-500/30 object-cover"
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
			class="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-purple-300 uppercase">
					📄 Description & Mission
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-purple-400/50 to-transparent"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Description EN -->
				<div>
					<label
						for="description_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						English Description
					</label>
					<textarea
						id="description_en"
						bind:value={form.description_en}
						rows="4"
						placeholder="Description in English"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- Description FR -->
				<div>
					<label
						for="description_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						French Description
					</label>
					<textarea
						id="description_fr"
						bind:value={form.description_fr}
						rows="4"
						placeholder="Description en français"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					></textarea>
				</div>

				<!-- Mission Name EN -->
				<div>
					<label
						for="mission_name_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Mission Name (English)
					</label>
					<input
						id="mission_name_en"
						type="text"
						bind:value={form.mission_name_en}
						placeholder="Mission name in English"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>

				<!-- Mission Name FR -->
				<div>
					<label
						for="mission_name_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-purple-300 uppercase"
					>
						Mission Name (French)
					</label>
					<input
						id="mission_name_fr"
						type="text"
						bind:value={form.mission_name_fr}
						placeholder="Nom de mission en français"
						class="font-rajdhani w-full rounded-lg border-2 border-purple-500/30 bg-black/50 px-4 py-3 text-purple-300 placeholder-purple-300/30 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
					/>
				</div>
			</div>
		</div>

		<!-- Requirements Card -->
		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase">
					🧪 Requirements (Ingredients)
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
				></div>
			</div>

			<!-- Current Requirements -->
			{#if requirements.length > 0}
				<div class="mb-4 space-y-2">
					{#each requirements as req, index}
						<div
							class="flex items-center justify-between rounded-lg border-2 border-cyan-500/20 bg-cyan-500/5 p-3"
						>
							<div class="flex items-center gap-3">
								<span class="font-rajdhani font-semibold text-cyan-300"
									>{req.ingredient?.name_en}</span
								>
								<span class="font-rajdhani text-sm text-cyan-300/60">
									x{req.quantity}
									{req.unit}
								</span>
								<span
									class="font-orbitron rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300"
								>
									{req.ingredient?.category}
								</span>
							</div>
							<button
								type="button"
								onclick={() => removeRequirement(index)}
								class="font-orbitron rounded border-2 border-red-500/30 px-3 py-1 text-sm tracking-wide text-red-300 uppercase transition-all hover:border-red-500/60 hover:bg-red-500/20"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add New Requirement -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-4">
				<div class="md:col-span-2">
					<label
						for="ingredient"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Ingredient
					</label>
					<select
						id="ingredient"
						bind:value={newRequirement.ingredient_id}
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					>
						<option value="">Select an ingredient...</option>
						{#each data.ingredients as ingredient}
							<option value={ingredient.id}>
								{ingredient.name_en} ({ingredient.category})
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label
						for="quantity"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
					>
						Quantity
					</label>
					<input
						id="quantity"
						type="number"
						bind:value={newRequirement.quantity}
						min="1"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>

				<div>
					<label
						for="unit"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-cyan-300 uppercase"
						>Unit</label
					>
					<input
						id="unit"
						type="text"
						bind:value={newRequirement.unit}
						placeholder="units"
						class="font-rajdhani w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-3 text-cyan-300 placeholder-cyan-300/30 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="button"
				onclick={addRequirement}
				class="font-orbitron mt-3 flex items-center gap-2 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/20 px-4 py-2 text-sm tracking-wide text-cyan-300 uppercase transition-all hover:scale-105 hover:border-cyan-500/60 hover:bg-cyan-500/30"
			>
				<span class="text-lg">➕</span>
				<span>Add Requirement</span>
			</button>
		</div>

		<!-- Reputation Requirements Card (Optional) -->
		<div
			class="rounded-xl border-2 border-orange-500/30 bg-linear-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center gap-3">
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-orange-400/50 to-transparent"
				></div>
				<h3 class="font-orbitron text-lg font-semibold tracking-wider text-orange-300 uppercase">
					⭐ Reputation Requirements (Optional)
				</h3>
				<div
					class="h-px flex-1 bg-linear-to-r from-transparent via-orange-400/50 to-transparent"
				></div>
			</div>

			<p class="font-rajdhani mb-4 text-sm text-orange-300/60">
				Ajouter une ou plusieurs réputations requises pour obtenir cette récompense (ex: "Barter &
				Trade" niveau 340).
			</p>

			<!-- Current Reputation Requirements -->
			{#if reputationRequirements.length > 0}
				<div class="mb-4 space-y-2">
					{#each reputationRequirements as req, index}
						<div
							class="flex items-center justify-between rounded-lg border-2 border-orange-500/20 bg-orange-500/5 p-3"
						>
							<div class="flex items-center gap-3">
								<span class="text-lg text-orange-300">⭐</span>
								<div>
									<div class="font-rajdhani font-semibold text-orange-300">
										{req.reputation_name_en} / {req.reputation_name_fr}
									</div>
									<div class="font-rajdhani text-sm text-orange-300/60">
										Niveau requis: <span class="font-bold text-orange-400"
											>{req.required_level}</span
										>
									</div>
								</div>
							</div>
							<button
								type="button"
								onclick={() => removeReputationRequirement(index)}
								class="font-orbitron rounded border-2 border-red-500/30 px-3 py-1 text-sm tracking-wide text-red-300 uppercase transition-all hover:border-red-500/60 hover:bg-red-500/20"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add New Reputation Requirement -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
				<div>
					<label
						for="reputation_name_en"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-orange-300 uppercase"
					>
						Reputation Name (EN)
					</label>
					<input
						id="reputation_name_en"
						type="text"
						bind:value={newReputationRequirement.reputation_name_en}
						placeholder="Barter & Trade"
						class="font-rajdhani w-full rounded-lg border-2 border-orange-500/30 bg-black/50 px-4 py-3 text-orange-300 placeholder-orange-300/30 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					/>
				</div>

				<div>
					<label
						for="reputation_name_fr"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-orange-300 uppercase"
					>
						Reputation Name (FR)
					</label>
					<input
						id="reputation_name_fr"
						type="text"
						bind:value={newReputationRequirement.reputation_name_fr}
						placeholder="Commerce & Troc"
						class="font-rajdhani w-full rounded-lg border-2 border-orange-500/30 bg-black/50 px-4 py-3 text-orange-300 placeholder-orange-300/30 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					/>
				</div>

				<div>
					<label
						for="required_level"
						class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-orange-300 uppercase"
					>
						Required Level
					</label>
					<input
						id="required_level"
						type="number"
						bind:value={newReputationRequirement.required_level}
						min="1"
						placeholder="340"
						class="font-rajdhani w-full rounded-lg border-2 border-orange-500/30 bg-black/50 px-4 py-3 text-orange-300 placeholder-orange-300/30 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="button"
				onclick={addReputationRequirement}
				class="font-orbitron mt-3 flex items-center gap-2 rounded-lg border-2 border-orange-500/30 bg-orange-500/20 px-4 py-2 text-sm tracking-wide text-orange-300 uppercase transition-all hover:scale-105 hover:border-orange-500/60 hover:bg-orange-500/30"
			>
				<span class="text-lg">⭐</span>
				<span>Add Reputation Requirement</span>
			</button>
		</div>

		<!-- Components Card (for ships) -->
		<div
			class="rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm"
		>
			<div class="mb-6 flex items-center justify-between">
				<div class="flex flex-1 items-center gap-3">
					<div
						class="h-px flex-1 bg-linear-to-r from-transparent via-yellow-400/50 to-transparent"
					></div>
					<h3 class="font-orbitron text-lg font-semibold tracking-wider text-yellow-300 uppercase">
						⚙️ Components (Ship Loadout)
					</h3>
					<div
						class="h-px flex-1 bg-linear-to-r from-transparent via-yellow-400/50 to-transparent"
					></div>
				</div>
				<label class="ml-4 flex items-center gap-2">
					<input
						type="checkbox"
						bind:checked={form.has_loadout}
						class="h-5 w-5 rounded border-2 border-yellow-500/30 bg-black/50 text-yellow-500"
					/>
					<span class="font-orbitron text-sm tracking-wide text-yellow-300 uppercase"
						>Has Loadout</span
					>
				</label>
			</div>

			{#if form.has_loadout}
				<!-- Current Components -->
				{#if form.components.length > 0}
					<div class="mb-4 space-y-2">
						{#each form.components as component, index}
							<div
								class="flex items-center justify-between rounded-lg border-2 border-yellow-500/20 bg-yellow-500/5 p-3"
							>
								<div class="flex items-center gap-3">
									<span class="font-rajdhani font-semibold text-yellow-300">{component.count}x</span
									>
									<span class="font-rajdhani text-yellow-300">{component.name}</span>
									<span class="font-rajdhani text-sm text-yellow-300/60">
										{component.category} - {component.class}
										{component.grade}
									</span>
								</div>
								<button
									type="button"
									onclick={() => removeComponent(index)}
									class="font-orbitron rounded border-2 border-red-500/30 px-3 py-1 text-sm tracking-wide text-red-300 uppercase transition-all hover:border-red-500/60 hover:bg-red-500/20"
								>
									Remove
								</button>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Add New Component -->
				<div class="grid grid-cols-1 gap-3 md:grid-cols-5">
					<div>
						<label
							for="comp_count"
							class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-yellow-300 uppercase"
						>
							Count
						</label>
						<input
							id="comp_count"
							type="number"
							bind:value={newComponent.count}
							min="1"
							class="font-rajdhani w-full rounded-lg border-2 border-yellow-500/30 bg-black/50 px-4 py-3 text-yellow-300 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
						/>
					</div>

					<div>
						<label
							for="comp_name"
							class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-yellow-300 uppercase"
						>
							Name
						</label>
						<input
							id="comp_name"
							type="text"
							bind:value={newComponent.name}
							placeholder="IonWave"
							class="font-rajdhani w-full rounded-lg border-2 border-yellow-500/30 bg-black/50 px-4 py-3 text-yellow-300 placeholder-yellow-300/30 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
						/>
					</div>

					<div>
						<label
							for="comp_category"
							class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-yellow-300 uppercase"
						>
							Category
						</label>
						<input
							id="comp_category"
							type="text"
							bind:value={newComponent.category}
							placeholder="Power Plant"
							class="font-rajdhani w-full rounded-lg border-2 border-yellow-500/30 bg-black/50 px-4 py-3 text-yellow-300 placeholder-yellow-300/30 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
						/>
					</div>

					<div>
						<label
							for="comp_class"
							class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-yellow-300 uppercase"
						>
							Class
						</label>
						<input
							id="comp_class"
							type="text"
							bind:value={newComponent.class}
							placeholder="Civilian"
							class="font-rajdhani w-full rounded-lg border-2 border-yellow-500/30 bg-black/50 px-4 py-3 text-yellow-300 placeholder-yellow-300/30 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
						/>
					</div>

					<div>
						<label
							for="comp_grade"
							class="font-orbitron mb-2 block text-sm font-medium tracking-wider text-yellow-300 uppercase"
						>
							Grade
						</label>
						<input
							id="comp_grade"
							type="text"
							bind:value={newComponent.grade}
							placeholder="A"
							class="font-rajdhani w-full rounded-lg border-2 border-yellow-500/30 bg-black/50 px-4 py-3 text-yellow-300 placeholder-yellow-300/30 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
						/>
					</div>
				</div>

				<button
					type="button"
					onclick={addComponent}
					class="font-orbitron mt-3 flex items-center gap-2 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/20 px-4 py-2 text-sm tracking-wide text-yellow-300 uppercase transition-all hover:scale-105 hover:border-yellow-500/60 hover:bg-yellow-500/30"
				>
					<span class="text-lg">➕</span>
					<span>Add Component</span>
				</button>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-4 sm:flex-row">
			<button
				type="submit"
				disabled={saving}
				class="font-orbitron flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-semibold tracking-wide text-white uppercase transition-all hover:scale-105 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if saving}
					<span class="animate-spin text-2xl">⚙️</span>
					<span>Saving...</span>
				{:else}
					<span class="text-2xl">{data.isNew ? '✅' : '💾'}</span>
					<span>{data.isNew ? 'Create Reward' : 'Save Changes'}</span>
				{/if}
			</button>

			<a
				href="/admin/rewards"
				class="font-orbitron flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-purple-500/30 px-6 py-4 text-lg tracking-wide text-purple-300 uppercase transition-all hover:scale-105 hover:border-purple-500/60 hover:bg-purple-500/10"
			>
				<span class="text-2xl">❌</span>
				<span>Cancel</span>
			</a>
		</div>
	</form>
</div>
