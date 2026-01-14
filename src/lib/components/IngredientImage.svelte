<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';

	interface Props {
		src: string;
		alt: string;
		class?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { src, alt, class: className = '', size = 'md' }: Props = $props();

	let hasError = $state(false);

	const sizeClasses = {
		sm: 'h-16 w-16',
		md: 'h-20 w-20',
		lg: 'h-32 w-32'
	};

	function handleError() {
		hasError = true;
	}
</script>

<div
	class="relative overflow-hidden rounded-xl border-2 border-purple-400/30 bg-linear-to-br from-slate-800 to-slate-900 shadow-lg shadow-purple-400/20 {sizeClasses[size]} {className}"
>
	{#if !hasError}
		<img
			{src}
			{alt}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
			onerror={handleError}
		/>
	{:else}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
		>
			<div class="mb-1 text-3xl opacity-40">⚠</div>
			<div class="font-orbitron text-[8px] uppercase tracking-widest text-purple-400/60">
				Data Lost
			</div>
		</div>
	{/if}
</div>
