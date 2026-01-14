<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import posthog from 'posthog-js';

	// State for hiding/showing the contact info - Hidden by default
	let isHidden = $state(true);

	// Check if IntroMission is hidden to calculate position
	let introMissionHidden = $state(false);

	// Check if we're on /wikelo page
	let isWikeloPage = $derived(page.url.pathname === '/wikelo');

	// Load hidden states from localStorage
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('contactInfoHidden');
			// If no stored value, default to hidden (true)
			isHidden = stored === null ? true : stored === 'true';

			// Check IntroMission state
			const introStored = localStorage.getItem('introMissionHidden');
			introMissionHidden = introStored === 'true';
		}
	});

	// Listen to localStorage changes for IntroMission (only relevant on /wikelo)
	$effect(() => {
		if (browser) {
			const handleStorageChange = () => {
				const introStored = localStorage.getItem('introMissionHidden');
				introMissionHidden = introStored === 'true';
			};

			window.addEventListener('storage', handleStorageChange);

			// Also check periodically (for same-tab changes)
			const interval = setInterval(() => {
				const introStored = localStorage.getItem('introMissionHidden');
				introMissionHidden = introStored === 'true';
			}, 100);

			return () => {
				window.removeEventListener('storage', handleStorageChange);
				clearInterval(interval);
			};
		}
	});

	function hideContactInfo() {
		isHidden = true;
		if (browser) {
			localStorage.setItem('contactInfoHidden', 'true');
			posthog.capture('contact_info_hidden', {
				timestamp: new Date().toISOString()
			});
		}
	}

	function showContactInfo() {
		isHidden = false;
		if (browser) {
			localStorage.setItem('contactInfoHidden', 'false');
			posthog.capture('contact_info_shown', {
				timestamp: new Date().toISOString()
			});
		}
	}

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: "Besoin d'aide ou vous avez trouvé une erreur ?",
					description:
						"Si vous constatez un problème avec une récompense, des ingrédients requis incorrects, une image manquante ou obsolète, une quantité erronée, ou si vous souhaitez soumettre une nouvelle idée, signaler un oubli ou une récompense qui n'est plus disponible en jeu, n'hésitez pas à nous contacter.",
					contact: 'Contactez-nous à :',
					email: 'contact@star-citizen-wikelo-tools.fr',
					note: "Merci de bien expliquer le problème et, si possible, de fournir une image à jour de l'objet en jeu avec votre pseudo pour le crédit.",
					examples: 'Exemples de rapports utiles :',
					example1: 'Image incorrecte ou manquante',
					example2: "Quantité d'ingrédient erronée",
					example3: 'Récompense non disponible',
					example4: 'Nouvelle récompense à ajouter'
				}
			: {
					title: 'Need help or found an error?',
					description:
						'If you notice an issue with a reward, incorrect required ingredients, a missing or outdated image, a wrong quantity, or if you want to submit a new idea, report an oversight, or a reward that is no longer available in-game, feel free to contact us.',
					contact: 'Contact us at:',
					email: 'contact@star-citizen-wikelo-tools.fr',
					note: 'Please explain the issue clearly and, if possible, provide an up-to-date screenshot of the item in-game with your username for image credit.',
					examples: 'Examples of useful reports:',
					example1: 'Incorrect or missing image',
					example2: 'Wrong ingredient quantity',
					example3: 'Reward no longer available',
					example4: 'New reward to add'
				}
	);
</script>

<div
	class="relative mb-4 rounded-xl border-2 border-cyan-500 bg-linear-to-br from-cyan-500/10 to-blue-500/10 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm sm:mb-8 sm:p-6"
>
	{#if !isHidden}
		<!-- Hide button -->
		<button
			onclick={hideContactInfo}
			class="absolute top-1 right-1 z-10 rounded-lg border border-cyan-500/50 bg-cyan-500/20 p-1.5 text-cyan-400 transition-all hover:border-cyan-500/70 hover:bg-cyan-500/30 hover:text-cyan-300 sm:top-2 sm:right-2 sm:p-2"
			title={wikeloStore.currentLang === 'fr'
				? 'Masquer cette information'
				: 'Hide this information'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="sm:h-5 sm:w-5"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>

		<div class="flex gap-2 sm:gap-4">
			<div class="animate-pulse text-2xl sm:text-4xl">📧</div>

			<div class="flex-1 pr-6 sm:pr-0">
				<h3
					class="font-orbitron mb-1 text-sm font-bold tracking-wide text-cyan-400 uppercase sm:mb-2 sm:text-xl"
				>
					{t.title}
				</h3>

				<p class="mb-2 text-xs text-gray-300 sm:mb-4 sm:text-base">
					{t.description}
				</p>

				<!-- Contact Email -->
				<div class="mb-2 sm:mb-4">
					<p class="mb-1 text-xs font-semibold text-cyan-300 sm:text-sm">
						{t.contact}
					</p>
					<a
						href="mailto:{t.email}"
						class="font-orbitron inline-flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-400 transition-all hover:border-cyan-500/70 hover:bg-cyan-500/30 sm:px-4 sm:py-2 sm:text-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="sm:h-4 sm:w-4"
						>
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
						{t.email}
					</a>
				</div>

				<!-- Note -->
				<p class="mb-2 text-xs text-gray-400 italic sm:mb-3 sm:text-sm">
					{t.note}
				</p>

				<!-- Examples -->
				<div>
					<p class="mb-1 text-xs font-semibold text-cyan-300 sm:mb-2 sm:text-sm">
						{t.examples}
					</p>
					<div class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
						<div class="flex items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
							<span class="text-green-400">•</span>
							{t.example1}
						</div>
						<div class="flex items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
							<span class="text-green-400">•</span>
							{t.example2}
						</div>
						<div class="flex items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
							<span class="text-green-400">•</span>
							{t.example3}
						</div>
						<div class="flex items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
							<span class="text-green-400">•</span>
							{t.example4}
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Collapsed state - Show button -->
		<button
			onclick={showContactInfo}
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20"
			title={wikeloStore.currentLang === 'fr'
				? 'Afficher les informations de contact'
				: 'Show contact information'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-cyan-400"
			>
				<rect width="20" height="16" x="2" y="4" rx="2" />
				<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
			</svg>
			<span class="text-sm font-semibold text-cyan-400"
				>{wikeloStore.currentLang === 'fr'
					? 'Afficher les informations de contact'
					: 'Show contact information'}</span
			>
		</button>
	{/if}
</div>
