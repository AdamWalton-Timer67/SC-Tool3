<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';

	const dialog = $derived(wikeloStore.uncheckConfirmDialog);
	const isOpen = $derived(dialog?.isOpen ?? false);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Récupérer les ingrédients ?',
					message:
						'Vous décochez cet ingrédient. Voulez-vous récupérer les ingrédients dans votre inventaire ?',
					ingredient: 'Ingrédient :',
					quantity: 'Quantité :',
					yesRecover: 'Oui, récupérer',
					noJustUncheck: 'Non, juste décocher',
					cancel: 'Annuler'
				}
			: {
					title: 'Recover ingredients?',
					message:
						'You are unchecking this ingredient. Do you want to recover the ingredients in your inventory?',
					ingredient: 'Ingredient:',
					quantity: 'Quantity:',
					yesRecover: 'Yes, recover',
					noJustUncheck: 'No, just uncheck',
					cancel: 'Cancel'
				}
	);

	function handleYes() {
		wikeloStore.confirmUncheckWithInventory();
	}

	function handleNo() {
		wikeloStore.confirmUncheckWithoutInventory();
	}

	function handleCancel() {
		wikeloStore.cancelUncheck();
	}

	// Empêcher la fermeture en cliquant sur le backdrop
	function handleBackdropClick(e: MouseEvent) {
		e.stopPropagation();
		// Ne rien faire - la dialog ne se ferme pas
	}

	// Handle keyboard events for accessibility
	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	function handleDialogKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}
</script>

{#if isOpen && dialog}
	<!-- Backdrop -->
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		tabindex="-1"
	>
		<!-- Dialog -->
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="uncheck-dialog-title"
			tabindex="-1"
			class="w-full max-w-md rounded-xl border border-cyan-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl shadow-cyan-500/20"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleDialogKeydown}
		>
			<!-- Header -->
			<div class="mb-4 flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
					<span class="text-lg text-orange-400">⚠️</span>
				</div>
				<h3 id="uncheck-dialog-title" class="font-orbitron text-lg font-bold text-cyan-300">
					{t.title}
				</h3>
			</div>

			<!-- Message -->
			<p class="mb-4 leading-relaxed text-gray-300">
				{t.message}
			</p>

			<!-- Ingredient info -->
			<div class="mb-6 rounded-lg border border-white/10 bg-white/5 p-3">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm text-gray-400">{t.ingredient}</span>
					<span class="font-medium text-white">📦 {dialog.ingredientName}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-400">{t.quantity}</span>
					<span class="font-orbitron font-bold text-yellow-400">
						x{dialog.quantity}{dialog.unit ? ` ${dialog.unit}` : ''}
					</span>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-2">
				<!-- Oui, récupérer -->
				<button
					onclick={handleYes}
					class="flex w-full items-center justify-center rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:border-cyan-400/50 hover:from-cyan-700 hover:to-cyan-600"
				>
					{t.yesRecover}
				</button>

				<!-- Non, juste décocher -->
				<button
					onclick={handleNo}
					class="flex w-full items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:border-purple-400/50 hover:from-purple-700 hover:to-purple-600"
				>
					{t.noJustUncheck}
				</button>

				<!-- Annuler -->
				<button
					onclick={handleCancel}
					class="flex w-full items-center justify-center rounded-lg border border-white/20 bg-black/50 px-4 py-3 font-semibold text-gray-300 transition-all duration-200 hover:border-white/40 hover:bg-black/70 hover:text-white"
				>
					{t.cancel}
				</button>
			</div>
		</div>
	</div>
{/if}
