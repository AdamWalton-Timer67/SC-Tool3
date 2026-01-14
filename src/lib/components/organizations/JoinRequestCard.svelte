<script lang="ts">
	import type { JoinRequestWithUser } from '$lib/types/organizations';

	interface Props {
		request: JoinRequestWithUser;
		onApprove: () => Promise<void>;
		onReject: () => Promise<void>;
	}

	let { request, onApprove, onReject }: Props = $props();

	let isProcessing = $state(false);

	async function handleApprove() {
		isProcessing = true;
		try {
			await onApprove();
		} catch (err) {
			console.error('Error approving request:', err);
		} finally {
			isProcessing = false;
		}
	}

	async function handleReject() {
		isProcessing = true;
		try {
			await onReject();
		} catch (err) {
			console.error('Error rejecting request:', err);
		} finally {
			isProcessing = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let displayName = $derived(request.display_name || 'Inconnu');
</script>

<div
	class="rounded-lg border border-cyan-500/30 bg-slate-800/50 p-4 transition-all hover:border-cyan-500/50"
>
	<div class="flex items-start justify-between gap-4">
		<!-- User Info -->
		<div class="flex-1">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-lg font-semibold text-white">{displayName}</span>
				<span class="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
					En attente
				</span>
			</div>

			{#if request.message}
				<p class="mb-2 text-sm text-gray-300">
					<span class="font-semibold text-gray-400">Message:</span>
					"{request.message}"
				</p>
			{/if}

			<p class="text-xs text-gray-500">
				Requested {formatDate(request.created_at)}
			</p>
		</div>

		<!-- Action Buttons -->
		<div class="flex gap-2">
			<button
				type="button"
				onclick={handleApprove}
				disabled={isProcessing}
				class="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 transition-all hover:border-green-500 hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
				title="Approve request"
			>
				✓
			</button>
			<button
				type="button"
				onclick={handleReject}
				disabled={isProcessing}
				class="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:border-red-500 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
				title="Reject request"
			>
				✗
			</button>
		</div>
	</div>
</div>
