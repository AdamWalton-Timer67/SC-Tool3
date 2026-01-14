<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { uploadOptimizedImage } from '$lib/upload';
	import AuthButton from '$lib/components/AuthButton.svelte';

	let name = $state('');
	let description = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let isUploading = $state(false);
	let isCreating = $state(false);
	let error = $state<string | null>(null);

	onMount(() => {
		// Redirect if not logged in
		if (!organizationsStore.currentUser) {
			goto('/organizations');
		}
	});

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

		// Validation
		if (!name.trim()) {
			error = 'Name is required';
			return;
		}

		if (name.length < 3) {
			error = 'Name must be at least 3 characters';
			return;
		}

		if (name.length > 100) {
			error = 'Name must not exceed 100 characters';
			return;
		}

		if (description.length > 500) {
			error = 'Description must not exceed 500 characters';
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
				name.trim(),
				description.trim() || undefined,
				imageUrl || undefined
			);

			// Navigate to organization page
			goto(`/organizations/${organization.slug}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create organization';
			console.error('Error creating organization:', err);
		} finally {
			isCreating = false;
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Create Organization - Star Citizen Wikelo Emporium Tracker</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 pb-20">
	<!-- Header -->
	<div class="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
		<div class="container mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<!-- Back Button -->
				<a
					href="/organizations"
					class="rounded-lg border border-cyan-500/30 bg-slate-900/50 p-2 text-cyan-400 transition-all hover:border-cyan-500/70 hover:bg-slate-900 hover:text-cyan-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
				</a>

				<!-- Auth Button -->
				<AuthButton />
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-2xl">
			<!-- Title -->
			<div class="mb-8 text-center">
				<h1 class="font-orbitron mb-2 text-3xl font-bold text-yellow-400 md:text-4xl">
					Create Organization
				</h1>
				<p class="text-gray-400">Build your community in the Star Citizen universe</p>
			</div>

			<!-- Form -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="rounded-xl border border-yellow-500/30 bg-slate-900/85 p-8 backdrop-blur-xl"
			>
				<div class="space-y-6">
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
						<a
							href="/organizations"
							class="flex-1 rounded-lg border border-gray-500/30 bg-gray-500/10 px-6 py-3 text-center font-semibold text-gray-300 transition-all hover:border-gray-500/50 hover:bg-gray-500/20"
						>
							Cancel
						</a>
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
				</div>
			</form>
		</div>
	</div>
</div>
