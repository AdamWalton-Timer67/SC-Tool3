<script lang="ts">
	interface Props {
		currentLang: 'en' | 'fr';
		onLangChange: (lang: 'en' | 'fr') => void;
		variant?: 'cyan' | 'red';
	}

	let { currentLang = $bindable(), onLangChange, variant = 'cyan' }: Props = $props();

	const colors = {
		cyan: {
			active: 'bg-cyan-500/90 border-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50',
			inactive:
				'bg-slate-900/80 hover:bg-slate-800/90 border-cyan-500/50 hover:border-cyan-500/70 text-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 backdrop-blur-sm'
		},
		red: {
			active: 'bg-red-500/90 border-red-500 text-white shadow-lg shadow-red-500/50',
			inactive:
				'bg-slate-900/80 hover:bg-slate-800/90 border-red-500/50 hover:border-red-500/70 text-red-400 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 backdrop-blur-sm'
		}
	};
</script>

<div class="language-toggle flex gap-2">
	<button
		class="cursor-pointer rounded-lg border-2 px-4 py-3 font-bold transition-all hover:scale-110 {currentLang ===
		'fr'
			? colors[variant].active
			: colors[variant].inactive}"
		onclick={() => onLangChange('fr')}
	>
		FR
	</button>

	<button
		class="cursor-pointer rounded-lg border-2 px-4 py-3 font-bold transition-all hover:scale-110 {currentLang ===
		'en'
			? colors[variant].active
			: colors[variant].inactive}"
		onclick={() => onLangChange('en')}
	>
		EN
	</button>
</div>
