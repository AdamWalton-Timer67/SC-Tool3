<script lang="ts">
	import { onMount } from 'svelte';
	import { imageCache } from '$lib/utils/imageCache';

	interface Props {
		src: string;
		alt: string;
		class?: string;
		/** URL de la version thumbnail (petite résolution) */
		thumbnailSrc?: string;
		/** URL de la version medium (résolution moyenne) */
		mediumSrc?: string;
		/** Charger immédiatement sans lazy loading */
		eager?: boolean;
		/** Priorité de chargement (plus petit = plus prioritaire) */
		priority?: number;
		/** Nom de l'item pour le fallback */
		itemName?: string;
		/** Largeur de l'image (pour CLS) */
		width?: number;
		/** Hauteur de l'image (pour CLS) */
		height?: number;
	}

	let {
		src,
		alt,
		class: className = 'w-full h-full object-contain',
		thumbnailSrc,
		mediumSrc,
		eager = false,
		priority = 999,
		itemName,
		width,
		height
	}: Props = $props();

	let imgElement = $state<HTMLImageElement | null>(null);
	let currentSrc = $state<string | null>(null);
	let isLoading = $state(true);
	let hasError = $state(false);
	let observer: IntersectionObserver | null = null;

	// Déterminer quelle source utiliser en fonction de la taille de l'élément
	function getBestSource(targetWidth: number): string {
		// Ajouter un buffer de 20% pour éviter le blur et améliorer la qualité
		const bufferedWidth = targetWidth * 1.2;

		// Si width < 250px, utiliser thumbnail (petite image optimisée)
		if (bufferedWidth < 250 && thumbnailSrc) {
			return thumbnailSrc;
		}
		// Si width < 700px, utiliser medium (image moyenne)
		if (bufferedWidth < 700 && mediumSrc) {
			return mediumSrc;
		}
		// Sinon utiliser l'original
		return src;
	}

	async function loadImage() {
		if (!imgElement || hasError) return;

		try {
			// Déterminer la meilleure source
			const rect = imgElement.getBoundingClientRect();
			const bestSrc = getBestSource(rect.width || 400);

			// Charger depuis le cache ou télécharger
			const cachedUrl = await imageCache.load(bestSrc);
			currentSrc = cachedUrl;
			isLoading = false;
		} catch (error) {
			console.error('Failed to load image:', error);
			hasError = true;
			isLoading = false;
		}
	}

	function handleError() {
		hasError = true;
		isLoading = false;
	}

	onMount(() => {
		if (!imgElement) return;

		// Si eager, charger immédiatement
		if (eager) {
			loadImage();
			return;
		}

		// Utiliser IntersectionObserver pour lazy loading
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !currentSrc) {
						loadImage();
						observer?.disconnect();
					}
				});
			},
			{
				rootMargin: '100px',
				threshold: 0.01
			}
		);

		observer.observe(imgElement);

		return () => {
			observer?.disconnect();
		};
	});

	// Recharger si la source change
	$effect(() => {
		if (src) {
			currentSrc = null;
			isLoading = true;
			hasError = false;
			if (eager || imgElement?.getBoundingClientRect().top! < window.innerHeight + 100) {
				loadImage();
			}
		}
	});
</script>

{#if hasError}
	<!-- Fallback placeholder -->
	<div class="flex items-center justify-center rounded-lg bg-gray-800 {className}">
		<div class="text-center text-gray-400">
			<div class="mb-2 text-2xl">📦</div>
			<div class="text-xs">
				{itemName || alt || 'Image'}
			</div>
		</div>
	</div>
{:else}
	<div class="relative {className}">
		{#if isLoading && !currentSrc}
			<!-- Loading spinner -->
			<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-800">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
			</div>
		{/if}

		<img
			bind:this={imgElement}
			src={currentSrc ||
				'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'}
			{alt}
			{width}
			{height}
			class="h-full w-full object-contain {currentSrc
				? 'opacity-100'
				: 'opacity-0'} transition-opacity duration-300"
			onerror={handleError}
			loading={eager ? 'eager' : 'lazy'}
		/>
	</div>
{/if}
