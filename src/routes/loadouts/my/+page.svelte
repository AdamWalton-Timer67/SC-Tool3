<script lang="ts">
	let { data } = $props();
	let name = $state('');
	let ship = $state('');
	let notes = $state('');
	let laser_code = $state(data.lasers[0]?.code ?? '');
	let module_codes = $state<string[]>([]);
	let saving = $state(false);

	const laserByCode = $derived(new Map(data.lasers.map((l: any) => [l.code, l])));
	const moduleByCode = $derived(new Map(data.modules.map((m: any) => [m.code, m])));

	async function save() {
		if (!name.trim()) return;
		saving = true;
		try {
			await fetch('/api/loadouts/my', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					ship: ship.trim(),
					notes: notes.trim(),
					laser_code,
					module_codes
				})
			});
			location.reload();
		} finally {
			saving = false;
		}
	}

	async function removeLoadout(id: string) {
		await fetch(`/api/loadouts/my/${id}`, { method: 'DELETE' });
		location.reload();
	}
</script>

{#if !data.userId}
	<p>Please sign in to save personal loadouts.</p>
{:else}
	<div class="mb-4 rounded bg-slate-800 p-4">
		<h2 class="mb-3 text-xl font-semibold">Create loadout</h2>
		<div class="grid gap-2 md:grid-cols-2">
			<input bind:value={name} class="rounded bg-slate-900 p-2" placeholder="Loadout name" />
			<input bind:value={ship} class="rounded bg-slate-900 p-2" placeholder="Ship (optional)" />
		</div>
		<select bind:value={laser_code} class="mt-2 w-full rounded bg-slate-900 p-2">
			{#each data.lasers as l}
				<option value={l.code}>{l.name}</option>
			{/each}
		</select>
		<div class="my-2 max-h-40 overflow-auto rounded border border-slate-700 p-2">
			{#each data.modules as m}
				<label class="mr-3 inline-block text-sm"
					><input type="checkbox" bind:group={module_codes} value={m.code} /> {m.name}</label
				>
			{/each}
		</div>
		<textarea
			bind:value={notes}
			class="w-full rounded bg-slate-900 p-2"
			rows="3"
			placeholder="Notes (optional)"
		></textarea>
		<button
			class="mt-2 rounded bg-cyan-700 px-3 py-1 disabled:opacity-50"
			onclick={save}
			disabled={saving}>Save</button
		>
	</div>

	<h2 class="mb-3 text-xl font-semibold">My saved loadouts</h2>
	<div class="space-y-2">
		{#each data.loadouts as l}
			<div class="rounded bg-slate-800 p-3">
				<div class="mb-1 flex items-center justify-between">
					<strong>{l.name}</strong>
					<button class="rounded bg-red-700 px-2 py-1 text-xs" onclick={() => removeLoadout(l.id)}
						>Delete</button
					>
				</div>
				<div class="text-sm text-slate-300">Ship: {l.ship || '—'}</div>
				<div class="text-sm">Laser: {laserByCode.get(l.laser_code)?.name || l.laser_code}</div>
				<div class="text-sm">
					Modules:
					{#if (l.module_codes || []).length}
						{(l.module_codes || [])
							.map((code: string) => moduleByCode.get(code)?.name || code)
							.join(', ')}
					{:else}
						—
					{/if}
				</div>
				{#if l.notes}
					<div class="mt-1 text-xs text-slate-400">{l.notes}</div>
				{/if}
			</div>
		{:else}
			<p class="text-slate-300">No saved loadouts yet.</p>
		{/each}
	</div>
{/if}
