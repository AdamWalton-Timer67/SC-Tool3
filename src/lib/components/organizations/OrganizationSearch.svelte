<script lang="ts">
	interface Props {
		value: string;
		oninput: (value: string) => void;
		placeholder?: string;
	}

	let { value = $bindable(''), oninput, placeholder = 'Search organizations...' }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	}

	function clearSearch() {
		value = '';
		oninput?.('');
	}
</script>

<div class="relative">
	<!-- Search Input -->
	<input
		type="text"
		{value}
		oninput={handleInput}
		{placeholder}
		class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 pl-12 text-sm text-white placeholder-gray-400 transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none sm:text-base"
	/>

	<!-- Search Icon (emoji) -->
	<span class="absolute top-1/2 left-4 -translate-y-1/2 text-xl">🔍</span>

	<!-- Clear Button -->
	{#if value}
		<button
			type="button"
			onclick={clearSearch}
			class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
			aria-label="Clear search"
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
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div>
