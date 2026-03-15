<script lang="ts">
	let { data } = $props();
	let name = $state('');
	let laser_code = $state(data.lasers[0]?.code ?? '');
	let module_codes = $state<string[]>([]);
	async function save() {
		await fetch('/api/loadouts/my', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name, laser_code, module_codes })
		});
		location.reload();
	}
</script>

{#if !data.userId}
	<p>Please sign in to save personal loadouts.</p>
{:else}
	<div class="mb-4 rounded bg-slate-800 p-4">
		<input bind:value={name} class="mr-2 bg-slate-900 p-2" placeholder="Loadout name" />
		<select bind:value={laser_code} class="mr-2 bg-slate-900 p-2"
			>{#each data.lasers as l}<option value={l.code}>{l.name}</option>{/each}</select
		>
		<div class="my-2 max-h-40 overflow-auto">
			{#each data.modules as m}
				<label class="mr-2 inline-block"
					><input type="checkbox" bind:group={module_codes} value={m.code} /> {m.name}</label
				>
			{/each}
		</div>
		<button class="rounded bg-cyan-700 px-3 py-1" onclick={save}>Save</button>
	</div>
	<div class="space-y-2">
		{#each data.loadouts as l}
			<div class="rounded bg-slate-800 p-3">
				<strong>{l.name}</strong> - {l.laser_code} ({(l.module_codes || []).join(', ')})
			</div>
		{/each}
	</div>
{/if}
