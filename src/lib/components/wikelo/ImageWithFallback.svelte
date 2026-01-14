<script lang="ts">
	interface Props {
		src?: string;
		alt: string;
		class?: string;
		itemName?: string;
		priority?: number; // Pour compatibilité
		eager?: boolean; // Pour compatibilité
		width?: number; // Pour CLS
		height?: number; // Pour CLS
	}

	let {
		src,
		alt,
		class: className = 'w-32 h-32 object-contain',
		itemName,
		priority = 999,
		eager = false,
		width,
		height
	}: Props = $props();

	let imageError = $state(false);
	let imageLoaded = $state(false);
	let currentSrc = $state(src);
	let currentVariantIndex = $state(0);
	let imgElement = $state<HTMLImageElement | null>(null);
	let maxRetries = 3; // Limiter le nombre de tentatives
	let isRetrying = $state(false); // Éviter les boucles infinies

	// Essayer différentes variantes d'URL
	const urlVariants = $derived.by(() => {
		if (!src) return [];

		const variants: string[] = [];

		// 1. URL originale
		variants.push(src);

		// 2. Ajouter .webp à la fin si ce n'est pas déjà le cas
		if (!src.endsWith('.webp')) {
			variants.push(`${src}.webp`);
		}

		// 3. Remplacer /thumb/ par /images/ et supprimer la taille
		if (src.includes('/thumb/')) {
			const fullSizeUrl = src.replace('/thumb/', '/').replace(/\/\d+px-[^/]+$/, function (match) {
				// Extraire le nom de fichier sans la taille
				return match.replace(/^\d+px-/, '');
			});
			variants.push(fullSizeUrl);
			if (!fullSizeUrl.endsWith('.webp')) {
				variants.push(`${fullSizeUrl}.webp`);
			}
		}

		// 4. URL media.starcitizen.tools sans thumb
		if (src.includes('starcitizen.tools')) {
			const match = src.match(/\/([^/]+)$/);
			if (match) {
				const filename = match[1].replace(/^\d+px-/, '');
				variants.push(`https://media.starcitizen.tools/${filename}`);
			}
		}

		return variants;
	});

	function handleImageError() {
		// Éviter les boucles infinies
		if (isRetrying) {
			imageError = true;
			return;
		}

		currentVariantIndex++;

		if (currentVariantIndex < urlVariants.length && currentVariantIndex < maxRetries) {
			isRetrying = true;
			currentSrc = urlVariants[currentVariantIndex];
			imageError = false;
			imageLoaded = false;

			// Reset le flag après un court délai
			setTimeout(() => {
				isRetrying = false;
			}, 100);
		} else {
			imageError = true;
			isRetrying = false;
		}
	}

	function handleImageLoad() {
		imageLoaded = true;
		imageError = false;
	}

	// Réinitialiser à chaque changement de src
	$effect(() => {
		currentSrc = src;
		currentVariantIndex = 0;
		imageError = false;
		isRetrying = false;

		// Si l'image est déjà dans le cache et complètement chargée, on la marque comme chargée immédiatement
		if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
			imageLoaded = true;
		} else {
			imageLoaded = false;
		}
	});
</script>

{#if imageError || !currentSrc}
	<!-- Placeholder when image fails to load - Style similaire aux ingredients -->
	<div class="relative {className}">
		<!-- Glitch layers -->
		<div class="absolute inset-0 bg-cyan-400/10 blur-md"></div>
		<div class="absolute inset-0 bg-purple-500/5 blur-lg"></div>
		
		<!-- Bordure glitch -->
		<div class="relative border-2 border-cyan-400/30 rounded-lg p-2 bg-slate-900/90 backdrop-blur-sm shadow-md shadow-cyan-400/20 animate-glitch-border h-full">
			<div class="flex flex-col items-center justify-center h-full text-center">
				<div class="text-4xl mb-2 opacity-50">📦</div>
				<div class="text-xs text-cyan-400/70 font-rajdhani uppercase tracking-wider px-2">
					{itemName || alt || 'Image'}
				</div>
				<div class="text-xs text-gray-500 mt-1">No Image</div>
			</div>
		</div>
	</div>
{:else}
	<div class="relative {className}">
		<!-- Loading spinner while image loads -->
		{#if !imageLoaded}
			<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-800">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
			</div>
		{/if}

		<img
			bind:this={imgElement}
			src={currentSrc}
			{alt}
			{width}
			{height}
			class="h-full w-full object-contain {imageLoaded
				? 'opacity-100'
				: 'opacity-0'} transition-opacity duration-300"
			onerror={handleImageError}
			onload={handleImageLoad}
			loading="lazy"
		/>
	</div>
{/if}
