<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { captureEvent } from '$lib/analytics';

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Information manquante ?',
					description:
						'Vous savez comment obtenir cet ingrédient ou où le trouver ? Aidez la communauté en partageant vos connaissances !',
					contactEmail: 'Contacter par email',
					emailAddress: 'contact@star-citizen-wikelo-tools.fr'
				}
			: {
					title: 'Missing information?',
					description:
						'Do you know how to obtain this ingredient or where to find it? Help the community by sharing your knowledge!',
					contactEmail: 'Contact via email',
					emailAddress: 'contact@star-citizen-wikelo-tools.fr'
				}
	);

	function handleEmailClick() {
		captureEvent('contribute_help_email_clicked', {
			timestamp: new Date().toISOString(),
			lang: wikeloStore.currentLang
		});
	}
</script>

<div
	class="rounded-xl border-2 border-yellow-500/30 bg-linear-to-br from-yellow-500/10 to-orange-500/10 p-4 shadow-lg sm:p-6"
>
	<!-- Title with icon -->
	<div class="mb-3 flex items-center gap-3">
		<span class="animate-pulse text-3xl">❓</span>
		<h3
			class="font-orbitron text-sm font-bold tracking-wider text-yellow-400 uppercase sm:text-base"
		>
			{t.title}
		</h3>
	</div>

	<!-- Description -->
	<p class="mb-4 text-xs leading-relaxed text-gray-300 sm:text-sm">
		{t.description}
	</p>

	<!-- Action button -->
	<div>
		<!-- Email button -->
		<a
			href="mailto:{t.emailAddress}"
			onclick={handleEmailClick}
			class="group flex items-center justify-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-4 py-3 text-sm font-bold text-cyan-400 transition-all hover:border-cyan-500/70 hover:bg-cyan-500/30"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform group-hover:scale-110"
			>
				<rect width="20" height="16" x="2" y="4" rx="2" />
				<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
			</svg>
			<span class="font-orbitron">{t.contactEmail}</span>
		</a>
	</div>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
