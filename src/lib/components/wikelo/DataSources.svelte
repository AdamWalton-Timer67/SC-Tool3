<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Sources de Données'
				}
			: {
					title: 'Data Sources'
				}
	);
</script>

<div class="border-t border-white/10 pt-6">
	<h3 class="mb-3 flex items-center justify-center gap-2 text-center font-semibold text-gray-300">
		<span class="text-lg">📊</span>
		{t.title}
	</h3>
	<div class="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-6">
		<a
			href="https://docs.google.com/spreadsheets/u/0/d/1ji0q_pp6iW35RG1YyFEsv-lsmZOaCStJXGdIEdLLwhM/htmlview#gid=481073732"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">📋</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>Wikelo Sheet</span
			>
		</a>

		<a
			href="https://starcitizen.tools/"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">📖</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>SC Tools</span
			>
		</a>

		<a
			href="https://star-citizen.wiki/"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">🌐</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>SC Wiki</span
			>
		</a>

		<a
			href="https://starcitizen.fandom.com/"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">📚</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>SC Fandom</span
			>
		</a>

		<a
			href="https://uexcorp.space/"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">🚀</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>UEX Corp</span
			>
		</a>

		<a
			href="https://sc-market.space/"
			target="_blank"
			class="group flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50 hover:bg-white/10"
		>
			<span class="text-xl transition-transform group-hover:scale-110">🛒</span>
			<span
				class="text-center text-[10px] leading-tight text-gray-400 transition-colors group-hover:text-cyan-400"
				>SC Market</span
			>
		</a>
	</div>
</div>
