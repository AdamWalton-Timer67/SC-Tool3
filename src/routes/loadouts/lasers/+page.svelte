<script lang="ts">
	let { data } = $props();
	let query = $state('');

	const storesByCode = $derived(
		new Map((data.stores ?? []).map((s: any) => [String(s.code), s.name]))
	);

	const filtered = $derived(
		data.lasers.filter((laser: any) =>
			`${laser.name} ${laser.code}`.toLowerCase().includes(query.toLowerCase())
		)
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

<div class="space-y-3">
	<input
		bind:value={query}
		placeholder="Search laser"
		class="w-full rounded bg-slate-800 px-3 py-2"
	/>

	<div class="overflow-auto rounded border border-slate-700">
		<table class="w-full text-sm">
			<thead class="bg-slate-900">
				<tr>
					<th class="px-2 py-2 text-left">Laser</th>
					<th class="px-2 py-2 text-left">Code</th>
					<th class="px-2 py-2 text-right">Size</th>
					<th class="px-2 py-2 text-right">Slots</th>
					<th class="px-2 py-2 text-right">Cheapest</th>
					<th class="px-2 py-2 text-left">Store</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as laser}
					{@const best = cheapest(laser.prices)}
					<tr class="border-t border-slate-700">
						<td class="px-2 py-2 font-medium">{laser.name}</td>
						<td class="px-2 py-2 text-slate-300">{laser.code}</td>
						<td class="px-2 py-2 text-right">{laser.size}</td>
						<td class="px-2 py-2 text-right">{laser.slots}</td>
						<td class="px-2 py-2 text-right"
							>{best ? `${best.price.toLocaleString()} aUEC` : '—'}</td
						>
						<td class="px-2 py-2 text-slate-300">
							{best ? (storesByCode.get(best.storeCode) ?? best.storeCode) : '—'}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
