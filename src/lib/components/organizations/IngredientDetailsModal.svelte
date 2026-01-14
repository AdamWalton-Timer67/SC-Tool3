<script lang="ts">
	import type { IngredientMemberBreakdown } from '$lib/types/organizations';
	import type { Ingredient } from '$lib/stores/wikelo.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { organizationsStore } from '$lib/stores/organizations.svelte';

	interface Props {
		isOpen: boolean;
		ingredient: Ingredient | null;
		organizationId: string;
		onClose: () => void;
	}

	let { isOpen = $bindable(), ingredient, organizationId, onClose }: Props = $props();

	let breakdown = $state<IngredientMemberBreakdown[]>([]);
	let isLoading = $state(false);

	// Load breakdown when modal opens
	$effect(() => {
		if (isOpen && ingredient && organizationId) {
			loadBreakdown();
		}
	});

	async function loadBreakdown() {
		if (!ingredient) return;

		isLoading = true;
		breakdown = await organizationsStore.loadIngredientBreakdown(organizationId, ingredient.id);
		isLoading = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Détails de l\'Ingrédient',
					memberBreakdown: 'Répartition par Membre',
					totalQuantity: 'Quantité totale',
					close: 'Fermer',
					loading: 'Chargement...',
					noMembers: 'Aucun membre ne possède cet ingrédient',
					ownedBy: 'Possédé par'
				}
			: {
					title: 'Ingredient Details',
					memberBreakdown: 'Member Breakdown',
					totalQuantity: 'Total quantity',
					close: 'Close',
					loading: 'Loading...',
					noMembers: 'No members have this ingredient',
					ownedBy: 'Owned by'
				}
	);

	const totalQuantity = $derived(breakdown.reduce((sum, item) => sum + item.quantity, 0));
</script>

{#if isOpen && ingredient}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	>
		<!-- Modal Content -->
		<div
			class="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-slate-900 shadow-2xl shadow-purple-500/20"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Header -->
			<div class="relative border-b border-white/10 bg-slate-950/95 p-6">
				<!-- Animated glow -->
				<div
					class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
				></div>

				<div class="flex items-start gap-4">
					<!-- Ingredient Image -->
					<div class="relative shrink-0">
						<div
							class="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 to-cyan-500/20 blur-md"
						></div>
						<div
							class="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-purple-400/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-purple-400/20"
						>
							<img
								src={ingredient.image}
								alt={wikeloStore.getText(ingredient.name)}
								class="h-full w-full object-cover"
								onerror={(e) => {
									const img = e.currentTarget;
									img.style.display = 'none';
									const parent = img.parentElement;
									if (parent && !parent.querySelector('.image-placeholder')) {
										const placeholder = document.createElement('div');
										placeholder.className =
											'image-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
										placeholder.innerHTML = `
											<div class="text-3xl mb-1 opacity-40">⚠</div>
											<div class="text-[8px] text-purple-400/60 uppercase tracking-widest font-orbitron">Data Lost</div>
										`;
										parent.appendChild(placeholder);
									}
								}}
							/>
						</div>
					</div>

					<!-- Title & Close -->
					<div class="flex-1">
						<h2 class="font-orbitron mb-1 text-2xl font-bold text-purple-400">
							{wikeloStore.getText(ingredient.name)}
						</h2>
						<p class="text-sm text-gray-400">{t.memberBreakdown}</p>
					</div>

					<!-- Close Button -->
					<button
						type="button"
						onclick={onClose}
						class="rounded-lg border border-white/10 bg-slate-900/50 p-2 text-gray-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
						aria-label={t.close}
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Total Badge -->
				<div class="mt-4 inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2">
					<span class="text-sm text-gray-400 uppercase">{t.totalQuantity}:</span>
					<span class="font-orbitron text-2xl font-bold text-purple-400">{totalQuantity}</span>
				</div>
			</div>

			<!-- Body - Scrollable -->
			<div class="overflow-y-auto p-6" style="max-height: calc(90vh - 220px);">
				{#if isLoading}
					<div class="py-12 text-center">
						<div
							class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"
						></div>
						<p class="mt-4 text-gray-400">{t.loading}</p>
					</div>
				{:else if breakdown.length === 0}
					<div class="py-12 text-center">
						<p class="mb-2 text-6xl">📦</p>
						<p class="text-lg text-gray-400">{t.noMembers}</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each breakdown as member (member.member_id)}
							<div
								class="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-800/50 p-4 backdrop-blur-sm transition-all hover:border-purple-500/50"
							>
								<!-- Hover effect -->
								<div
									class="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100"
								></div>

								<div class="relative flex items-center justify-between">
									<!-- Member Info -->
									<div class="flex items-center gap-3">
										<!-- Avatar placeholder -->
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 ring-2 ring-purple-500/30"
										>
											<span class="font-orbitron text-lg font-bold text-purple-400"
												>{member.display_name.charAt(0).toUpperCase()}</span
											>
										</div>

										<!-- Name -->
										<div>
											<p class="font-rajdhani text-lg font-bold text-white">
												{member.display_name}
											</p>
											<p class="text-xs text-gray-500">{t.ownedBy}</p>
										</div>
									</div>

									<!-- Quantity Badge -->
									<div
										class="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2"
									>
										<span class="font-orbitron text-xl font-bold text-purple-400"
											>{member.quantity}</span
										>
										<span class="text-xs text-gray-400">×</span>
									</div>
								</div>

								<!-- Progress Bar -->
								<div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-700/50">
									<div
										class="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
										style="width: {(member.quantity / totalQuantity) * 100}%"
									></div>
								</div>
								<p class="mt-1 text-right text-xs text-gray-500">
									{((member.quantity / totalQuantity) * 100).toFixed(1)}%
								</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
