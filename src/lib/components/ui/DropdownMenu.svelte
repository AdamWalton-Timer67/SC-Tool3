<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		align?: 'left' | 'right';
		children?: import('svelte').Snippet;
		trigger?: import('svelte').Snippet;
	}

	let { isOpen = $bindable(false), onClose, align = 'right', children, trigger }: Props = $props();

	let menuRef: HTMLDivElement | null = $state(null);

	function handleClickOutside(event: MouseEvent) {
		if (isOpen && menuRef && !menuRef.contains(event.target as Node)) {
			onClose();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const alignmentClasses = {
		left: 'left-0',
		right: 'right-0'
	};
</script>

<div class="relative" bind:this={menuRef}>
	<!-- Trigger -->
	{#if trigger}
		{@render trigger()}
	{/if}

	<!-- Menu -->
	{#if isOpen}
		<div
			class="absolute top-full z-10 mt-2 w-56 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900/95 shadow-xl shadow-cyan-500/10 backdrop-blur-sm {alignmentClasses[align]}"
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
