<script lang="ts">
	import { onMount } from 'svelte';
	import { imageQueue } from '$lib/utils/imageQueue';

	interface Props {
		src: string;
		alt: string;
		class?: string;
		placeholder?: string;
		loading?: 'lazy' | 'eager';
		priority?: number; // Plus petit = plus prioritaire (ordre d'apparition)
		eager?: boolean; // Charger immédiatement sans attendre le viewport
	}

	let {
		src,
		alt,
		class: className = '',
		placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3C/svg%3E',
		loading = 'lazy',
		priority = 999,
		eager = false
	}: Props = $props();

	let imgElement: HTMLImageElement | undefined = $state();
	let isLoaded = $state(false);
	let currentSrc = $state(placeholder);
	let hasError = $state(false);
	let observer: IntersectionObserver | null = null;

	onMount(() => {
		if (!imgElement) return;

		// Si eager, charger immédiatement
		if (eager) {
			loadImage();
			return;
		}

		// Utiliser IntersectionObserver pour détecter quand l'image entre dans le viewport
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLoaded) {
						loadImage();
						observer?.disconnect();
					}
				});
			},
			{
				// Commencer à charger un peu avant que l'image soit visible
				rootMargin: '100px',
				threshold: 0.01
			}
		);

		observer.observe(imgElement);

		return () => {
			observer?.disconnect();
		};
	});

	async function loadImage() {
		if (isLoaded || hasError) return;

		// Ajouter à la file d'attente avec la priorité
		const success = await imageQueue.add(src, priority);

		if (success) {
			currentSrc = src;
			isLoaded = true;
		} else {
			hasError = true;
			console.error(`Failed to load image: ${src}`);
		}
	}

	function handleError() {
		hasError = true;
	}
</script>

<img
	bind:this={imgElement}
	src={currentSrc}
	{alt}
	class={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
	{loading}
	onerror={handleError}
	style={hasError ? 'filter: grayscale(100%);' : ''}
/>
