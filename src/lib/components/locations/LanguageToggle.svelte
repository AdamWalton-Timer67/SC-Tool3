<script lang="ts">
	interface Props {
		currentLang: 'en' | 'fr';
		onLangChange: (lang: 'en' | 'fr') => void;
		variant?: 'cyan' | 'red';
	}

	let { currentLang = $bindable(), onLangChange }: Props = $props();

	$effect(() => {
		if (currentLang !== 'en') {
			currentLang = 'en';
			onLangChange('en');
		}
	});
</script>

<div class="language-toggle flex gap-2">
	<span class="rounded-lg border-2 border-cyan-500 bg-cyan-500/90 px-4 py-3 font-bold text-slate-900 shadow-lg shadow-cyan-500/50">
		EN
	</span>
</div>
