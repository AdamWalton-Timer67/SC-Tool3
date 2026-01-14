<script lang="ts">
	import type { OrganizationMemberWithUser } from '$lib/types/organizations';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import MenuItem from '$lib/components/ui/MenuItem.svelte';

	interface Props {
		member: OrganizationMemberWithUser;
		canManage: boolean;
		isCurrentUser: boolean;
		onPromote?: () => Promise<void>;
		onDemote?: () => Promise<void>;
		onRemove?: () => Promise<void>;
	}

	let { member, canManage, isCurrentUser, onPromote, onDemote, onRemove }: Props = $props();

	let isProcessing = $state(false);
	let showMenu = $state(false);

	async function handlePromote() {
		if (!onPromote) return;
		isProcessing = true;
		try {
			await onPromote();
		} catch (err) {
			console.error('Error promoting member:', err);
		} finally {
			isProcessing = false;
			showMenu = false;
		}
	}

	async function handleDemote() {
		if (!onDemote) return;
		isProcessing = true;
		try {
			await onDemote();
		} catch (err) {
			console.error('Error demoting member:', err);
		} finally {
			isProcessing = false;
			showMenu = false;
		}
	}

	async function handleRemove() {
		if (!onRemove) return;
		if (!confirm(t.confirmRemove)) return;
		isProcessing = true;
		try {
			await onRemove();
		} catch (err) {
			console.error('Error removing member:', err);
		} finally {
			isProcessing = false;
			showMenu = false;
		}
	}

	let displayName = $derived(member.display_name || 'Inconnu');

	let roleColor = $derived(
		member.role === 'owner'
			? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
			: member.role === 'admin'
				? 'text-purple-400 bg-purple-500/20 border-purple-500/50'
				: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50'
	);

	let roleGradient = $derived(
		member.role === 'owner'
			? 'from-yellow-500/20 to-orange-500/10'
			: member.role === 'admin'
				? 'from-purple-500/20 to-blue-500/10'
				: 'from-cyan-500/20 to-blue-500/10'
	);

	let roleLabel = $derived(
		member.role === 'owner'
			? (wikeloStore.currentLang === 'fr' ? 'Propriétaire' : 'Owner')
			: member.role === 'admin'
				? (wikeloStore.currentLang === 'fr' ? 'Administrateur' : 'Admin')
				: (wikeloStore.currentLang === 'fr' ? 'Membre' : 'Member')
	);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString(
			wikeloStore.currentLang === 'fr' ? 'fr-FR' : 'en-US',
			{
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		);
	}

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					you: 'Vous',
					total: 'total',
					uniques: 'uniques',
					unique: 'unique',
					joined: 'Rejoint le',
					changeNameInfo: 'Vous pouvez modifier votre nom in-game dans',
					yourAccount: 'votre compte',
					promoteToAdmin: 'Promouvoir Admin',
					demoteToMember: 'Rétrograder Membre',
					removeFromOrg: 'Retirer de l\'Organisation',
					confirmRemove: 'Êtes-vous sûr de vouloir retirer ce membre ?'
				}
			: {
					you: 'You',
					total: 'total',
					uniques: 'uniques',
					unique: 'unique',
					joined: 'Joined',
					changeNameInfo: 'You can change your in-game name in',
					yourAccount: 'your account',
					promoteToAdmin: 'Promote to Admin',
					demoteToMember: 'Demote to Member',
					removeFromOrg: 'Remove from Organization',
					confirmRemove: 'Are you sure you want to remove this member?'
				}
	);
</script>

<div class="group relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-cyan-500/70 hover:shadow-xl hover:shadow-cyan-500/20">
	<!-- Gradient overlay on hover -->
	<div class="absolute inset-0 bg-gradient-to-r {roleGradient} opacity-0 transition-opacity group-hover:opacity-100"></div>

	<div class="relative p-5">
		<div class="flex items-start justify-between gap-4">
			<!-- User Info -->
			<div class="flex-1">
				<!-- Name and Role Badge -->
				<div class="mb-3 flex flex-wrap items-center gap-2">
					<span class="font-orbitron text-lg font-bold text-white">{displayName}</span>
					{#if isCurrentUser}
						<span class="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/50">{t.you}</span>
					{/if}
				</div>

				<!-- Role and Stats -->
				<div class="mb-3 flex flex-wrap items-center gap-3">
					<span class="rounded-lg border {roleColor} px-3 py-1 text-xs font-bold uppercase tracking-wider">
						{roleLabel}
					</span>

					<!-- Total Ingredients Count - Main stat -->
					<div class="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-1 ring-1 ring-yellow-500/30">
						<svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
							<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
						</svg>
						<span class="font-rajdhani text-sm font-bold text-yellow-400">
							{member.total_ingredients_count || 0}
						</span>
						<span class="text-xs text-yellow-400/70">{t.total}</span>
					</div>

					<!-- Unique Ingredients Count - Secondary stat -->
					<div class="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1 ring-1 ring-cyan-500/30">
						<svg class="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
						</svg>
						<span class="font-rajdhani text-sm font-bold text-cyan-400">
							{member.unique_ingredients_count || 0}
						</span>
						<span class="text-xs text-cyan-400/70">{(member.unique_ingredients_count || 0) !== 1 ? t.uniques : t.unique}</span>
					</div>
				</div>

				<!-- Join Date -->
				<div class="flex items-center gap-1.5 text-xs text-gray-500">
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
					</svg>
					<span>{t.joined} {formatDate(member.joined_at)}</span>
				</div>

				<!-- Info message for current user -->
				{#if isCurrentUser}
					<div class="mt-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
						<div class="flex items-start gap-2">
							<svg class="h-4 w-4 shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
							</svg>
							<div class="flex-1">
								<p class="text-xs text-blue-300">
									{t.changeNameInfo}{' '}
									<a href="/account" class="font-semibold text-blue-400 underline hover:text-blue-300">
										{t.yourAccount}
									</a>
								</p>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Actions Menu -->
			{#if canManage && member.role !== 'owner' && !isCurrentUser}
				<DropdownMenu bind:isOpen={showMenu} onClose={() => (showMenu = false)}>
					{#snippet trigger()}
						<button
							type="button"
							onclick={() => (showMenu = !showMenu)}
							disabled={isProcessing}
							class="rounded-lg border border-cyan-500/30 bg-slate-800/50 px-3 py-2 text-cyan-400 transition-all hover:border-cyan-500/70 hover:bg-cyan-500/10 disabled:opacity-50"
							aria-label="Manage member"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</button>
					{/snippet}

					{#snippet children()}
						{#if member.role === 'member'}
							<MenuItem onclick={handlePromote}>
								{#snippet icon()}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 10l7-7m0 0l7 7m-7-7v18"
										/>
									</svg>
								{/snippet}
								{t.promoteToAdmin}
							</MenuItem>
						{/if}

						{#if member.role === 'admin'}
							<MenuItem onclick={handleDemote}>
								{#snippet icon()}
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 14l-7 7m0 0l-7-7m7 7V3"
										/>
									</svg>
								{/snippet}
								{t.demoteToMember}
							</MenuItem>
						{/if}

						<div class="h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent"></div>

						<MenuItem onclick={handleRemove} variant="danger">
							{#snippet icon()}
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							{/snippet}
							{t.removeFromOrg}
						</MenuItem>
					{/snippet}
				</DropdownMenu>
			{/if}
		</div>
	</div>
</div>
