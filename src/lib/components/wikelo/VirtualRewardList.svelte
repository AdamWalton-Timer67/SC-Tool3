<script lang="ts">
	import { onMount } from 'svelte';
	import type { Reward } from '$lib/stores/wikelo.svelte';
	import RewardCard from './RewardCard.svelte';

	interface Props {
		rewards: Reward[];
		viewMode?: 'grid' | 'list';
		onLoginRequired?: () => void;
	}

	let { rewards, viewMode = 'grid', onLoginRequired }: Props = $props();

	let scrollTop = $state(0);
	let containerElement: HTMLDivElement | null = null;

	// Configuration basée sur le mode d'affichage
	const config = $derived({
		itemHeight: viewMode === 'list' ? 200 : 650, // Hauteur approximative des cartes
		overscan: 2, // Nombre d'items à pré-charger au-dessus/en-dessous
		windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800
	});

	// Calculer les indices visibles
	const visibleRange = $derived.by(() => {
		const start = Math.max(0, Math.floor(scrollTop / config.itemHeight) - config.overscan);
		const visibleCount = Math.ceil(config.windowHeight / config.itemHeight);
		const end = Math.min(rewards.length, start + visibleCount + config.overscan * 2);

		return { start, end };
	});

	// Rewards visibles
	const visibleRewards = $derived.by(() => {
		const { start, end } = visibleRange;
		return rewards.slice(start, end).map((reward, index) => ({
			reward,
			index: start + index,
			// Pour le mode grille, on affiche par rangées de 2
			offset:
				viewMode === 'grid'
					? Math.floor((start + index) / 2) * config.itemHeight
					: (start + index) * config.itemHeight
		}));
	});

	// Hauteur totale
	const totalHeight = $derived(
		viewMode === 'grid'
			? Math.ceil(rewards.length / 2) * config.itemHeight
			: rewards.length * config.itemHeight
	);

	function handleScroll(e: Event) {
		scrollTop = (e.target as HTMLDivElement).scrollTop;
	}

	onMount(() => {
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

<div bind:this={containerElement} class="h-full overflow-y-auto" role="list">
	<!-- Mode Virtual Scrolling -->
	{#if rewards.length > 20}
		<div style="height: {totalHeight}px; position: relative;">
			{#if viewMode === 'grid'}
				<!-- Grille virtuelle (2 colonnes) -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{#each visibleRewards as { reward, index } (reward.id)}
						<div style="grid-row: {Math.floor(index / 2) + 1}; grid-column: {(index % 2) + 1};">
							<RewardCard {reward} {onLoginRequired} priority={index < 6 ? index : 999} />
						</div>
					{/each}
				</div>
			{:else}
				<!-- Liste virtuelle -->
				<div class="space-y-4">
					{#each visibleRewards as { reward, index, offset } (reward.id)}
						<div style="position: absolute; top: {offset}px; left: 0; right: 0;">
							<RewardCard {reward} {onLoginRequired} priority={index < 6 ? index : 999} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Mode normal pour petit nombre d'items -->
		<div class={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : 'space-y-4'}>
			{#each rewards as reward, index (reward.id)}
				<RewardCard {reward} {onLoginRequired} priority={index < 6 ? index : 999} />
			{/each}
		</div>
	{/if}
</div>
