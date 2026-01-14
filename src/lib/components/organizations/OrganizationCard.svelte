<script lang="ts">
	import type { Organization } from '$lib/types/organizations';

	interface Props {
		organization: Organization;
		showJoinButton?: boolean;
		onJoinClick?: () => void;
		isPending?: boolean;
		currentUserId?: string | null;
	}

	let { organization, showJoinButton = false, onJoinClick, isPending = false, currentUserId }: Props = $props();

	// Don't show join button if user is the owner or already a member
	let canJoin = $derived(showJoinButton && organization.owner_id !== currentUserId && !organization.is_member);
	let isMember = $derived(organization.is_member || organization.owner_id === currentUserId);
</script>

<a
	href="/organizations/{organization.slug}"
	class="group relative overflow-hidden rounded-xl border border-yellow-500/30 bg-slate-900/85 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-yellow-500/70 hover:shadow-2xl hover:shadow-yellow-500/20"
>
	<!-- Animated glow on hover -->
	<div
		class="absolute inset-0 bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-0 blur-xl transition-opacity group-hover:opacity-20"
	></div>

	<!-- Image with glitch effect -->
	<div class="relative">
	<div class="mb-4 flex justify-center p-6 pb-0">
		<div class="group relative">
			<!-- Glitch layers (hover only) -->
			<div
				class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<div class="animate-glitch-1 absolute inset-0 bg-yellow-400/20 blur-sm"></div>
				<div class="animate-glitch-2 absolute inset-0 bg-orange-500/20 blur-sm"></div>
			</div>

			<!-- Base shadow layers (always visible) -->
			<div class="absolute inset-0 bg-yellow-400/10 blur-md"></div>
			<div class="absolute inset-0 bg-orange-500/5 blur-lg"></div>

			<!-- Image avec bordure et effet de bords brûlés -->
			<div
				class="relative flex items-center justify-center"
				style="width: 260px; height: 160px;"
			>
				<div class="burned-image-container">
					{#if organization.image_url}
						<img
							src={organization.image_url}
							alt={organization.name}
							class="burned-image-edges h-full w-full max-h-[150px] max-w-[250px] object-cover"
						/>
					{:else}
						<div class="burned-image-edges relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-900 border border-yellow-500/20">
							<!-- Background patterns -->
							<div class="absolute inset-0 opacity-10" 
								style="background-image: radial-gradient(circle at 50% 50%, #ca8a04 1px, transparent 1px); background-size: 20px 20px;">
							</div>
							
							<!-- Animated scanline -->
							<div class="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent animate-scan pointer-events-none"></div>
							
							<div class="relative z-10 px-3 py-1 flex flex-col items-center justify-center text-yellow-500/80">
								<!-- Text -->
								<div class="font-orbitron p-1 text-xs font-bold tracking-[0.2em] uppercase text-yellow-400 opacity-80">
									NO SIGNAL
								</div>
								<div class="mt-1 h-px w-16 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
								<div class="mt-1 font-rajdhani px-4 py-1 text-[10px] tracking-widest text-orange-400 opacity-60">
									BANU ENCRYPTION
								</div>
							</div>
							
							<!-- Corner accents -->
							<div class="absolute top-2 left-2 h-2 w-2 border-t border-l border-yellow-500/50"></div>
							<div class="absolute top-2 right-2 h-2 w-2 border-t border-r border-yellow-500/50"></div>
							<div class="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-yellow-500/50"></div>
							<div class="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-yellow-500/50"></div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

		<!-- Content -->
		<div class="px-6 pb-6 pt-2">
			<!-- Name with Member Badge -->
			<div class="mb-2 flex items-center justify-between gap-2">
				<h3 class="font-orbitron text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
					{organization.name}
				</h3>
				{#if isMember}
					<span class="flex items-center gap-1 rounded-full border border-green-500/50 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
						</svg>
						Member
					</span>
				{/if}
			</div>

			<!-- Description -->
			{#if organization.description}
				<p class="mb-4 line-clamp-2 text-sm text-gray-400">
					{organization.description}
				</p>
			{:else}
				<p class="mb-4 text-sm italic text-gray-500">No description</p>
			{/if}

			<!-- Stats -->
			<div class="mb-4 flex items-center gap-4 text-sm">
				<div class="flex items-center gap-1 text-cyan-400">
					<span>👥</span>
					<span>{organization.member_count || 0} member{(organization.member_count || 0) !== 1 ? 's' : ''}</span>
				</div>
			</div>

			<!-- Join Button -->
			{#if canJoin && onJoinClick}
				<button
					type="button"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onJoinClick?.();
					}}
					disabled={isPending}
					class="w-full rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 font-semibold text-yellow-400 transition-all hover:border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending ? 'Request Pending' : 'Join Organization'}
				</button>
			{/if}
		</div>
	</div>
</a>
