<script lang="ts" generics="T">
	import { onMount, tick } from 'svelte';

	interface Props<T> {
		items: T[];
		itemHeight: number;
		windowHeight?: number;
		overscan?: number;
		class?: string;
	}

	let {
		items,
		itemHeight,
		windowHeight = 800,
		overscan = 3,
		class: className = ''
	}: Props<T> = $props();

	let scrollTop = $state(0);
	let containerElement: HTMLDivElement | null = null;

	// Calculer les indices visibles
	const visibleRange = $derived.by(() => {
		const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
		const visibleCount = Math.ceil(windowHeight / itemHeight);
		const end = Math.min(items.length, start + visibleCount + overscan * 2);

		return { start, end };
	});

	// Items visibles avec leur offset
	const visibleItems = $derived.by(() => {
		const { start, end } = visibleRange;
		return items.slice(start, end).map((item, index) => ({
			item,
			index: start + index,
			offset: (start + index) * itemHeight
		}));
	});

	// Hauteur totale du contenu
	const totalHeight = $derived(items.length * itemHeight);

	function handleScroll(e: Event) {
		scrollTop = (e.target as HTMLDivElement).scrollTop;
	}

	onMount(() => {
		// Optimiser le scroll avec requestAnimationFrame
		let ticking = false;

		const optimizedScroll = (e: Event) => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					handleScroll(e);
					ticking = false;
				});
				ticking = true;
			}
		};

		containerElement?.addEventListener('scroll', optimizedScroll, { passive: true });

		return () => {
			containerElement?.removeEventListener('scroll', optimizedScroll);
		};
	});
</script>

<div
	bind:this={containerElement}
	class="overflow-y-auto {className}"
	style="height: {windowHeight}px;"
	role="list"
>
	<div style="height: {totalHeight}px; position: relative;">
		{#each visibleItems as { item, index, offset } (index)}
			<div
				style="position: absolute; top: {offset}px; left: 0; right: 0; height: {itemHeight}px;"
				role="listitem"
			>
				{@render children?.(item, index)}
			</div>
		{/each}
	</div>
</div>

{#snippet children(item: T, index: number)}
	<!-- Default slot pour les items -->
{/snippet}
