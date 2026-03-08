import type {
	ArmorItem,
	ArmorLoadout,
	ArmorSelectionState,
	ArmorSlot,
	BodyType
} from '$lib/types/armor';
import { ARMOR_SLOTS } from '$lib/types/armor';

function createInitialState(): ArmorSelectionState {
	return {
		bodyType: 'neutral',
		loadout: {
			undersuit: null,
			helmet: null,
			torso: null,
			arms: null,
			legs: null,
			backpack: null
		},
		search: '',
		selectedSlot: 'helmet',
		selectedMaterialByItemId: {}
	};
}

class ArmorStore {
	state = $state<ArmorSelectionState>(createInitialState());

	reset() {
		this.state = createInitialState();
	}

	setBodyType(bodyType: BodyType) {
		this.state.bodyType = bodyType;
	}

	setSearch(search: string) {
		this.state.search = search;
	}

	setSelectedSlot(slot: ArmorSlot) {
		this.state.selectedSlot = slot;
	}

	equip(slot: ArmorSlot, itemId: string | null) {
		this.state.loadout[slot] = itemId;
	}

	unequip(slot: ArmorSlot) {
		this.state.loadout[slot] = null;
	}

	setMaterial(itemId: string, materialId: string) {
		this.state.selectedMaterialByItemId[itemId] = materialId;
	}

	applyLoadout(loadout: ArmorLoadout) {
		for (const slot of ARMOR_SLOTS) {
			this.state.loadout[slot] = loadout[slot] ?? null;
		}
	}

	getEquippedItems(items: ArmorItem[]) {
		return ARMOR_SLOTS.map((slot) => {
			const id = this.state.loadout[slot];
			return id ? (items.find((item) => item.id === id) ?? null) : null;
		}).filter(Boolean) as ArmorItem[];
	}

	getItemsForSelectedSlot(items: ArmorItem[]) {
		const search = this.state.search.trim().toLowerCase();

		return items.filter((item) => {
			if (item.slot !== this.state.selectedSlot) return false;

			if (item.bodyTypes?.length && !item.bodyTypes.includes(this.state.bodyType)) {
				return false;
			}

			if (!search) return true;

			const haystack = [item.name, item.brand ?? '', item.description ?? '', ...(item.tags ?? [])]
				.join(' ')
				.toLowerCase();

			return haystack.includes(search);
		});
	}
}

export const armorStore = new ArmorStore();
