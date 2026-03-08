<script lang="ts">
	import type { ArmorItem, ArmorSlot } from '$lib/types/armor';
	import { ARMOR_SLOTS } from '$lib/types/armor';

	type Props = {
		loadout: Partial<Record<ArmorSlot, string | null>>;
		items: ArmorItem[];
		selectedSlot: ArmorSlot;
		onSelect: (slot: ArmorSlot) => void;
		onUnequip: (slot: ArmorSlot) => void;
	};

	let { loadout, items, selectedSlot, onSelect, onUnequip }: Props = $props();

	function getEquippedItem(slot: ArmorSlot) {
		const id = loadout[slot];
		return id ? (items.find((item) => item.id === id) ?? null) : null;
	}

	function prettySlot(slot: ArmorSlot) {
		return slot.charAt(0).toUpperCase() + slot.slice(1);
	}
</script>

<div class="grid gap-3">
	{#each ARMOR_SLOTS as slot}
		{@const equipped = getEquippedItem(slot)}
		<div
			class={`rounded-xl border p-3 transition-all ${
				selectedSlot === slot
					? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
					: 'border-white/10 bg-white/5 hover:border-cyan-400/40'
			}`}
		>
			<button type="button" class="w-full cursor-pointer text-left" onclick={() => onSelect(slot)}>
				<div class="flex items-center justify-between gap-3">
					<div>
						<div class="text-xs font-semibold tracking-wider text-gray-400 uppercase">
							{prettySlot(slot)}
						</div>
						<div class="mt-1 text-sm font-medium text-white">
							{equipped?.name ?? 'Empty'}
						</div>
					</div>

					{#if equipped}
						<div
							class="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300"
						>
							Equipped
						</div>
					{/if}
				</div>
			</button>

			{#if equipped}
				<div class="mt-3">
					<button
						type="button"
						class="cursor-pointer rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/20"
						onclick={() => onUnequip(slot)}
					>
						Remove
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>
