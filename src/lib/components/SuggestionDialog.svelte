<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { SuggestionItemType } from '$lib/types/suggestion';

	interface Props {
		isOpen: boolean;
		itemType: SuggestionItemType;
		itemId: string;
		itemName: string;
		lang?: 'en' | 'fr';
		onClose: () => void;
	}

	let { isOpen = $bindable(), itemType, itemId, itemName, lang = 'en', onClose }: Props = $props();

	let suggestionType = $state('');
	let content = $state('');
	let userEmail = $state('');
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);

	const t = $derived(
		lang === 'fr'
			? {
					title: 'Suggérer une amélioration',
					subtitle: 'Aidez-nous à améliorer les informations',
					itemLabel: 'Élément concerné',
					typeLabel: 'Type de suggestion',
					typePlaceholder: 'Ex: Information manquante, Erreur, Amélioration...',
					contentLabel: 'Votre suggestion',
					contentPlaceholder: 'Décrivez votre suggestion en détail...',
					emailLabel: 'Email (optionnel)',
					emailPlaceholder: 'Pour vous contacter si nécessaire',
					submit: 'Envoyer',
					cancel: 'Annuler',
					submitting: 'Envoi...',
					successMessage: 'Merci ! Votre suggestion a été envoyée.',
					errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
					requiredFields: 'Veuillez remplir tous les champs requis.'
				}
			: {
					title: 'Suggest an Improvement',
					subtitle: 'Help us improve the information',
					itemLabel: 'Item concerned',
					typeLabel: 'Suggestion type',
					typePlaceholder: 'E.g.: Missing info, Error, Enhancement...',
					contentLabel: 'Your suggestion',
					contentPlaceholder: 'Describe your suggestion in detail...',
					emailLabel: 'Email (optional)',
					emailPlaceholder: 'To contact you if needed',
					submit: 'Submit',
					cancel: 'Cancel',
					submitting: 'Submitting...',
					successMessage: 'Thank you! Your suggestion has been sent.',
					errorMessage: 'An error occurred. Please try again.',
					requiredFields: 'Please fill in all required fields.'
				}
	);

	function handleClose() {
		if (!isSubmitting) {
			resetForm();
			onClose();
		}
	}

	function resetForm() {
		suggestionType = '';
		content = '';
		userEmail = '';
		error = '';
		success = false;
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget && !isSubmitting) {
			handleClose();
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!suggestionType.trim() || !content.trim()) {
			error = t.requiredFields;
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			// Get user if authenticated (optional)
			const {
				data: { user }
			} = await supabase.auth.getUser();

			const { error: insertError } = await supabase.from('suggestions').insert({
				user_id: user?.id || null,
				item_type: itemType,
				item_id: itemId,
				item_name: itemName,
				suggestion_type: suggestionType.trim(),
				content: content.trim(),
				user_email: userEmail.trim() || null
			});

			if (insertError) throw insertError;

			success = true;
			setTimeout(() => {
				handleClose();
			}, 2000);
		} catch (err) {
			console.error('Error submitting suggestion:', err);
			error = t.errorMessage;
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<div
		class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={handleOverlayClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-cyan-400/30 bg-linear-to-br from-slate-900 to-slate-800 shadow-2xl shadow-cyan-400/20"
		>
			<!-- Animated border effect -->
			<div
				class="animate-border-pulse pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-cyan-400/20 via-purple-500/20 to-cyan-400/20"
			></div>

			<!-- Close button -->
			<button
				onclick={handleClose}
				disabled={isSubmitting}
				class="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Close"
			>
				<span class="text-2xl text-white">×</span>
			</button>

			<!-- Content -->
			<div class="relative p-6">
				<!-- Header -->
				<div class="mb-6">
					<h2 class="font-orbitron mb-2 text-2xl font-bold tracking-wide text-cyan-400 uppercase">
						💡 {t.title}
					</h2>
					<p class="text-sm text-gray-400">{t.subtitle}</p>
				</div>

				{#if success}
					<!-- Success message -->
					<div
						class="animate-fade-in mb-4 rounded-lg border border-green-400/30 bg-green-500/20 p-4"
					>
						<p class="text-center font-semibold text-green-300">✅ {t.successMessage}</p>
					</div>
				{:else}
					<!-- Form -->
					<form onsubmit={handleSubmit} class="space-y-4">
						<!-- Item name (read-only) -->
						<div>
							<div class="mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase">
								{t.itemLabel}
							</div>
							<div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-300">
								{itemName}
							</div>
						</div>

						<!-- Suggestion type -->
						<div>
							<label
								for="suggestion-type"
								class="mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase"
							>
								{t.typeLabel} <span class="text-red-400">*</span>
							</label>
							<input
								id="suggestion-type"
								type="text"
								bind:value={suggestionType}
								placeholder={t.typePlaceholder}
								disabled={isSubmitting}
								class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-500 transition-all focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								required
							/>
						</div>

						<!-- Content -->
						<div>
							<label
								for="suggestion-content"
								class="mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase"
							>
								{t.contentLabel} <span class="text-red-400">*</span>
							</label>
							<textarea
								id="suggestion-content"
								bind:value={content}
								placeholder={t.contentPlaceholder}
								disabled={isSubmitting}
								rows="5"
								class="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-500 transition-all focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								required
							></textarea>
						</div>

						<!-- Email (optional) -->
						<div>
							<label
								for="suggestion-email"
								class="mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase"
							>
								{t.emailLabel}
							</label>
							<input
								id="suggestion-email"
								type="email"
								bind:value={userEmail}
								placeholder={t.emailPlaceholder}
								disabled={isSubmitting}
								class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-500 transition-all focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>

						<!-- Error message -->
						{#if error}
							<div class="animate-fade-in rounded-lg border border-red-400/30 bg-red-500/20 p-3">
								<p class="text-sm text-red-300">⚠️ {error}</p>
							</div>
						{/if}

						<!-- Buttons -->
						<div class="flex gap-3 pt-2">
							<button
								type="button"
								onclick={handleClose}
								disabled={isSubmitting}
								class="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-300 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{t.cancel}
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="flex-1 rounded-lg bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-3 font-bold text-white shadow-lg shadow-cyan-400/30 transition-all hover:from-cyan-500 hover:to-purple-600 hover:shadow-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSubmitting ? t.submitting : t.submit}
							</button>
						</div>
					</form>
				{/if}
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

	.animate-border-pulse {
		animation: borderPulse 3s ease-in-out infinite;
	}

	@keyframes borderPulse {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.6;
		}
	}

	/* Custom Scrollbar - Banu Style */
	.max-h-\[90vh\]::-webkit-scrollbar {
		width: 10px;
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
