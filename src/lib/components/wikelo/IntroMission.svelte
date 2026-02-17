<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { browser } from '$app/environment';
	import { captureEvent } from '$lib/analytics';

	const introMission = $derived(wikeloStore.introMission);
	const getText = (obj: { en: string; fr: string } | string) => {
		if (typeof obj === 'string') return obj;
		return wikeloStore.getText(obj);
	};

	const tooltips = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					hideMission: 'Masquer cette mission',
					showDetails: 'Cliquer pour voir les détails',
					showIntroMission: "Afficher la mission d'introduction"
				}
			: {
					hideMission: 'Hide this mission',
					showDetails: 'Click to see details',
					showIntroMission: 'Show introduction mission'
				}
	);

	// State for hiding/showing the intro mission
	let isHidden = $state(false);

	// Load hidden state from localStorage
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('introMissionHidden');
			isHidden = stored === 'true';
		}
	});

	function hideIntroMission() {
		isHidden = true;
		if (browser) {
			localStorage.setItem('introMissionHidden', 'true');
			captureEvent('intro_mission_hidden', {
				timestamp: new Date().toISOString()
			});
		}
	}

	function showIntroMission() {
		isHidden = false;
		if (browser) {
			localStorage.setItem('introMissionHidden', 'false');
			captureEvent('intro_mission_shown', {
				timestamp: new Date().toISOString()
			});
		}
	}
</script>

{#if introMission}
	{#if !isHidden}
		<div
			class="relative mb-4 rounded-xl border-2 border-orange-500 bg-linear-to-br from-orange-500/10 to-red-500/10 p-3 shadow-lg shadow-orange-500/20 backdrop-blur-sm sm:mb-8 sm:p-6"
		>
			<!-- Hide button -->
			<button
				onclick={hideIntroMission}
				class="absolute top-1 right-1 rounded-lg border border-orange-500/50 bg-orange-500/20 p-1.5 text-orange-400 transition-all hover:border-orange-500/70 hover:bg-orange-500/30 hover:text-orange-300 sm:top-2 sm:right-2 sm:p-2"
				title={tooltips.hideMission}
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
				<div class="animate-pulse text-2xl sm:text-4xl">⚠️</div>

				<div class="flex-1 pr-6 sm:pr-0">
					<h3
						class="font-orbitron mb-1 text-sm font-bold tracking-wide text-orange-400 uppercase sm:mb-2 sm:text-xl"
					>
						{getText(introMission.name)}
					</h3>

					<p class="mb-2 text-xs text-gray-300 sm:mb-4 sm:text-base">
						{getText(introMission.description)}
					</p>

					<div class="flex flex-wrap gap-1.5 sm:gap-2">
						{#each introMission.requirements as requirement}
							{@const ingredient = wikeloStore.getIngredient(requirement.id)}
							{@const isObtained = wikeloStore.isRequirementObtained('intro', requirement.id)}

							<button
								class="group/ingredient relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-lg border px-2 py-1.5 transition-all sm:gap-2 sm:px-4 sm:py-2
									{isObtained
									? 'border-green-500/50 bg-green-500/20 hover:border-green-500/70 hover:bg-green-500/30'
									: 'border-white/20 bg-white/5 hover:border-orange-400/50 hover:bg-orange-400/10 hover:shadow-lg hover:shadow-orange-400/20'}"
								onclick={() => ingredient && wikeloStore.openIngredientDialog(ingredient)}
								title={'🔍 ' + tooltips.showDetails}
							>
								<!-- Effet de brillance au hover -->
								<div
									class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-orange-400/10 to-transparent transition-transform duration-700 group-hover/ingredient:translate-x-full"
								></div>

								<input
									type="checkbox"
									checked={isObtained}
									onchange={(e) => {
										e.stopPropagation();
										wikeloStore.toggleRequirement('intro', requirement.id);
									}}
									onclick={(e) => e.stopPropagation()}
									class="checkbox-orange h-3 w-3 sm:h-4 sm:w-4"
								/>

								<span
									class="text-xs font-semibold text-white sm:text-base {isObtained
										? 'line-through opacity-60'
										: ''}"
								>
									{getText(requirement.name)}
								</span>

								<span class="font-orbitron text-xs font-bold text-orange-400 sm:text-base">
									x{requirement.quantity}
								</span>

								<!-- Icône info visible au hover - Hidden on mobile -->
								<span
									class="hidden text-xl text-orange-400 opacity-0 transition-opacity group-hover/ingredient:opacity-100 sm:inline"
								>
									🔍
								</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
