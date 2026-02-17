<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	// Use stats from server load
	const stats = $derived(data.stats);
	const pendingUsers = $derived(data.pendingUsers);
</script>

<div class="space-y-6">
	<!-- Header Section -->
	<div class="mb-6">
		<div class="mb-2 flex items-center gap-3">
			<span class="text-4xl">📊</span>
			<h2
				class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
			>
				System Dashboard
			</h2>
		</div>
		<p class="text-sm text-cyan-300/60 sm:text-base">
			Welcome to the Wikelo Emporium administration control panel
		</p>
		<div class="mt-4 h-px bg-linear-to-r from-cyan-400/50 via-purple-400/50 to-transparent"></div>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-5">
		<!-- Ingredients Card -->
		<div
			class="group relative rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-6 transition-all hover:scale-105 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-cyan-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<div class="mb-3 animate-pulse text-5xl">🧪</div>
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-cyan-300/60 uppercase sm:text-sm"
				>
					Total Ingredients
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-cyan-300 sm:text-4xl">
					{stats.ingredients}
				</p>
			</div>
		</div>

		<!-- Rewards Card -->
		<div
			class="group relative rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 transition-all hover:scale-105 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/5 via-pink-500/5 to-purple-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<div class="mb-3 animate-pulse text-5xl">🎁</div>
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-purple-300/60 uppercase sm:text-sm"
				>
					Total Rewards
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-purple-300 sm:text-4xl">
					{stats.rewards}
				</p>
			</div>
		</div>

		<!-- Locations Card -->
		<div
			class="group relative rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 transition-all hover:scale-105 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/5 via-cyan-500/5 to-blue-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<div class="mb-3 animate-pulse text-5xl">🗺️</div>
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-blue-300/60 uppercase sm:text-sm"
				>
					Total Locations
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-blue-300 sm:text-4xl">
					{stats.locations}
				</p>
			</div>
		</div>

		<!-- Users Card -->
		<div
			class="group relative rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 transition-all hover:scale-105 hover:border-yellow-500/60 hover:shadow-lg hover:shadow-yellow-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/5 via-orange-500/5 to-yellow-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<div class="mb-3 animate-pulse text-5xl">👥</div>
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-yellow-300/60 uppercase sm:text-sm"
				>
					Total Users
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-yellow-300 sm:text-4xl">
					{stats.users}
				</p>
			</div>
		</div>

		<!-- Suggestions Card -->
		<div
			class="group relative rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 transition-all hover:scale-105 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/30"
		>
			<div
				class="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/5 via-emerald-500/5 to-green-400/5 opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative">
				<div class="mb-3 animate-pulse text-5xl">💡</div>
				<h3
					class="font-orbitron mb-1 text-xs font-medium tracking-wider text-green-300/60 uppercase sm:text-sm"
				>
					Total Suggestions
				</h3>
				<p class="text-shadow-glow font-orbitron text-3xl font-bold text-green-300 sm:text-4xl">
					{stats.suggestions}
				</p>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>
			<h3
				class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase sm:text-xl"
			>
				⚡ Quick Actions
			</h3>
			<div class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<a
				href="/admin/ingredients/new"
				class="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-5 transition-all hover:scale-105 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/30"
			>
				<span class="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">➕</span>
				<div>
					<div
						class="font-orbitron text-sm font-bold tracking-wide text-cyan-300 uppercase sm:text-base"
					>
						Add Ingredient
					</div>
					<div class="text-xs text-cyan-300/60 sm:text-sm">Create new ingredient entry</div>
				</div>
			</a>

			<a
				href="/admin/rewards/new"
				class="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-5 transition-all hover:scale-105 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30"
			>
				<span class="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">➕</span>
				<div>
					<div
						class="font-orbitron text-sm font-bold tracking-wide text-purple-300 uppercase sm:text-base"
					>
						Add Reward
					</div>
					<div class="text-xs text-purple-300/60 sm:text-sm">Create new reward entry</div>
				</div>
			</a>

			<a
				href="/admin/locations/new"
				class="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5 transition-all hover:scale-105 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30"
			>
				<span class="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">➕</span>
				<div>
					<div
						class="font-orbitron text-sm font-bold tracking-wide text-blue-300 uppercase sm:text-base"
					>
						Add Location
					</div>
					<div class="text-xs text-blue-300/60 sm:text-sm">Create new location entry</div>
				</div>
			</a>

			<a
				href="/admin/suggestions"
				class="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-5 transition-all hover:scale-105 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/30"
			>
				<span class="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">💡</span>
				<div>
					<div
						class="font-orbitron text-sm font-bold tracking-wide text-green-300 uppercase sm:text-base"
					>
						Suggestions
					</div>
					<div class="text-xs text-green-300/60 sm:text-sm">Manage user feedback</div>
				</div>
			</a>
		</div>
	</div>

	<!-- Pending User Approvals -->
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="h-px flex-1 bg-linear-to-r from-transparent via-amber-400/50 to-transparent"
			></div>
			<h3
				class="font-orbitron text-lg font-semibold tracking-wider text-amber-300 uppercase sm:text-xl"
			>
				📝 Pending User Approvals
			</h3>
			<div
				class="h-px flex-1 bg-linear-to-r from-transparent via-amber-400/50 to-transparent"
			></div>
		</div>

		<div
			class="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 sm:p-6"
		>
			{#if pendingUsers.length === 0}
				<p class="text-sm text-amber-200/80 sm:text-base">
					No users are currently waiting for approval.
				</p>
			{:else}
				<div class="space-y-3">
					{#each pendingUsers as user}
						<div
							class="flex flex-col gap-4 rounded-lg border border-amber-400/30 bg-black/20 p-4 lg:flex-row lg:items-center lg:justify-between"
						>
							<div class="space-y-1">
								<p class="text-sm font-semibold text-amber-200 sm:text-base">
									{user.characterName}
								</p>
								<p class="text-xs text-amber-100/80 sm:text-sm">{user.email}</p>
							</div>
							<div class="flex gap-2">
								<form method="POST" action="?/acceptPendingUser">
									<input type="hidden" name="userId" value={user.id} />
									<button
										type="submit"
										class="rounded-md border border-green-400/60 bg-green-500/20 px-3 py-2 text-xs font-semibold text-green-200 transition hover:bg-green-500/30 sm:text-sm"
									>
										Accept
									</button>
								</form>
								<form method="POST" action="?/rejectPendingUser">
									<input type="hidden" name="userId" value={user.id} />
									<button
										type="submit"
										class="rounded-md border border-red-400/60 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/30 sm:text-sm"
									>
										Reject
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- System Information -->
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>
			<h3
				class="font-orbitron text-lg font-semibold tracking-wider text-cyan-300 uppercase sm:text-xl"
			>
				🖥️ System Status
			</h3>
			<div class="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>
		</div>

		<div
			class="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6"
		>
			<div class="space-y-3 text-sm sm:text-base">
				<div
					class="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3"
				>
					<span class="text-2xl">✅</span>
					<div>
						<span class="font-orbitron font-bold text-green-300">Database:</span>
						<span class="ml-2 text-green-300/80">Connected & Operational</span>
					</div>
				</div>
				<div
					class="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3"
				>
					<span class="text-2xl">✅</span>
					<div>
						<span class="font-orbitron font-bold text-green-300">Authentication:</span>
						<span class="ml-2 text-green-300/80">Active (Supabase Auth)</span>
					</div>
				</div>
				<div
					class="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3"
				>
					<span class="text-2xl">✅</span>
					<div>
						<span class="font-orbitron font-bold text-green-300">Image Upload:</span>
						<span class="ml-2 text-green-300/80">Configured (AWS S3)</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
