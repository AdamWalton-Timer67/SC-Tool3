<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import type { Reward, ShipComponent } from '$lib/stores/wikelo.svelte';
	import { onMount } from 'svelte';

	const ship = $derived(wikeloStore.selectedShip);
	const isOpen = $derived(ship !== null);
	const getText = (obj: { en: string; fr: string }) => wikeloStore.getText(obj);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					close: 'Fermer',
					closeLabel: 'Fermer',
					detailedLoadout: 'Loadout Détaillé',
					loadoutPending: 'Les détails du loadout pour ce vaisseau seront ajoutés prochainement',
					highQualityComponents:
						'Ce vaisseau est équipé avec des composants de haute qualité pour des performances optimales',
					improvedPerformance:
						'Ce loadout Wikelo offre des performances améliorées par rapport à la configuration standard'
				}
			: {
					close: 'Close',
					closeLabel: 'Close',
					detailedLoadout: 'Detailed Loadout',
					loadoutPending: 'Loadout details for this ship will be added soon',
					highQualityComponents:
						'This ship is equipped with high-quality components for optimal performance',
					improvedPerformance:
						'This Wikelo loadout offers improved performance over standard configuration'
				}
	);

	// Component images mapping
	let componentImages: Record<string, Record<string, string | null>> = $state({});

	onMount(async () => {
		try {
			const response = await fetch('/data/component-images.json');
			componentImages = await response.json();
		} catch (error) {
			console.error('Failed to load component images:', error);
		}
	});

	function handleClose() {
		wikeloStore.closeShipDialog();
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	// Component icons and colors mapping
	const componentIcons: Record<string, string> = {
		'Power Plant': '⚡',
		Shield: '🛡️',
		'Shield Generator': '🛡️',
		Cooler: '❄️',
		'Quantum Drive': '🌌',
		Weapons: '🔫'
	};

	const classColors: Record<string, string> = {
		Military: 'from-red-600 to-red-800',
		Stealth: 'from-purple-600 to-purple-800',
		Competition: 'from-orange-600 to-orange-800',
		Industrial: 'from-blue-600 to-blue-800',
		Civilian: 'from-green-600 to-green-800',
		NA: 'from-gray-600 to-gray-800'
	};

	const gradeColors: Record<string, string> = {
		A: 'border-yellow-400 text-yellow-400',
		B: 'border-cyan-400 text-cyan-400',
		C: 'border-green-400 text-green-400',
		'1': 'border-purple-400 text-purple-400',
		'': 'border-gray-400 text-gray-400'
	};

	function groupComponentsByCategory(components: ShipComponent[] | undefined) {
		if (!components) return {};

		return components.reduce(
			(acc, component) => {
				if (!acc[component.category]) {
					acc[component.category] = [];
				}
				acc[component.category].push(component);
				return acc;
			},
			{} as Record<string, ShipComponent[]>
		);
	}

	function getComponentImage(component: ShipComponent): string | null {
		const cleanName = component.name.replace('⭐', '').trim();
		const categoryMap: Record<string, string> = {
			'Power Plant': 'powerPlants',
			Shield: 'shields',
			'Shield Generator': 'shields',
			Cooler: 'coolers',
			'Quantum Drive': 'quantumDrives',
			Weapons: 'weapons'
		};

		const categoryKey = categoryMap[component.category];
		if (!categoryKey || !componentImages[categoryKey]) return null;

		return componentImages[categoryKey][cleanName] || null;
	}

	const groupedComponents = $derived(ship ? groupComponentsByCategory(ship.components) : {});
</script>

{#if isOpen && ship}
	<div
		class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={handleOverlayClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-800 shadow-2xl"
		>
			<!-- Close button -->
			<button
				onclick={handleClose}
				class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10"
				aria-label={t.closeLabel}
			>
				<span class="text-2xl text-white">×</span>
			</button>

			<!-- Content -->
			<div class="p-8">
				<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<!-- Left: Image -->
					<div class="lg:col-span-1">
						{#if ship.image}
							<div class="mb-4 flex justify-center">
								<div class="relative rounded-lg border-2 border-cyan-400/30 p-2">
									<img
										src={ship.image}
										alt={getText(ship.name)}
										class="h-48 w-full rounded-lg object-contain"
									/>
								</div>
							</div>
						{/if}
						{#if ship.imageCredit}
							<p class="mb-4 text-center text-xs text-gray-500 italic">
								📸 {ship.imageCredit}
							</p>
						{/if}
						<!-- Ship Info -->
						<div class="rounded-lg border border-white/10 bg-white/5 p-4">
							<h3 class="font-orbitron mb-2 font-bold tracking-wider text-yellow-400 uppercase">
								{getText(ship.name)}
							</h3>
							<p class="mb-2 text-sm text-cyan-400 uppercase">{getText(ship.type)}</p>
							<p class="text-sm text-gray-400">{getText(ship.description)}</p>
							{#if ship.missionName}
								<p class="mt-3 text-xs text-purple-400 italic">
									📋 {getText(ship.missionName)}
								</p>
							{/if}
						</div>
					</div>

					<!-- Right: Components Details -->
					<div class="lg:col-span-2">
						<h2
							class="font-orbitron mb-6 flex items-center gap-3 text-2xl font-bold tracking-wide text-yellow-400 uppercase"
						>
							<span class="text-3xl">🔧</span>
							<span>{t.detailedLoadout}</span>
						</h2>

						{#if ship.components && ship.components.length > 0}
							<div class="space-y-6">
								{#each Object.entries(groupedComponents) as [category, components]}
									<div class="rounded-lg border border-white/10 bg-white/5 p-4">
										<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-cyan-400">
											<span class="text-2xl">{componentIcons[category] || '⚙️'}</span>
											<span>{category}</span>
											<span class="ml-auto text-sm text-gray-400">({components.length})</span>
										</h3>

										<div class="space-y-3">
											{#each components as component}
												<div
													class="rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/50"
												>
													<div class="flex items-start justify-between gap-3">
														<!-- Component Image -->
														{#if getComponentImage(component)}
															<div
																class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-black/30 p-1"
															>
																<img
																	src={getComponentImage(component)}
																	alt={component.name}
																	class="h-full w-full object-contain"
																	loading="lazy"
																/>
															</div>
														{/if}

														<!-- Component Name & Count -->
														<div class="flex-1">
															<div class="mb-2 flex items-center gap-2">
																<span class="font-semibold text-white">
																	{component.name}
																</span>
																{#if component.count > 1}
																	<span
																		class="rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs font-bold text-cyan-300"
																	>
																		x{component.count}
																	</span>
																{/if}
															</div>

															<!-- Badges -->
															<div class="flex flex-wrap gap-2">
																<!-- Class Badge -->
																<span
																	class="rounded-full bg-linear-to-r px-3 py-1 text-xs font-bold uppercase {classColors[
																		component.class
																	] || classColors['Civilian']} text-white shadow-md"
																>
																	{component.class}
																</span>

																<!-- Grade Badge -->
																{#if component.grade}
																	<span
																		class="rounded-lg border-2 px-3 py-1 text-xs font-bold {gradeColors[
																			component.grade
																		] || gradeColors['']} bg-black/30"
																	>
																		Grade {component.grade}
																	</span>
																{/if}
															</div>
														</div>

														<!-- Special Marker -->
														{#if component.name.includes('⭐')}
															<div
																class="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-400/50 bg-yellow-400/20"
															>
																<span class="text-lg text-yellow-400">⭐</span>
															</div>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="rounded-lg border border-purple-500/30 bg-purple-500/10 p-6 text-center">
								<p class="text-purple-300">
									⚠️ {t.loadoutPending}
								</p>
							</div>
						{/if}

						<!-- Note -->
						<div class="mt-6 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4">
							<p class="flex items-center justify-center gap-2 text-center text-sm text-cyan-300">
								<span class="text-xl">💡</span>
								<span>
									{ship.components && ship.components.length > 0
										? t.highQualityComponents
										: t.improvedPerformance}
								</span>
							</p>
						</div>
					</div>
				</div>

				<!-- Close Button -->
				<div class="flex justify-center border-t border-white/10 pt-4">
					<button
						onclick={handleClose}
						class="rounded-lg bg-linear-to-r from-cyan-400 to-purple-500 px-8 py-3 font-bold tracking-wider text-white uppercase transition-all hover:shadow-lg hover:shadow-cyan-400/50"
					>
						{t.close}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.animate-fade-in {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Custom Scrollbar - Banu Style */
	.max-h-\[90vh\]::-webkit-scrollbar {
		width: 12px;
	}

	.max-h-\[90vh\]::-webkit-scrollbar-track {
		background: rgba(15, 23, 42, 0.8);
		border-radius: 10px;
		border: 1px solid rgba(34, 211, 238, 0.1);
	}

	.max-h-\[90vh\]::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, rgba(34, 211, 238, 0.6), rgba(168, 85, 247, 0.6));
		border-radius: 10px;
		border: 2px solid rgba(15, 23, 42, 0.5);
		box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
	}

	.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, rgba(34, 211, 238, 0.8), rgba(168, 85, 247, 0.8));
		box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
	}

	/* Firefox */
	.max-h-\[90vh\] {
		scrollbar-width: thin;
		scrollbar-color: rgba(34, 211, 238, 0.6) rgba(15, 23, 42, 0.8);
	}
</style>
