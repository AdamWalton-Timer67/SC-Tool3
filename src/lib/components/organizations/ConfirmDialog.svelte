<script lang="ts">
	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
		onCancel: () => void;
		isDestructive?: boolean;
	}

	let {
		isOpen = $bindable(false),
		title,
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		onConfirm,
		onCancel,
		isDestructive = false
	}: Props = $props();
</script>

{#if isOpen}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		onclick={onCancel}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				onCancel();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Close dialog"
	>
		<!-- Modal Content -->
		<div
			class="relative w-full max-w-md rounded-xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-500/20"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Title -->
			<h3 class="font-orbitron mb-4 text-xl font-bold text-white">
				{title}
			</h3>

			<!-- Message -->
			<p class="mb-6 text-gray-300">
				{message}
			</p>

			<!-- Buttons -->
			<div class="flex gap-3">
				<button
					type="button"
					onclick={onCancel}
					class="flex-1 rounded-lg border border-gray-500/30 bg-gray-500/10 px-4 py-2 font-semibold text-gray-300 transition-all hover:border-gray-500/50 hover:bg-gray-500/20"
				>
					{cancelText}
				</button>
				<button
					type="button"
					onclick={onConfirm}
					class="flex-1 rounded-lg border px-4 py-2 font-semibold transition-all {isDestructive
						? 'border-red-500/50 bg-red-500/10 text-red-400 hover:border-red-500 hover:bg-red-500/20'
						: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/20'}"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
