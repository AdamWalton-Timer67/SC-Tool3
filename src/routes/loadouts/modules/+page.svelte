<script lang="ts">
	let { data } = $props();
	let query = $state('');
	let category = $state('all');

	const categories = $derived([
		'all',
		...new Set(data.modules.map((m: any) => String(m.category || 'Uncategorized')))
	]);
	const storesByCode = $derived(
		new Map((data.stores ?? []).map((s: any) => [String(s.code), s.name]))
	);

	const filtered = $derived(
		data.modules.filter((module: any) => {
			const matchesQuery = `${module.name} ${module.code}`
				.toLowerCase()
				.includes(query.toLowerCase());
			const moduleCategory = String(module.category || 'Uncategorized');
			const matchesCategory = category === 'all' || moduleCategory === category;
			return matchesQuery && matchesCategory;
		})
	);

	function cheapest(prices: Record<string, number>) {
		let bestStore = '';
		let bestPrice = Number.POSITIVE_INFINITY;
		for (const [store, price] of Object.entries(prices || {})) {
			const p = Number(price);
			if (Number.isFinite(p) && p < bestPrice) {
				bestPrice = p;
				bestStore = store;
			}
		}
		if (!Number.isFinite(bestPrice)) return null;
		return { price: bestPrice, storeCode: bestStore };
	}
</script>

<div class="mb-3 grid gap-2 md:grid-cols-2">
	<input bind:value={query} placeholder="Search module" class="rounded bg-slate-800 px-3 py-2" />
	<select bind:value={category} class="rounded bg-slate-800 px-3 py-2">
		{#each categories as c}
			<option value={c}>{c}</option>
		{/each}
	</select>
</div>

<div class="overflow-auto rounded border border-slate-700">
	<table class="w-full text-sm">
		<thead class="bg-slate-900">
			<tr>
				<th class="px-2 py-2 text-left">Module</th>
				<th class="px-2 py-2 text-left">Code</th>
				<th class="px-2 py-2 text-left">Category</th>
				<th class="px-2 py-2 text-right">Cheapest</th>
				<th class="px-2 py-2 text-left">Store</th>
			</tr>
		</thead>
		<tbody>
			{#each filtered as module}
				{@const best = cheapest(module.prices)}
				<tr class="border-t border-slate-700">
					<td class="px-2 py-2 font-medium">{module.name}</td>
					<td class="px-2 py-2 text-slate-300">{module.code}</td>
					<td class="px-2 py-2">{module.category || 'Uncategorized'}</td>
					<td class="px-2 py-2 text-right">{best ? `${best.price.toLocaleString()} aUEC` : '—'}</td>
					<td class="px-2 py-2 text-slate-300">
						{best ? (storesByCode.get(best.storeCode) ?? best.storeCode) : '—'}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
