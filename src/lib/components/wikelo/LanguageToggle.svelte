<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
</script>

<div class="language-toggle flex gap-2">
	<button
		class="cursor-pointer rounded-lg border-2 px-4 py-3 font-bold transition-all hover:scale-110 {wikeloStore.currentLang ===
		'fr'
			? 'border-cyan-500 bg-cyan-500/90 text-slate-900 shadow-lg shadow-cyan-500/50'
			: 'border-cyan-500/50 bg-slate-900/80 text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40'}"
		onclick={() => (wikeloStore.currentLang = 'fr')}
	>
		FR
	</button>

	<button
		class="cursor-pointer rounded-lg border-2 px-4 py-3 font-bold transition-all hover:scale-110 {wikeloStore.currentLang ===
		'en'
			? 'border-cyan-500 bg-cyan-500/90 text-slate-900 shadow-lg shadow-cyan-500/50'
			: 'border-cyan-500/50 bg-slate-900/80 text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40'}"
		onclick={() => (wikeloStore.currentLang = 'en')}
	>
		EN
	</button>
</div>
