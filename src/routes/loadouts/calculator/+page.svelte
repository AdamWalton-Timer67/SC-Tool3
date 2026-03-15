<script lang="ts">
	let { data } = $props();

	type MineItem = {
		code: string;
		name: string;
		size?: number;
		slots?: number;
		stats: Record<string, number>;
		prices: Record<string, number>;
	};

	type ShipPreset = {
		code: string;
		name: string;
		turrets: Array<{ id: string; label: string; laserSize: number; moduleSlots: number }>;
	};

	const SHIPS: ShipPreset[] = [
		{
			code: 'prospector',
			name: 'MISC Prospector',
			turrets: [{ id: 't1', label: 'Turret 1', laserSize: 1, moduleSlots: 3 }]
		},
		{
			code: 'mole',
			name: 'ARGO MOLE',
			turrets: [
				{ id: 't1', label: 'Front Turret', laserSize: 2, moduleSlots: 3 },
				{ id: 't2', label: 'Left Turret', laserSize: 2, moduleSlots: 3 },
				{ id: 't3', label: 'Right Turret', laserSize: 2, moduleSlots: 3 }
			]
		},
		{
			code: 'arrastra',
			name: 'RSI Arrastra',
			turrets: [
				{ id: 't1', label: 'Turret 1', laserSize: 2, moduleSlots: 3 },
				{ id: 't2', label: 'Turret 2', laserSize: 2, moduleSlots: 3 },
				{ id: 't3', label: 'Turret 3', laserSize: 2, moduleSlots: 3 },
				{ id: 't4', label: 'Turret 4', laserSize: 2, moduleSlots: 3 }
			]
		},
		{
			code: 'roc',
			name: 'Greycat ROC',
			turrets: [{ id: 't1', label: 'Mining Arm', laserSize: 1, moduleSlots: 3 }]
		},
		{
			code: 'rocds',
			name: 'Greycat ROC-DS',
			turrets: [{ id: 't1', label: 'Mining Arm', laserSize: 1, moduleSlots: 3 }]
		}
	];

	let shipCode = $state(SHIPS[0].code);
	let selectedStore = $state('');

	let turretLoadouts = $state<
		Array<{ turretId: string; laserCode: string; moduleCodes: string[] }>
	>([]);

	const currentShip = $derived(SHIPS.find((s) => s.code === shipCode) ?? SHIPS[0]);

	const laserByCode = $derived(new Map(data.lasers.map((l: MineItem) => [l.code, l])));
	const moduleByCode = $derived(new Map(data.modules.map((m: MineItem) => [m.code, m])));

	$effect(() => {
		turretLoadouts = currentShip.turrets.map((turret) => {
			const allowedLasers = data.lasers.filter(
				(l: MineItem) => Number(l.size ?? 0) === turret.laserSize
			);
			return {
				turretId: turret.id,
				laserCode: allowedLasers[0]?.code ?? '',
				moduleCodes: []
			};
		});
	});

	function fmt(value: number) {
		return Number.isInteger(value) ? String(value) : value.toFixed(3);
	}

	function computePrice(item: MineItem): number | null {
		const prices = item?.prices ?? {};
		if (selectedStore && prices[selectedStore] != null) return Number(prices[selectedStore]);
		const all = Object.values(prices)
			.map(Number)
			.filter((v) => Number.isFinite(v));
		if (!all.length) return null;
		return Math.min(...all);
	}

	function getTurretDef(turretId: string) {
		return currentShip.turrets.find((t) => t.id === turretId)!;
	}

	function setLaser(turretId: string, laserCode: string) {
		turretLoadouts = turretLoadouts.map((t) => (t.turretId === turretId ? { ...t, laserCode } : t));
	}

	function toggleModule(turretId: string, moduleCode: string) {
		const def = getTurretDef(turretId);
		turretLoadouts = turretLoadouts.map((turret) => {
			if (turret.turretId !== turretId) return turret;
			if (turret.moduleCodes.includes(moduleCode)) {
				return { ...turret, moduleCodes: turret.moduleCodes.filter((code) => code !== moduleCode) };
			}
			if (turret.moduleCodes.length >= def.moduleSlots) return turret;
			return { ...turret, moduleCodes: [...turret.moduleCodes, moduleCode] };
		});
	}

	const turretResults = $derived.by(() => {
		return turretLoadouts.map((loadout) => {
			const def = getTurretDef(loadout.turretId);
			const laser = laserByCode.get(loadout.laserCode) as MineItem | undefined;
			const modules = loadout.moduleCodes
				.map((code) => moduleByCode.get(code))
				.filter(Boolean) as MineItem[];

			const multipliers: Record<string, number> = {};
			for (const module of modules) {
				for (const [key, raw] of Object.entries(module.stats ?? {})) {
					const n = Number(raw);
					if (!Number.isFinite(n)) continue;
					multipliers[key] = (multipliers[key] ?? 1) * n;
				}
			}

			const baseStats = (laser?.stats ?? {}) as Record<string, number>;
			const finalStats: Record<string, number> = {};
			for (const key of new Set([...Object.keys(baseStats), ...Object.keys(multipliers)])) {
				const base = Number(baseStats[key] ?? 1);
				const mod = Number(multipliers[key] ?? 1);
				finalStats[key] = base * mod;
			}

			let totalPrice = 0;
			for (const part of [laser, ...modules]) {
				if (!part) continue;
				const p = computePrice(part);
				if (p != null) totalPrice += p;
			}

			return {
				def,
				laser,
				modules,
				stats: finalStats,
				totalPrice
			};
		});
	});

	const aggregateStats = $derived.by(() => {
		const totals: Record<string, number> = {};
		for (const turret of turretResults) {
			for (const [k, v] of Object.entries(turret.stats)) {
				totals[k] = (totals[k] ?? 0) + Number(v);
			}
		}
		return Object.entries(totals)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => ({ key, value }));
	});

	const aggregatePrice = $derived(turretResults.reduce((sum, t) => sum + t.totalPrice, 0));
</script>

<div class="grid gap-4 xl:grid-cols-2">
	<div class="rounded bg-slate-800 p-4">
		<h2 class="mb-3 text-xl font-semibold">1) Select ship</h2>
		<select bind:value={shipCode} class="w-full rounded bg-slate-900 p-2">
			{#each SHIPS as ship}
				<option value={ship.code}>{ship.name}</option>
			{/each}
		</select>

		<label for="store-select" class="mt-3 mb-2 block text-sm text-slate-300">Price location</label>
		<select id="store-select" bind:value={selectedStore} class="w-full rounded bg-slate-900 p-2">
			<option value="">Cheapest across all stores</option>
			{#each data.stores as store}
				<option value={String(store.code)}>{store.name}</option>
			{/each}
		</select>

		<h2 class="mt-4 mb-2 text-xl font-semibold">2) Configure turrets</h2>
		<div class="space-y-3">
			{#each turretLoadouts as turret}
				{@const def = currentShip.turrets.find((t) => t.id === turret.turretId)}
				{@const allowedLasers = data.lasers.filter(
					(l: MineItem) => Number(l.size ?? 0) === Number(def?.laserSize ?? 0)
				)}
				<div class="rounded border border-slate-700 bg-slate-900 p-3">
					<div class="mb-2 flex items-center justify-between text-sm">
						<strong>{def?.label}</strong>
						<span class="text-slate-400"
							>Laser S{def?.laserSize} • Modules {turret.moduleCodes
								.length}/{def?.moduleSlots}</span
						>
					</div>
					<select
						value={turret.laserCode}
						onchange={(e) =>
							setLaser(turret.turretId, (e.currentTarget as HTMLSelectElement).value)}
						class="mb-2 w-full rounded bg-slate-800 p-2 text-sm"
					>
						{#each allowedLasers as l}
							<option value={l.code}>{l.name}</option>
						{/each}
					</select>
					<div class="grid gap-1 md:grid-cols-2">
						{#each data.modules as m}
							<button
								type="button"
								class="rounded border px-2 py-1 text-left text-xs {turret.moduleCodes.includes(
									m.code
								)
									? 'border-cyan-400 bg-cyan-950/40'
									: 'border-slate-700 bg-slate-800'}"
								onclick={() => toggleModule(turret.turretId, m.code)}
							>
								{m.name}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="rounded bg-slate-800 p-4">
		<h2 class="mb-3 text-xl font-semibold">3) Loadout stats</h2>
		<p class="mb-3 text-sm">
			Total estimated price: <strong>{aggregatePrice.toLocaleString()} aUEC</strong>
		</p>

		<div class="mb-4 rounded border border-slate-700">
			<table class="w-full text-sm">
				<thead class="bg-slate-900">
					<tr>
						<th class="px-2 py-1 text-left">Stat</th>
						<th class="px-2 py-1 text-right">Complete Loadout</th>
					</tr>
				</thead>
				<tbody>
					{#each aggregateStats as row}
						<tr class="border-t border-slate-700">
							<td class="px-2 py-1">{row.key}</td>
							<td class="px-2 py-1 text-right font-semibold">{fmt(row.value)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="space-y-2">
			{#each turretResults as turret}
				<div class="rounded border border-slate-700 bg-slate-900 p-2 text-sm">
					<div class="font-semibold">{turret.def.label}</div>
					<div class="text-slate-300">Laser: {turret.laser?.name ?? '—'}</div>
					<div class="text-slate-300">
						Modules: {turret.modules.length ? turret.modules.map((m) => m.name).join(', ') : '—'}
					</div>
					<div class="text-slate-400">Price: {turret.totalPrice.toLocaleString()} aUEC</div>
				</div>
			{/each}
		</div>
	</div>
</div>
