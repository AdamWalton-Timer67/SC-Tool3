<script lang="ts">
	import { uploadOptimizedImage } from '$lib/upload';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { goto } from '$app/navigation';
	import { createOrganizationSchema } from '$lib/schemas/organization.schema';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen = $bindable(false), onClose }: Props = $props();

	let name = $state('');
	let description = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let isUploading = $state(false);
	let isCreating = $state(false);
	let error = $state<string | null>(null);

	function handleImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleSubmit() {
		error = null;

		// Validation avec Zod
		const validationResult = createOrganizationSchema.safeParse({
			name,
			description: description || null,
			image_url: null // Sera défini après l'upload
		});

		if (!validationResult.success) {
			error = validationResult.error.issues[0].message;
			return;
		}

		isCreating = true;

		try {
			let imageUrl: string | null = null;

			// Upload image if provided
			if (imageFile) {
				isUploading = true;
				const uploadedUrls = await uploadOptimizedImage(imageFile);
				imageUrl = uploadedUrls.original;
				isUploading = false;
			}

			// Create organization (waits for trigger to complete)
			const organization = await organizationsStore.createOrganization(
				validationResult.data.name,
				validationResult.data.description || undefined,
				imageUrl || undefined
			);

			// Close dialog and navigate to organization page
			onClose();
			goto(`/organizations/${organization.slug}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create organization';
			console.error('Error creating organization:', err);
		} finally {
			isCreating = false;
			isUploading = false;
		}
	}

	function handleClose() {
		if (!isCreating) {
			// Reset form
			name = '';
			description = '';
			imageFile = null;
			imagePreview = null;
			error = null;
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		onclick={handleClose}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Close dialog"
	>
		<!-- Modal Content -->
		<div
			class="relative w-full max-w-2xl rounded-xl border border-yellow-500/30 bg-slate-900 p-8 shadow-2xl shadow-yellow-500/20"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Close Button -->
			<button
				type="button"
				onclick={handleClose}
				disabled={isCreating}
				class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Title -->
			<h2 class="font-orbitron mb-6 text-2xl font-bold text-yellow-400">Create Organization</h2>

			<!-- Form -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				<!-- Name Input -->
				<div>
					<label for="org-name" class="mb-2 block text-sm font-semibold text-gray-300">
						Name <span class="text-red-400">*</span>
					</label>
					<input
						id="org-name"
						type="text"
						bind:value={name}
						placeholder="Enter organization name"
						maxlength={100}
						required
						disabled={isCreating}
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-cyan-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
					/>
					<p class="mt-1 text-xs text-gray-500">{name.length}/100 characters</p>
				</div>

				<!-- Description Input -->
				<div>
					<label for="org-description" class="mb-2 block text-sm font-semibold text-gray-300">
						Description
					</label>
					<textarea
						id="org-description"
						bind:value={description}
						placeholder="Describe your organization..."
						maxlength={500}
						rows={4}
						disabled={isCreating}
						class="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-cyan-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
					></textarea>
					<p class="mt-1 text-xs text-gray-500">{description.length}/500 characters</p>
				</div>

				<!-- Image Upload -->
				<div>
					<label for="org-image" class="mb-2 block text-sm font-semibold text-gray-300">
						Organization Image
					</label>

					{#if imagePreview}
						<div class="mb-4">
							<img
								src={imagePreview}
								alt="Preview"
								class="h-48 w-full rounded-lg object-cover"
							/>
							<button
								type="button"
								onclick={() => {
									imageFile = null;
									imagePreview = null;
								}}
								disabled={isCreating}
								class="mt-2 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
							>
								Remove image
							</button>
						</div>
					{:else}
						<div
							class="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/30 bg-slate-800/30"
						>
							<label
								for="org-image"
								class="flex cursor-pointer flex-col items-center gap-2 text-gray-400 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<span class="text-sm">Click to upload image</span>
							</label>
						</div>
					{/if}

					<input
						id="org-image"
						type="file"
						accept="image/*"
						onchange={handleImageChange}
						disabled={isCreating}
						class="hidden"
					/>
					<p class="mt-1 text-xs text-gray-500">Recommended: 1200x600px, JPG or PNG</p>
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
						{error}
					</div>
				{/if}

				<!-- Buttons -->
				<div class="flex gap-4">
					<button
						type="button"
						onclick={handleClose}
						disabled={isCreating}
						class="flex-1 rounded-lg border border-gray-500/30 bg-gray-500/10 px-6 py-3 font-semibold text-gray-300 transition-all hover:border-gray-500/50 hover:bg-gray-500/20 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isCreating || isUploading}
						class="flex-1 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-6 py-3 font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isUploading}
							Uploading...
						{:else if isCreating}
							Creating...
						{:else}
							Create Organization
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
