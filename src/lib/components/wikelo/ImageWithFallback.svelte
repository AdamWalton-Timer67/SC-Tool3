<script lang="ts">
	import { getDefaultImageUrl, normalizeImageUrl } from '$lib/utils/imageUrl';

	interface Props {
		src?: string;
		alt: string;
		class?: string;
		itemName?: string;
		priority?: number;
		eager?: boolean;
		width?: number;
		height?: number;
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
	let currentVariantIndex = $state(0);
	let imgElement = $state<HTMLImageElement | null>(null);

	const defaultImage = getDefaultImageUrl();

	const urlVariants = $derived.by(() => {
		const variants = new Set<string>();
		const normalized = normalizeImageUrl(src);

		if (normalized) {
			variants.add(normalized);

			if (!normalized.endsWith('.webp')) {
				variants.add(`${normalized}.webp`);
			}

			if (normalized.includes('/thumb/')) {
				const fullSizeUrl = normalized.replace('/thumb/', '/').replace(/\/\d+px-([^/]+)$/i, '/$1');
				variants.add(fullSizeUrl);
				if (!fullSizeUrl.endsWith('.webp')) {
					variants.add(`${fullSizeUrl}.webp`);
				}
			}
		}

		variants.add(defaultImage);
		return Array.from(variants);
	});

	const currentSrc = $derived(urlVariants[currentVariantIndex]);

	function handleImageError() {
		if (currentVariantIndex < urlVariants.length - 1) {
			currentVariantIndex += 1;
			imageLoaded = false;
			imageError = false;
			return;
		}

		imageError = true;
	}

	function handleImageLoad() {
		if (imgElement && imgElement.naturalWidth === 0) {
			handleImageError();
			return;
		}
		imageLoaded = true;
		imageError = false;
	}

	$effect(() => {
		src;
		currentVariantIndex = 0;
		imageError = false;
		imageLoaded = false;
	});
</script>

{#if imageError || !currentSrc}
	<div class="relative {className}">
		<div class="absolute inset-0 bg-cyan-400/10 blur-md"></div>
		<div class="absolute inset-0 bg-purple-500/5 blur-lg"></div>
		<div
			class="animate-glitch-border relative h-full rounded-lg border-2 border-cyan-400/30 bg-slate-900/90 p-2 shadow-md shadow-cyan-400/20 backdrop-blur-sm"
		>
			<div class="flex h-full flex-col items-center justify-center text-center">
				<div class="mb-2 text-4xl opacity-50">📦</div>
				<div class="font-rajdhani px-2 text-xs tracking-wider text-cyan-400/70 uppercase">
					{itemName || alt || 'Image'}
				</div>
				<div class="mt-1 text-xs text-gray-500">No Image</div>
			</div>
		</div>
	</div>
{:else}
	<div class="relative {className}">
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
			loading={eager || priority <= 2 ? 'eager' : 'lazy'}
		/>
	</div>
{/if}
