<script lang="ts">
	import ArmorViewer from '$lib/components/armor/ArmorViewer.svelte';
	import ArmorSlotSelector from '$lib/components/armor/ArmorSlotSelector.svelte';
	import { armorStore } from '$lib/stores/armor.svelte';
	import type { ArmorItem, ArmorManifest, ArmorSlot, BodyType } from '$lib/types/armor';
	import { onMount } from 'svelte';

	let manifest = $state<ArmorManifest | null>(null);
	let items = $state<ArmorItem[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function loadManifest() {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/armor/items');
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			const data = (await response.json()) as ArmorManifest;
			manifest = data;
			items = data.items ?? [];
		} catch (err) {
			console.error(err);
			error = 'Failed to load armor manifest.';
		} finally {
			loading = false;
		}
	}

	function equipItem(slot: ArmorSlot, itemId: string) {
		armorStore.equip(slot, itemId);
	}

	function selectBodyType(bodyType: BodyType) {
		armorStore.setBodyType(bodyType);
	}

	const bodyTypes: BodyType[] = ['neutral', 'male', 'female'];

	onMount(() => {
		loadManifest();
	});

	const selectedItems = $derived(armorStore.getItemsForSelectedSlot(items));
	const equippedItems = $derived(armorStore.getEquippedItems(items));
</script>

<svelte:head>
	<title>Armor Preview - SC Tool3</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
			>
				← Back to tools
			</a>

			<h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Armor Preview</h1>
			<p class="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
				Manifest-driven armor viewer with interactive 3D mannequin rendering.
			</p>
		</div>

		{#if loading}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
				Loading armor manifest...
			</div>
		{:else if error}
			<div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
				{error}
			</div>
		{:else}
			<div
				class="mb-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-3"
			>
				<div class="md:col-span-2">
					<label
						for="armor-search"
						class="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase"
					>
						Search
					</label>
					<input
						id="armor-search"
						type="text"
						class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none focus:border-cyan-400"
						placeholder="Search armor name, brand, tags..."
						value={armorStore.state.search}
						oninput={(e) => armorStore.setSearch((e.currentTarget as HTMLInputElement).value)}
					/>
				</div>

				<div>
					<div class="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
						Body Type
					</div>
					<div class="flex flex-wrap gap-2">
						{#each bodyTypes as bodyType}
							<button
								type="button"
								class={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition ${
									armorStore.state.bodyType === bodyType
										? 'border-cyan-400 bg-cyan-400 text-slate-950'
										: 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40'
								}`}
								onclick={() => selectBodyType(bodyType)}
							>
								{bodyType}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
				<div>
					<ArmorSlotSelector
						loadout={armorStore.state.loadout}
						{items}
						selectedSlot={armorStore.state.selectedSlot}
						onSelect={(slot) => armorStore.setSelectedSlot(slot)}
						onUnequip={(slot) => armorStore.unequip(slot)}
					/>
				</div>

				<div>
					<ArmorViewer {equippedItems} />

					<div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
						<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
							Equipped
						</div>

						{#if equippedItems.length === 0}
							<p class="mt-2 text-sm text-slate-400">No pieces equipped yet.</p>
						{:else}
							<div class="mt-3 grid gap-2">
								{#each equippedItems as item}
									<div class="rounded-xl border border-white/10 bg-slate-900/70 p-3">
										<div class="text-sm font-semibold text-white">{item.name}</div>
										<div class="mt-1 text-xs text-slate-400">
											{item.slot}{#if item.brand}
												· {item.brand}{/if}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div>
					<div class="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
						<div class="flex items-center justify-between gap-3">
							<div>
								<div class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
									Slot Items
								</div>
								<div class="mt-1 text-lg font-semibold text-white">
									{armorStore.state.selectedSlot}
								</div>
							</div>

							<div
								class="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
							>
								{selectedItems.length} results
							</div>
						</div>

						<div class="mt-4 grid gap-3">
							{#if selectedItems.length === 0}
								<div
									class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400"
								>
									No items found for this slot.
								</div>
							{:else}
								{#each selectedItems as item}
									<button
										type="button"
										class={`cursor-pointer rounded-xl border p-4 text-left transition ${
											armorStore.state.loadout[item.slot] === item.id
												? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10'
												: 'border-white/10 bg-white/5 hover:border-cyan-400/40'
										}`}
										onclick={() => equipItem(item.slot, item.id)}
									>
										<div class="flex items-start justify-between gap-3">
											<div>
												<div class="text-sm font-semibold text-white">{item.name}</div>
												<div class="mt-1 text-xs text-slate-400">
													{item.brand ?? 'Unknown brand'}{#if item.grade}
														· {item.grade}{/if}
												</div>
											</div>

											{#if armorStore.state.loadout[item.slot] === item.id}
												<div
													class="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300"
												>
													Selected
												</div>
											{/if}
										</div>

										{#if item.description}
											<p class="mt-3 text-sm text-slate-300">{item.description}</p>
										{/if}
									</button>
								{/each}
							{/if}
						</div>
					</div>

					{#if manifest}
						<div
							class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400"
						>
							Manifest version: {manifest.version}<br />
							Updated: {new Date(manifest.updatedAt).toLocaleString('en-GB')}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
