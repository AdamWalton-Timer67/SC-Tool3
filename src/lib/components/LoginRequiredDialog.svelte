<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface Props {
		show: boolean;
		onClose: () => void;
	}

	let { show = $bindable(), onClose }: Props = $props();

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					title: 'Connexion requise',
					message: 'Vous devez être connecté pour effectuer cette action.',
					loginButton: 'Se connecter',
					closeButton: 'Fermer'
				}
			: {
					title: 'Login Required',
					message: 'You must be logged in to perform this action.',
					loginButton: 'Login',
					closeButton: 'Close'
				}
	);

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			show = false;
			onClose();
		}
	}
</script>

{#if show}
	<div
		class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		onclick={handleOverlayClick}
		onkeydown={(e) => e.key === 'Escape' && ((show = false), onClose())}
		role="dialog"
		aria-modal="true"
		aria-labelledby="login-required-title"
		tabindex="-1"
	>
		<div
			class="animate-scale-in relative w-full max-w-md rounded-xl border-2 border-cyan-500/50 bg-slate-900 shadow-2xl shadow-cyan-500/20"
		>
			<!-- Close button -->
			<button
				onclick={() => {
					show = false;
					onClose();
				}}
				class="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
				aria-label="Close dialog"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>

			<div class="p-6">
				<!-- Icon -->
				<div class="mb-4 flex justify-center">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-cyan-400"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
					</div>
				</div>

				<!-- Title -->
				<h2
					id="login-required-title"
					class="font-orbitron mb-2 text-center text-2xl font-bold text-cyan-400"
				>
					{t.title}
				</h2>

				<!-- Message -->
				<p class="font-rajdhani mb-6 text-center text-gray-300">
					{t.message}
				</p>

				<!-- Actions -->
				<div class="flex gap-3">
					<button
						onclick={() => {
							show = false;
							onClose();
						}}
						class="font-orbitron flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold tracking-wider text-gray-300 uppercase transition-all hover:bg-white/10"
					>
						{t.closeButton}
					</button>
					<button
						onclick={() => {
							show = false;
							onClose();
							authStore.openAuthDialog();
						}}
						class="font-orbitron flex-1 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-4 py-3 text-sm font-bold tracking-wider text-cyan-400 uppercase transition-all hover:border-cyan-500/70 hover:bg-cyan-500/30"
					>
						{t.loginButton}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
