<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import '$lib/styles/wikelo.css';
	import { organizationsStore } from '$lib/stores/organizations.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { supabase } from '$lib/supabase';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import LanguageToggle from '$lib/components/wikelo/LanguageToggle.svelte';
	import MemberCard from '$lib/components/organizations/MemberCard.svelte';
	import JoinRequestCard from '$lib/components/organizations/JoinRequestCard.svelte';
	import ConfirmDialog from '$lib/components/organizations/ConfirmDialog.svelte';
	import OrganizationInventory from '$lib/components/organizations/OrganizationInventory.svelte';
	import SpaceBackground from '$lib/components/wikelo/SpaceBackground.svelte';
	import ImageWithFallback from '$lib/components/wikelo/ImageWithFallback.svelte';
	import type { PageData} from './$types';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(true);
	let showDeleteConfirm = $state(false);
	let showLeaveConfirm = $state(false);
	let pendingRequest = $state<any>(null);
	let userProfile = $state<any>(null);
	let activeTab = $state<'inventory' | 'members'>('inventory');

	onMount(async () => {
		// Load organization by slug
		try {
			await organizationsStore.loadOrganization(data.slug);

			// Check if user has pending request
			if (organizationsStore.currentUser && organizationsStore.currentOrganization) {
				pendingRequest = await organizationsStore.checkPendingRequest(
					organizationsStore.currentOrganization.id
				);

				// Load user profile to check if display_name is set
				const { data: profileData } = await supabase
					.from('profiles')
					.select('display_name')
					.eq('id', organizationsStore.currentUser.id)
					.single();

				userProfile = profileData;
			}
		} catch (err) {
			console.error('Error loading organization:', err);
		} finally {
			isLoading = false;
		}
	});

	async function handleJoin() {
		if (!organizationsStore.currentUser) {
			authStore.showAuthDialog = true;
			return;
		}

		if (!organizationsStore.currentOrganization) return;

		try {
			await organizationsStore.sendJoinRequest(organizationsStore.currentOrganization.id);
			pendingRequest = await organizationsStore.checkPendingRequest(
				organizationsStore.currentOrganization.id
			);
			alert(t.joinSuccess);
		} catch (err) {
			const message = err instanceof Error ? err.message : t.joinError;
			alert(message);
		}
	}

	async function handleCancelRequest() {
		if (!organizationsStore.currentOrganization) return;

		try {
			await organizationsStore.cancelJoinRequest(organizationsStore.currentOrganization.id);
			pendingRequest = null;
			alert(t.requestCancelled);
		} catch (err) {
			console.error('Error cancelling request:', err);
		}
	}

	async function handleLeave() {
		if (!organizationsStore.currentOrganization) return;

		try {
			await organizationsStore.leaveOrganization(organizationsStore.currentOrganization.id);
			showLeaveConfirm = false;
			goto('/organizations');
		} catch (err) {
			const message = err instanceof Error ? err.message : t.leaveError;
			alert(message);
		}
	}

	async function handleDelete() {
		if (!organizationsStore.currentOrganization) return;

		try {
			await organizationsStore.deleteOrganization(organizationsStore.currentOrganization.id);
			showDeleteConfirm = false;
			goto('/organizations');
		} catch (err) {
			const message = err instanceof Error ? err.message : t.deleteError;
			alert(message);
		}
	}

	let org = $derived(organizationsStore.currentOrganization);
	let members = $derived(organizationsStore.members);
	let requests = $derived(organizationsStore.joinRequests);
	let inventory = $derived(organizationsStore.organizationInventory);
	let isManager = $derived(organizationsStore.isManager);
	let isOwner = $derived(organizationsStore.isOwner);
	let isMember = $derived(organizationsStore.isMember);
	let canDeleteOrg = $derived(isOwner && members.length === 1); // Only owner and alone

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					backToOrgs: 'Retour aux organisations',
					loading: 'Chargement de l\'organisation...',
					notFound: 'Organisation introuvable',
					member: 'membre',
					members: 'membres',
					loginToJoin: 'Se connecter pour rejoindre',
					joinOrg: 'Rejoindre l\'Organisation',
					cancelRequest: 'Annuler la Demande',
					leaveOrg: 'Quitter l\'Organisation',
					delete: 'Supprimer',
					cannotDelete: 'Impossible de supprimer (des membres restent)',
					pendingRequests: 'Demandes en Attente',
					orgMembers: 'Membres de l\'Organisation',
					noMembers: 'Aucun membre pour le moment',
					beFirstMember: 'Soyez le premier à rejoindre cette organisation !',
					membersOnly: 'Membres Uniquement',
					joinToSeeMembers: 'Rejoignez cette organisation pour voir la liste des membres',
					leaveConfirmTitle: 'Quitter l\'Organisation',
					leaveConfirmMessage: 'Êtes-vous sûr de vouloir quitter cette organisation ? Vous devrez faire une nouvelle demande pour la rejoindre.',
					leave: 'Quitter',
					cancel: 'Annuler',
					deleteConfirmTitle: 'Supprimer l\'Organisation',
					deleteConfirmMessage: 'Êtes-vous sûr de vouloir supprimer cette organisation ? Cette action est irréversible.',
					joinSuccess: 'Demande envoyée avec succès !',
					joinError: 'Échec de l\'envoi de la demande',
					requestCancelled: 'Demande annulée',
					leaveError: 'Impossible de quitter l\'organisation',
					deleteError: 'Impossible de supprimer l\'organisation',
					pendingRequestMessage: 'Votre demande pour rejoindre cette organisation est en attente d\'approbation.',
					pendingRequestTitle: 'Demande en Attente',
					noDisplayNameWarning: '⚠️ Attention : Vous n\'avez pas configuré de nom in-game. Les membres de l\'organisation vous verront comme "Inconnu".',
					setDisplayName: 'Configurer mon nom',
					accountPage: 'Page de compte',
					tabInventory: 'Inventaire',
					tabMembers: 'Membres'
				}
			: {
					backToOrgs: 'Back to organizations',
					loading: 'Loading organization...',
					notFound: 'Organization not found',
					member: 'member',
					members: 'members',
					loginToJoin: 'Login to Join',
					joinOrg: 'Join Organization',
					cancelRequest: 'Cancel Request',
					leaveOrg: 'Leave Organization',
					delete: 'Delete',
					cannotDelete: 'Cannot delete (members remain)',
					pendingRequests: 'Pending Requests',
					orgMembers: 'Organization Members',
					noMembers: 'No members yet',
					beFirstMember: 'Be the first to join this organization!',
					membersOnly: 'Members Only',
					joinToSeeMembers: 'Join this organization to see the member list',
					leaveConfirmTitle: 'Leave Organization',
					leaveConfirmMessage: 'Are you sure you want to leave this organization? You will need to request to join again.',
					leave: 'Leave',
					cancel: 'Cancel',
					deleteConfirmTitle: 'Delete Organization',
					deleteConfirmMessage: 'Are you sure you want to delete this organization? This action cannot be undone.',
					joinSuccess: 'Join request sent successfully!',
					joinError: 'Failed to send join request',
					requestCancelled: 'Request cancelled',
					leaveError: 'Failed to leave organization',
					deleteError: 'Failed to delete organization',
					pendingRequestMessage: 'Your request to join this organization is pending approval.',
					pendingRequestTitle: 'Request Pending',
					noDisplayNameWarning: '⚠️ Warning: You haven\'t set an in-game name. Organization members will see you as "Inconnu" (Unknown).',
					setDisplayName: 'Set my name',
					accountPage: 'Account page',
					tabInventory: 'Inventory',
					tabMembers: 'Members'
				}
	);
</script>

<svelte:head>
	<title>{org?.name || t.notFound} - Star Citizen Wikelo Emporium Tracker</title>
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden pb-20">
	<!-- Space Background -->
	<SpaceBackground />



	<!-- Main Content -->
	<div class="font-rajdhani relative z-10 container mx-auto max-w-7xl px-4 py-8">
		<!-- Top Navigation -->
		<div class="mb-4 transition-opacity opacity-100">
			<div class="flex items-start justify-between mb-3">
				<a
					href="/organizations"
					class="cursor-pointer rounded-lg border-2 border-cyan-500/50 bg-slate-900/80 p-3 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition-all hover:scale-110 hover:border-cyan-500/70 hover:bg-slate-800/90 hover:shadow-cyan-500/40"
					title={t.backToOrgs}
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
						class="text-cyan-400"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
				</a>

				<div class="hidden sm:flex items-center gap-3">
					<LanguageToggle />
					<AuthButton variant="compact" />
				</div>
			</div>

			<div class="flex sm:hidden items-center justify-center gap-3">
				<LanguageToggle />
				<AuthButton variant="compact" />
			</div>
		</div>
		{#if isLoading}
			<div class="text-center text-gray-400">
				<div class="inline-flex items-center gap-2">
					<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span>{t.loading}</span>
				</div>
			</div>
		{:else if !org}
			<div class="text-center">
				<div class="inline-block rounded-2xl border border-red-500/30 bg-slate-900/50 p-12 backdrop-blur-sm">
					<p class="mb-4 text-6xl">❌</p>
					<p class="text-xl font-semibold text-red-400">{t.notFound}</p>
				</div>
			</div>
		{:else}
			<!-- Organization Header, Wikelo Style -->
			<header
				class="relative mb-8 overflow-hidden rounded-xl border border-white/10 bg-slate-900/85 backdrop-blur-xl"
			>
				<!-- Animated top border -->
				<div
					class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-yellow-400 to-cyan-400"
				></div>

				<div class="p-4 sm:p-8">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<!-- Logo & Info Section -->
						<div class="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center">
							<!-- Image -->
							<div class="group relative shrink-0 flex justify-center sm:block w-full sm:w-auto">
								<div class="absolute inset-0 bg-cyan-400/20 blur-xl opacity-50 rounded-xl"></div>
								<div
									class="relative flex items-center justify-center w-full sm:w-[480px] aspect-video"
								>
									<div
										class="burned-image-container h-full w-full overflow-hidden rounded-xl border-2 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
									>
										{#if org.image_url}
											<ImageWithFallback
												src={org.image_url}
												alt={org.name}
												itemName={org.name}
												class="h-full w-full object-cover"
												width={480}
												height={270}
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center bg-slate-900 border border-yellow-500/20 relative overflow-hidden">
												<!-- Background patterns -->
												<div class="absolute inset-0 opacity-10" 
													style="background-image: radial-gradient(circle at 50% 50%, #ca8a04 1px, transparent 1px); background-size: 20px 20px;">
												</div>
												
												<!-- Animated scanline -->
												<div class="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent animate-scan pointer-events-none"></div>
												
												<div class="relative z-10 flex flex-col items-center justify-center text-yellow-500/80">
													<!-- Banu/Tech Icon -->
													<div class="mb-3 text-7xl opacity-80 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
														👥
													</div>
													
													<!-- Text -->
													<div class="font-orbitron text-sm font-bold tracking-[0.2em] uppercase text-yellow-400 opacity-80">
														NO SIGNAL
													</div>
													<div class="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
													<div class="mt-1 font-rajdhani text-xs tracking-widest text-orange-400 opacity-60">
														BANU ENCRYPTION
													</div>
												</div>
												
												<!-- Corner accents -->
												<div class="absolute top-4 left-4 h-3 w-3 border-t border-l border-yellow-500/50"></div>
												<div class="absolute top-4 right-4 h-3 w-3 border-t border-r border-yellow-500/50"></div>
												<div class="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-yellow-500/50"></div>
												<div class="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-yellow-500/50"></div>
											</div>
										{/if}
									</div>
								</div>
							</div>

							<div class="flex-1 text-center sm:text-left">
								<h1
									class="font-orbitron mb-2 bg-linear-to-r from-yellow-400 to-cyan-400 bg-clip-text text-3xl font-black tracking-wider text-transparent uppercase sm:text-4xl"
								>
									{org.name}
								</h1>
								{#if org.description}
									<p class="text-sm font-light tracking-wide text-gray-300 line-clamp-3 max-w-2xl">
										{org.description}
									</p>
								{/if}
							</div>
						</div>

						<!-- Actions & Stats -->
						<div class="flex flex-col items-center sm:items-end gap-4">
							<!-- Stats badge -->
							<div
								class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2"
							>
								<span class="text-cyan-400">👥</span>
								<span class="mb-1 text-xs tracking-wider text-gray-400 uppercase"
									>{(org.member_count || 0) !== 1 ? t.members : t.member}</span
								>
								<span class="font-orbitron text-shadow-glow text-xl font-bold text-cyan-400"
									>{org.member_count || 0}</span
								>
							</div>

							<!-- Action Buttons -->
							<div class="flex gap-2">
								{#if !organizationsStore.currentUser}
									<button
										onclick={() => (authStore.showAuthDialog = true)}
										class="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-6 py-2 font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20"
									>
										{t.loginToJoin}
									</button>
								{:else if pendingRequest}
									<button
										onclick={handleCancelRequest}
										class="rounded-lg border border-orange-500/50 bg-orange-500/10 px-6 py-2 font-semibold text-orange-400 transition-all hover:border-orange-500 hover:bg-orange-500/20"
									>
										{t.cancelRequest}
									</button>
								{:else if !isMember && org.owner_id !== organizationsStore.currentUser.id}
									<button
										onclick={handleJoin}
										class="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-6 py-2 font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20"
									>
										{t.joinOrg}
									</button>
								{:else if isMember && !isOwner}
									<button
										onclick={() => (showLeaveConfirm = true)}
										class="rounded-lg border border-red-500/50 bg-red-500/10 px-6 py-2 font-semibold text-red-400 transition-all hover:border-red-500 hover:bg-red-500/20"
									>
										{t.leaveOrg}
									</button>
								{/if}

								{#if isOwner}
									{#if canDeleteOrg}
										<button
											onclick={() => (showDeleteConfirm = true)}
											class="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 font-semibold text-red-400 transition-all hover:border-red-500 hover:bg-red-500/20"
										>
											{t.delete}
										</button>
									{:else}
										<button
											disabled
											class="rounded-lg border border-gray-500/50 bg-gray-500/10 px-4 py-2 font-semibold text-gray-500 cursor-not-allowed opacity-50"
											title={t.cannotDelete}
										>
											{t.delete}
										</button>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent"></div>
			</header>

			<!-- Pending Request Message (For users with pending request) -->
			{#if pendingRequest && !isMember}
				<div class="mb-8 space-y-4">
					<div class="rounded-xl border-2 border-orange-500/30 bg-orange-500/10 p-6 backdrop-blur-sm">
						<div class="flex items-start gap-4">
							<div class="mt-1 shrink-0">
								<svg class="h-8 w-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="flex-1">
								<h3 class="mb-2 text-lg font-bold text-orange-400">{t.pendingRequestTitle}</h3>
								<p class="text-orange-300">{t.pendingRequestMessage}</p>
							</div>
						</div>
					</div>

					<!-- Warning if no display_name -->
					{#if !userProfile?.display_name}
						<div class="rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 p-6 backdrop-blur-sm">
							<div class="flex items-start gap-4">
								<div class="mt-1 shrink-0">
									<svg class="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
									</svg>
								</div>
								<div class="flex-1">
									<p class="mb-3 text-yellow-300">{t.noDisplayNameWarning}</p>
									<a
										href="/account"
										class="inline-flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20"
									>
										<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
										</svg>
										{t.setDisplayName}
									</a>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Join Requests Section (Owner/Admin Only) -->
			{#if isManager && requests.length > 0}
				<div class="mb-16">
					<!-- Section Header -->
					<div class="mb-8 flex items-center gap-3">
						<div class="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
						<h2 class="font-orbitron text-3xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
							<span class="inline-flex items-center gap-2">
								<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
								</svg>
								{t.pendingRequests}
								<span class="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400 ring-1 ring-yellow-500/50">
									{requests.length}
								</span>
							</span>
						</h2>
						<div class="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
					</div>

					<div class="space-y-4">
						{#each requests as request (request.id)}
							<JoinRequestCard
								{request}
								onApprove={async () => {
									await organizationsStore.approveJoinRequest(request.id);
								}}
								onReject={async () => {
									await organizationsStore.rejectJoinRequest(request.id);
								}}
							/>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Tab Navigation (Members Only) -->
			{#if isMember}
				<div class="mb-8">
					<div class="flex items-center justify-center gap-4">
						<button
							onclick={() => (activeTab = 'inventory')}
							class="group relative flex items-center gap-3 rounded-xl border-2 px-8 py-4 font-semibold transition-all {activeTab ===
							'inventory'
								? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/30'
								: 'border-white/10 bg-slate-900/50 text-gray-400 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300'}"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
							<span class="font-orbitron text-lg tracking-wider uppercase">{t.tabInventory}</span>
							{#if inventory.length > 0}
								<span
									class="rounded-full bg-purple-500/30 px-2.5 py-0.5 text-xs font-bold ring-1 ring-purple-500/50"
								>
									{inventory.length}
								</span>
							{/if}
							<!-- Active indicator -->
							{#if activeTab === 'inventory'}
								<div
									class="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
								></div>
							{/if}
						</button>

						<button
							onclick={() => (activeTab = 'members')}
							class="group relative flex items-center gap-3 rounded-xl border-2 px-8 py-4 font-semibold transition-all {activeTab ===
							'members'
								? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/30'
								: 'border-white/10 bg-slate-900/50 text-gray-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300'}"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span class="font-orbitron text-lg tracking-wider uppercase">{t.tabMembers}</span>
							<span
								class="rounded-full bg-cyan-500/30 px-2.5 py-0.5 text-xs font-bold ring-1 ring-cyan-500/50"
							>
								{org?.member_count || 0}
							</span>
							<!-- Active indicator -->
							{#if activeTab === 'members'}
								<div
									class="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
								></div>
							{/if}
						</button>
					</div>
				</div>
			{/if}

			<!-- Inventory Section (Members Only) -->
			{#if isMember && activeTab === 'inventory'}
				<div class="mb-16">
					<OrganizationInventory {inventory} />
				</div>
			{/if}

			<!-- Members Section -->
			{#if !isMember || activeTab === 'members'}
			<div>
				<!-- Section Header (only show if not a member, members see tabs instead) -->
				{#if !isMember}
				<div class="mb-8 flex items-center gap-3">
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
					<h2 class="font-orbitron text-3xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
						<span class="inline-flex items-center gap-2">
							<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
							</svg>
							{t.orgMembers}
							<span class="rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/50">
								{org?.member_count || 0}
							</span>
						</span>
					</h2>
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
				</div>
				{/if}

				<!-- Members Grid - Only visible to members -->
				{#if !isMember}
					<!-- Non-members see locked state -->
					<div class="text-center py-16 rounded-xl border-2 border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm">
						<div class="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 ring-4 ring-cyan-500/20">
							<svg class="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
							</svg>
						</div>
						<p class="mb-2 text-2xl font-bold text-cyan-400">{t.membersOnly}</p>
						<p class="text-gray-400">{t.joinToSeeMembers}</p>
					</div>
				{:else if members.length > 0}
					<div class="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
						{#each members as member (member.id)}
							<MemberCard
								{member}
								canManage={isManager}
								isCurrentUser={member.user_id === organizationsStore.currentUser?.id}
								onPromote={async () => {
									await organizationsStore.promoteMember(member.id);
								}}
								onDemote={async () => {
									await organizationsStore.demoteMember(member.id);
								}}
								onRemove={async () => {
									await organizationsStore.removeMember(member.id);
								}}
							/>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12 rounded-xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
						<p class="mb-2 text-6xl">👥</p>
						<p class="text-xl font-semibold text-gray-400">{t.noMembers}</p>
						<p class="mt-2 text-sm text-gray-500">{t.beFirstMember}</p>
					</div>
				{/if}
			</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Confirm Dialogs -->
<ConfirmDialog
	bind:isOpen={showLeaveConfirm}
	title={t.leaveConfirmTitle}
	message={t.leaveConfirmMessage}
	confirmText={t.leave}
	cancelText={t.cancel}
	isDestructive={true}
	onConfirm={handleLeave}
	onCancel={() => (showLeaveConfirm = false)}
/>

<ConfirmDialog
	bind:isOpen={showDeleteConfirm}
	title={t.deleteConfirmTitle}
	message={t.deleteConfirmMessage}
	confirmText={t.delete}
	cancelText={t.cancel}
	isDestructive={true}
	onConfirm={handleDelete}
	onCancel={() => (showDeleteConfirm = false)}
/>
