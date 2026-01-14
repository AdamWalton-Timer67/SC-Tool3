<script lang="ts">
	import { uploadOptimizedImage } from '$lib/upload';

	interface Props {
		onUpload: (urls: { thumbnail: string; medium: string; original: string }) => void;
		currentUrl?: string;
		label?: string;
	}

	let { onUpload, currentUrl, label = 'Image' }: Props = $props();

	let isUploading = $state(false);
	let uploadProgress = $state<{
		stage: 'optimizing' | 'uploading' | 'done';
		percent?: number;
	} | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);
	let previewUrl = $state<string | null>(currentUrl || null);

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Vérifier le type de fichier
		if (!file.type.startsWith('image/')) {
			alert('Veuillez sélectionner une image');
			return;
		}

		isUploading = true;
		uploadProgress = { stage: 'optimizing' };

		try {
			// Créer une preview locale
			previewUrl = URL.createObjectURL(file);

			// Optimiser et uploader
			uploadProgress = { stage: 'uploading', percent: 0 };

			const urls = await uploadOptimizedImage(file);

			uploadProgress = { stage: 'done' };
			previewUrl = urls.medium; // Utiliser la version medium pour la preview

			// Notifier le parent
			onUpload(urls);

			// Reset après 1 seconde
			setTimeout(() => {
				uploadProgress = null;
			}, 1000);
		} catch (error) {
			console.error('Upload failed:', error);
			alert("Échec de l'upload: " + (error as Error).message);
			uploadProgress = null;
		} finally {
			isUploading = false;
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="space-y-2">
	<div class="block text-sm font-medium text-gray-300">
		{label}
	</div>

	<div class="flex items-start gap-4">
		<!-- Preview -->
		{#if previewUrl}
			<div class="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-800">
				<img src={previewUrl} alt="Preview" class="h-full w-full object-contain" />
				{#if isUploading}
					<div class="absolute inset-0 flex items-center justify-center bg-black/70">
						<div class="text-center text-white">
							{#if uploadProgress?.stage === 'optimizing'}
								<div
									class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white"
								></div>
								<div class="text-xs">Optimisation...</div>
							{:else if uploadProgress?.stage === 'uploading'}
								<div
									class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white"
								></div>
								<div class="text-xs">Upload...</div>
							{:else if uploadProgress?.stage === 'done'}
								<div class="mb-1 text-2xl">✓</div>
								<div class="text-xs">Terminé!</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Upload button -->
		<div class="flex-1">
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				onchange={handleFileChange}
				disabled={isUploading}
				class="hidden"
			/>

			<button
				type="button"
				onclick={triggerFileInput}
				disabled={isUploading}
				class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
			>
				{previewUrl ? "Changer l'image" : 'Sélectionner une image'}
			</button>

			<div class="mt-2 text-xs text-gray-400">
				<div>L'image sera automatiquement optimisée en WebP</div>
				<div>
					3 résolutions seront créées: thumbnail (200px), medium (600px), et original (1200px)
				</div>
			</div>
		</div>
	</div>
</div>
