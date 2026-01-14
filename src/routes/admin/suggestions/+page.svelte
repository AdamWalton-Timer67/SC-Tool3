<script lang="ts">
	import type { PageData } from './$types';
	import type { Suggestion } from '$lib/types/suggestion';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let suggestions = $state<Suggestion[]>(data.suggestions || []);
	let deletingId = $state<string | null>(null);
	let filter = $state<'all' | 'pending' | 'reviewed' | 'resolved'>('all');

	const filteredSuggestions = $derived(
		filter === 'all' ? suggestions : suggestions.filter((s) => s.status === filter)
	);

	const stats = $derived({
		total: suggestions.length,
		pending: suggestions.filter((s) => s.status === 'pending').length,
		reviewed: suggestions.filter((s) => s.status === 'reviewed').length,
		resolved: suggestions.filter((s) => s.status === 'resolved').length
	});

	async function deleteSuggestion(id: string) {
		if (!confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
			return;
		}

		deletingId = id;

		try {
			const response = await fetch(`/api/suggestions/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete suggestion');
			}

			// Remove from local state
			suggestions = suggestions.filter((s) => s.id !== id);
		} catch (error) {
			console.error('Error deleting suggestion:', error);
			alert('Erreur lors de la suppression de la suggestion');
		} finally {
			deletingId = null;
		}
	}

	async function updateStatus(id: string, newStatus: 'pending' | 'reviewed' | 'resolved') {
		try {
			const response = await fetch(`/api/suggestions/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (!response.ok) {
				throw new Error('Failed to update suggestion');
			}

			const { suggestion } = await response.json();

			// Update local state
			suggestions = suggestions.map((s) => (s.id === id ? suggestion : s));
		} catch (error) {
			console.error('Error updating suggestion:', error);
			alert('Erreur lors de la mise à jour du statut');
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('fr-FR', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(date);
	}

	function getItemTypeIcon(type: string): string {
		return type === 'reward' ? '🎁' : '🧪';
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
			case 'reviewed':
				return 'bg-blue-500/20 border-blue-400/30 text-blue-300';
			case 'resolved':
				return 'bg-green-500/20 border-green-400/30 text-green-300';
			default:
				return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'pending':
				return 'En attente';
			case 'reviewed':
				return 'Examiné';
			case 'resolved':
				return 'Résolu';
			default:
				return status;
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<div class="mb-2 flex items-center gap-3">
			<span class="text-4xl">💡</span>
			<h2
				class="font-orbitron text-2xl font-bold tracking-wider text-green-300 uppercase sm:text-3xl"
			>
				Suggestions & Feedback
			</h2>
		</div>
		<p class="text-sm text-green-300/60 sm:text-base">Gérer les suggestions des utilisateurs</p>
		<div class="mt-4 h-px bg-linear-to-r from-green-400/50 via-emerald-400/50 to-transparent"></div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div
			class="group relative rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-6 transition-all hover:scale-105 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-cyan-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-cyan-300/60 uppercase sm:text-sm"
				>
					Total
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-cyan-300 sm:text-4xl">
					{stats.total}
				</p>
			</div>
		</div>

		<div
			class="group relative rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 transition-all hover:scale-105 hover:border-yellow-500/60 hover:shadow-lg hover:shadow-yellow-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/5 via-orange-500/5 to-yellow-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-yellow-300/60 uppercase sm:text-sm"
				>
					En attente
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-yellow-300 sm:text-4xl">
					{stats.pending}
				</p>
			</div>
		</div>

		<div
			class="group relative rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 transition-all hover:scale-105 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/5 via-cyan-500/5 to-blue-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-blue-300/60 uppercase sm:text-sm"
				>
					Examiné
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-blue-300 sm:text-4xl">
					{stats.reviewed}
				</p>
			</div>
		</div>

		<div
			class="group relative rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 transition-all hover:scale-105 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/5 via-emerald-500/5 to-green-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-green-300/60 uppercase sm:text-sm"
				>
					Résolu
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-green-300 sm:text-4xl">
					{stats.resolved}
				</p>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-2 sm:gap-3">
		<button
			onclick={() => (filter = 'all')}
			class="font-orbitron rounded-lg border-2 px-4 py-2.5 text-sm tracking-wide uppercase transition-all {filter ===
			'all'
				? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-cyan-400/50 hover:bg-cyan-500/10'}"
		>
			Tous ({stats.total})
		</button>
		<button
			onclick={() => (filter = 'pending')}
			class="font-orbitron rounded-lg border-2 px-4 py-2.5 text-sm tracking-wide uppercase transition-all {filter ===
			'pending'
				? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-lg shadow-yellow-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-yellow-400/50 hover:bg-yellow-500/10'}"
		>
			En attente ({stats.pending})
		</button>
		<button
			onclick={() => (filter = 'reviewed')}
			class="font-orbitron rounded-lg border-2 px-4 py-2.5 text-sm tracking-wide uppercase transition-all {filter ===
			'reviewed'
				? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-blue-400/50 hover:bg-blue-500/10'}"
		>
			Examiné ({stats.reviewed})
		</button>
		<button
			onclick={() => (filter = 'resolved')}
			class="font-orbitron rounded-lg border-2 px-4 py-2.5 text-sm tracking-wide uppercase transition-all {filter ===
			'resolved'
				? 'border-green-400 bg-green-500/20 text-green-300 shadow-lg shadow-green-400/50'
				: 'border-white/10 bg-slate-900/85 text-gray-300 hover:border-green-400/50 hover:bg-green-500/10'}"
		>
			Résolu ({stats.resolved})
		</button>
	</div>

	<!-- Suggestions List -->
	<div class="space-y-4">
		{#if filteredSuggestions.length === 0}
			<div class="rounded-xl border-2 border-green-500/20 bg-green-500/5 py-12 text-center">
				<div class="mb-4 text-6xl opacity-50">🔍</div>
				<p class="font-orbitron text-lg text-green-300/60">Aucune suggestion trouvée</p>
			</div>
		{:else}
			{#each filteredSuggestions as suggestion (suggestion.id)}
				<div
					class="group rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-black/40 to-black/20 p-4 backdrop-blur-sm transition-all hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/30 sm:p-6"
				>
					<!-- Header -->
					<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div class="flex items-start gap-3">
							<span class="text-3xl">{getItemTypeIcon(suggestion.item_type)}</span>
							<div>
								<h3 class="font-rajdhani mb-1 text-lg font-bold text-green-300">
									{suggestion.item_name}
								</h3>
								<div class="flex flex-wrap gap-2 text-xs">
									<span class="rounded bg-white/5 px-2 py-1 text-gray-400">
										{suggestion.item_type === 'reward' ? 'Reward' : 'Ingredient'}
									</span>
									<span class="rounded px-2 py-1 {getStatusColor(suggestion.status)}">
										{getStatusLabel(suggestion.status)}
									</span>
									{#if !suggestion.user_id}
										<span
											class="rounded border-orange-400/30 bg-orange-500/20 px-2 py-1 text-orange-300"
										>
											👤 Anonyme
										</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="text-xs text-gray-500 sm:text-right">
							{formatDate(suggestion.created_at)}
						</div>
					</div>

					<!-- Suggestion Type -->
					<div class="mb-3">
						<span
							class="font-orbitron text-xs font-semibold tracking-wider text-green-400/60 uppercase"
							>Type:</span
						>
						<p class="font-rajdhani mt-1 text-sm font-semibold text-purple-300">
							{suggestion.suggestion_type}
						</p>
					</div>

					<!-- Content -->
					<div class="mb-4 rounded-lg border-2 border-green-500/20 bg-black/30 p-4">
						<p class="font-rajdhani text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
							{suggestion.content}
						</p>
					</div>

					<!-- Email (if provided) -->
					{#if suggestion.user_email}
						<div class="mb-4 text-xs text-gray-500">
							📧 Contact: {suggestion.user_email}
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex flex-wrap gap-2">
						<!-- Status change buttons -->
						{#if suggestion.status !== 'pending'}
							<button
								onclick={() => updateStatus(suggestion.id, 'pending')}
								class="font-orbitron rounded-lg border-2 border-yellow-400/30 bg-yellow-500/20 px-3 py-2 text-xs tracking-wide text-yellow-300 uppercase transition-all hover:scale-105 hover:border-yellow-400/60 hover:bg-yellow-500/30"
							>
								→ En attente
							</button>
						{/if}
						{#if suggestion.status !== 'reviewed'}
							<button
								onclick={() => updateStatus(suggestion.id, 'reviewed')}
								class="font-orbitron rounded-lg border-2 border-blue-400/30 bg-blue-500/20 px-3 py-2 text-xs tracking-wide text-blue-300 uppercase transition-all hover:scale-105 hover:border-blue-400/60 hover:bg-blue-500/30"
							>
								→ Examiné
							</button>
						{/if}
						{#if suggestion.status !== 'resolved'}
							<button
								onclick={() => updateStatus(suggestion.id, 'resolved')}
								class="font-orbitron rounded-lg border-2 border-green-400/30 bg-green-500/20 px-3 py-2 text-xs tracking-wide text-green-300 uppercase transition-all hover:scale-105 hover:border-green-400/60 hover:bg-green-500/30"
							>
								→ Résolu
							</button>
						{/if}

						<!-- Delete button -->
						<button
							onclick={() => deleteSuggestion(suggestion.id)}
							disabled={deletingId === suggestion.id}
							class="font-orbitron ml-auto rounded-lg border-2 border-red-400/30 bg-red-500/20 px-3 py-2 text-xs tracking-wide text-red-300 uppercase transition-all hover:scale-105 hover:border-red-400/60 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{deletingId === suggestion.id ? 'Suppression...' : '🗑️ Supprimer'}
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
