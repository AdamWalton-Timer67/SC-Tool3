<script lang="ts">
	let { data } = $props();
	let laserCode = $state(data.lasers[0]?.code ?? '');
	let moduleCodes = $state<string[]>([]);
	const laser = $derived(data.lasers.find((l: any) => l.code === laserCode));
	const selectedModules = $derived(data.modules.filter((m: any) => moduleCodes.includes(m.code)));
	const combinedStats = $derived(
		selectedModules.reduce((acc: any, item: any) => {
			for (const [k, v] of Object.entries(item.stats || {})) {
				if (typeof v === 'number') acc[k] = (acc[k] ?? 1) * v;
			}
			return acc;
		}, {})
	);
</script>

<div class="grid gap-4 md:grid-cols-2">
	<div class="rounded bg-slate-800 p-4">
		<label class="mb-2 block">Laser</label>
		<select bind:value={laserCode} class="w-full bg-slate-900 p-2">
			{#each data.lasers as l}
				<option value={l.code}>{l.name}</option>
			{/each}
		</select>
		<label class="mt-4 mb-2 block">Modules</label>
		{#each data.modules as m}
			<label class="mb-1 flex items-center gap-2"
				><input type="checkbox" value={m.code} bind:group={moduleCodes} /> {m.name}</label
			>
		{/each}
	</div>
	<div class="rounded bg-slate-800 p-4">
		<h2 class="mb-2 text-xl font-semibold">Result</h2>
		<p class="mb-2">Selected laser: <strong>{laser?.name}</strong></p>
		<p class="mb-2">Modules: {selectedModules.length}</p>
		<div class="text-sm">
			{#each Object.entries(combinedStats) as [k, v]}
				<div>{k}: {Number(v).toFixed(3)}</div>
			{/each}
		</div>
	</div>
</div>
