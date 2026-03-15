<script lang="ts">
	let { data } = $props();
	let selectedLaserCode = $state(data.lasers[0]?.code ?? '');
	let selectedModuleCode = $state(data.modules[0]?.code ?? '');

	const selectedLaser = $derived(
		data.lasers.find((l: any) => l.code === selectedLaserCode) ?? data.lasers[0]
	);
	const selectedModule = $derived(
		data.modules.find((m: any) => m.code === selectedModuleCode) ?? data.modules[0]
	);

	let laserStats = $state('');
	let laserPrices = $state('');
	let moduleStats = $state('');
	let modulePrices = $state('');

	$effect(() => {
		laserStats = JSON.stringify(selectedLaser?.stats ?? {}, null, 2);
		laserPrices = JSON.stringify(selectedLaser?.prices ?? {}, null, 2);
	});

	$effect(() => {
		moduleStats = JSON.stringify(selectedModule?.stats ?? {}, null, 2);
		modulePrices = JSON.stringify(selectedModule?.prices ?? {}, null, 2);
	});

	async function saveLaser() {
		await fetch(`/api/admin/loadouts/lasers?code=${selectedLaser.code}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				...selectedLaser,
				stats: JSON.parse(laserStats),
				prices: JSON.parse(laserPrices)
			})
		});
		alert('Laser updated');
	}

	async function saveModule() {
		await fetch(`/api/admin/loadouts/modules?code=${selectedModule.code}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				...selectedModule,
				stats: JSON.parse(moduleStats),
				prices: JSON.parse(modulePrices)
			})
		});
		alert('Module updated');
	}
</script>

<h2 class="mb-4 text-2xl font-bold">Mining Loadout Data Admin</h2>
<div class="grid gap-4 md:grid-cols-2">
	<div class="rounded bg-slate-800 p-4">
		<h3 class="mb-2 font-semibold">Edit Laser</h3>
		<select bind:value={selectedLaserCode} class="w-full bg-slate-900 p-2"
			>{#each data.lasers as l}<option value={l.code}>{l.name}</option>{/each}</select
		>
		<textarea class="mt-2 h-32 w-full bg-slate-900 p-2" bind:value={laserStats}></textarea>
		<textarea class="mt-2 h-24 w-full bg-slate-900 p-2" bind:value={laserPrices}></textarea>
		<button class="mt-2 rounded bg-cyan-700 px-3 py-1" onclick={saveLaser}>Save laser</button>
	</div>
	<div class="rounded bg-slate-800 p-4">
		<h3 class="mb-2 font-semibold">Edit Module</h3>
		<select bind:value={selectedModuleCode} class="w-full bg-slate-900 p-2"
			>{#each data.modules as m}<option value={m.code}>{m.name}</option>{/each}</select
		>
		<textarea class="mt-2 h-32 w-full bg-slate-900 p-2" bind:value={moduleStats}></textarea>
		<textarea class="mt-2 h-24 w-full bg-slate-900 p-2" bind:value={modulePrices}></textarea>
		<button class="mt-2 rounded bg-cyan-700 px-3 py-1" onclick={saveModule}>Save module</button>
	</div>
</div>
