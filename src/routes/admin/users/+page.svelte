<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	function statusClass(status: string): string {
		switch (status) {
			case 'admin':
				return 'border-purple-400/60 bg-purple-500/20 text-purple-200';
			case 'user':
				return 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200';
			default:
				return 'border-yellow-400/60 bg-yellow-500/20 text-yellow-200';
		}
	}
</script>

<div class="space-y-6">
	<div class="mb-6">
		<div class="mb-2 flex items-center gap-3">
			<span class="text-4xl">👥</span>
			<h2
				class="font-orbitron text-2xl font-bold tracking-wider text-cyan-300 uppercase sm:text-3xl"
			>
				User Management
			</h2>
		</div>
		<p class="text-sm text-cyan-300/60 sm:text-base">
			Manage user roles, accounts, and submitted content
		</p>
		<div class="mt-4 h-px bg-linear-to-r from-cyan-400/50 via-purple-400/50 to-transparent"></div>
	</div>

	{#if data.error}
		<div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
			{data.error}
		</div>
	{/if}

	<div class="overflow-x-auto rounded-xl border-2 border-cyan-500/30 bg-black/30">
		<table class="min-w-full text-left text-sm text-gray-200">
			<thead class="bg-cyan-500/10 text-xs tracking-wider text-cyan-200 uppercase">
				<tr>
					<th class="px-4 py-3">User</th>
					<th class="px-4 py-3">Email</th>
					<th class="px-4 py-3">Status</th>
					<th class="px-4 py-3">Created</th>
					<th class="px-4 py-3 text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user (user.id)}
					<tr class="border-t border-cyan-500/15">
						<td class="px-4 py-3 font-semibold text-white">{user.displayName}</td>
						<td class="px-4 py-3 text-cyan-100/90">{user.email}</td>
						<td class="px-4 py-3">
							<span
								class={`rounded-md border px-2 py-1 text-xs font-semibold uppercase ${statusClass(user.status)}`}
							>
								{user.status}
							</span>
						</td>
						<td class="px-4 py-3 text-gray-300"
							>{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</td
						>
						<td class="px-4 py-3">
							<div class="flex justify-end gap-2">
								<form method="POST" action="?/purgeItems">
									<input type="hidden" name="userId" value={user.id} />
									<input type="hidden" name="userEmail" value={user.email} />
									<button
										type="submit"
										class="rounded-md border border-orange-400/60 bg-orange-500/20 px-3 py-2 text-xs font-semibold text-orange-100 transition hover:bg-orange-500/30"
									>
										Purge Items
									</button>
								</form>

								{#if data.isLocalAdmin && !user.isDefaultLocalAdmin}
									<form method="POST" action="?/toggleAdmin">
										<input type="hidden" name="userId" value={user.id} />
										<input
											type="hidden"
											name="makeAdmin"
											value={user.status === 'admin' ? '0' : '1'}
										/>
										<button
											type="submit"
											class="rounded-md border border-cyan-400/60 bg-cyan-500/20 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
										>
											{user.status === 'admin' ? 'Demote' : 'Promote to Admin'}
										</button>
									</form>
								{/if}

								{#if !user.isDefaultLocalAdmin && user.id !== data.currentUserId}
									<form method="POST" action="?/deleteAccount">
										<input type="hidden" name="userId" value={user.id} />
										<button
											type="submit"
											class="rounded-md border border-red-400/60 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/30"
										>
											Delete Account
										</button>
									</form>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
