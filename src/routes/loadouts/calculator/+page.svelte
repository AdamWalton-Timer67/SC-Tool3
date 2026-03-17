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
		turrets: Array<{ id: string; label: string; laserSize: number }>;
	};

	const SHIPS: ShipPreset[] = [
		{
			code: 'prospector',
			name: 'MISC Prospector',
			turrets: [{ id: 't1', label: 'Turret 1', laserSize: 1 }]
		},
		{
			code: 'mole',
			name: 'ARGO MOLE',
			turrets: [
				{ id: 't1', label: 'Front Turret', laserSize: 2 },
				{ id: 't2', label: 'Left Turret', laserSize: 2 },
				{ id: 't3', label: 'Right Turret', laserSize: 2 }
			]
		}
	];

	let shipCode = $state(SHIPS[0].code);
	let turretLoadouts = $state<
		Array<{ turretId: string; laserCode: string; moduleCodes: string[] }>
	>([]);

	const currentShip = $derived(SHIPS.find((s) => s.code === shipCode) ?? SHIPS[0]);
	const laserByCode = $derived(new Map(data.lasers.map((l: MineItem) => [l.code, l])));
	const moduleByCode = $derived(new Map(data.modules.map((m: MineItem) => [m.code, m])));

	$effect(() => {
		const ship = SHIPS.find((s) => s.code === shipCode) ?? SHIPS[0];
		turretLoadouts = ship.turrets.map((turret) => {
			const allowedLasers = data.lasers.filter(
				(l: MineItem) => Number(l.size ?? 0) === turret.laserSize
			);
			return { turretId: turret.id, laserCode: allowedLasers[0]?.code ?? '', moduleCodes: [] };
		});
	});

	function fmt(value: number) {
		return Number.isInteger(value) ? String(value) : value.toFixed(3);
	}

	function cheapestPrice(item: MineItem): number {
		const prices = Object.values(item?.prices ?? {})
			.map(Number)
			.filter((v) => Number.isFinite(v));
		return prices.length ? Math.min(...prices) : 0;
	}

	function getTurretDef(turretId: string) {
		return currentShip.turrets.find((t) => t.id === turretId)!;
	}

	function moduleSlotLimit(turretId: string, laserCode: string) {
		const turret = getTurretDef(turretId);
		const laser = laserByCode.get(laserCode) as MineItem | undefined;
		return Number(laser?.slots ?? turret.laserSize ?? 0);
	}

	function setLaser(turretId: string, laserCode: string) {
		turretLoadouts = turretLoadouts.map((entry) => {
			if (entry.turretId !== turretId) return entry;
			const limit = moduleSlotLimit(turretId, laserCode);
			return {
				...entry,
				laserCode,
				moduleCodes: entry.moduleCodes.slice(0, Math.max(0, limit))
			};
		});
	}

	function toggleModule(turretId: string, moduleCode: string) {
		turretLoadouts = turretLoadouts.map((entry) => {
			if (entry.turretId !== turretId) return entry;
			if (entry.moduleCodes.includes(moduleCode)) {
				return { ...entry, moduleCodes: entry.moduleCodes.filter((code) => code !== moduleCode) };
			}
			const limit = moduleSlotLimit(turretId, entry.laserCode);
			if (entry.moduleCodes.length >= limit) return entry;
			return { ...entry, moduleCodes: [...entry.moduleCodes, moduleCode] };
		});
	}

	function computeLaserWithModules(laser: MineItem | undefined, modules: MineItem[]) {
		const base = { ...(laser?.stats ?? {}) } as Record<string, number>;
		const out: Record<string, number> = { ...base };

		for (const module of modules) {
			const stats = module.stats ?? {};
			for (const [key, raw] of Object.entries(stats)) {
				const value = Number(raw);
				if (!Number.isFinite(value)) continue;

				if (key === 'powerMod') {
					if (out.minPower != null) out.minPower *= value;
					if (out.maxPower != null) out.maxPower *= value;
					continue;
				}
				if (key === 'extrPowerMod') {
					if (out.extrPower != null) out.extrPower *= value;
					continue;
				}
				if (out[key] != null) {
					out[key] *= value;
				}
			}
		}

		return { base, modified: out };
	}

	const turretResults = $derived.by(() => {
		return turretLoadouts.map((entry) => {
			const def = getTurretDef(entry.turretId);
			const laser = laserByCode.get(entry.laserCode) as MineItem | undefined;
			const modules = entry.moduleCodes
				.map((code) => moduleByCode.get(code))
				.filter(Boolean) as MineItem[];
			const slotLimit = moduleSlotLimit(entry.turretId, entry.laserCode);
			const calc = computeLaserWithModules(laser, modules);
			const price = [laser, ...modules]
				.filter(Boolean)
				.reduce((sum, item) => sum + cheapestPrice(item as MineItem), 0);
			return { def, laser, modules, slotLimit, ...calc, price };
		});
	});

	const combinedStats = $derived.by(() => {
		const baseTotals: Record<string, number> = {};
		const modifiedTotals: Record<string, number> = {};
		for (const turret of turretResults) {
			for (const [k, v] of Object.entries(turret.base)) {
				baseTotals[k] = (baseTotals[k] ?? 0) + Number(v);
			}
			for (const [k, v] of Object.entries(turret.modified)) {
				modifiedTotals[k] = (modifiedTotals[k] ?? 0) + Number(v);
			}
		}
		const keys = [...new Set([...Object.keys(baseTotals), ...Object.keys(modifiedTotals)])].sort(
			(a, b) => a.localeCompare(b)
		);
		return keys.map((key) => {
			const base = Number(baseTotals[key] ?? 0);
			const modified = Number(modifiedTotals[key] ?? 0);
			const delta = modified - base;
			return { key, base, modified, delta };
		});
	});

	const totalPrice = $derived(turretResults.reduce((sum, t) => sum + t.price, 0));
</script>

<div class="grid gap-4 xl:grid-cols-2">
	<div class="rounded bg-slate-800 p-4">
		<h2 class="mb-3 text-xl font-semibold">1) Select ship</h2>
		<select bind:value={shipCode} class="w-full rounded bg-slate-900 p-2">
			{#each SHIPS as ship}
				<option value={ship.code}>{ship.name}</option>
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
							>Laser S{def?.laserSize} • Modules {turret.moduleCodes.length}/{moduleSlotLimit(
								turret.turretId,
								turret.laserCode
							)}</span
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
								disabled={!turret.moduleCodes.includes(m.code) &&
									turret.moduleCodes.length >= moduleSlotLimit(turret.turretId, turret.laserCode)}
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
		<h2 class="mb-3 text-xl font-semibold">3) Complete loadout stats</h2>
		<p class="mb-3 text-sm">
			Estimated total price (cheapest stores): <strong>{totalPrice.toLocaleString()} aUEC</strong>
		</p>

		<div class="mb-4 rounded border border-slate-700">
			<table class="w-full text-sm">
				<thead class="bg-slate-900">
					<tr>
						<th class="px-2 py-1 text-left">Stat</th>
						<th class="px-2 py-1 text-right">Base</th>
						<th class="px-2 py-1 text-right">Modified</th>
						<th class="px-2 py-1 text-right">Δ</th>
					</tr>
				</thead>
				<tbody>
					{#each combinedStats as row}
						<tr class="border-t border-slate-700">
							<td class="px-2 py-1">{row.key}</td>
							<td class="px-2 py-1 text-right">{fmt(row.base)}</td>
							<td
								class="px-2 py-1 text-right {row.delta > 0
									? 'text-green-400'
									: row.delta < 0
										? 'text-red-400'
										: ''}"
							>
								{fmt(row.modified)}
							</td>
							<td
								class="px-2 py-1 text-right {row.delta > 0
									? 'text-green-400'
									: row.delta < 0
										? 'text-red-400'
										: 'text-slate-400'}"
							>
								({row.delta > 0 ? '+' : ''}{fmt(row.delta)})
							</td>
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
					<div class="text-slate-400">Price: {turret.price.toLocaleString()} aUEC</div>
				</div>
			{/each}
		</div>
	</div>
</div>
