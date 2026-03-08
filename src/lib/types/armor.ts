export type ArmorSlot = 'undersuit' | 'helmet' | 'torso' | 'arms' | 'legs' | 'backpack';

export type BodyType = 'male' | 'female' | 'neutral';

export interface ArmorMaterialVariant {
	id: string;
	label: string;
	previewColor?: string;
}

export interface ArmorItem {
	id: string;
	name: string;
	slot: ArmorSlot;
	brand?: string;
	grade?: 'light' | 'medium' | 'heavy';
	bodyTypes?: BodyType[];
	modelUrl?: string;
	thumbnailUrl?: string;
	description?: string;
	tags?: string[];
	hides?: ArmorSlot[];
	requires?: ArmorSlot[];
	materials?: ArmorMaterialVariant[];
	defaultMaterialId?: string;
	stats?: {
		temperatureMin?: number;
		temperatureMax?: number;
		damageReduction?: number;
		weight?: number;
	};
}

export interface ArmorManifest {
	version: string;
	updatedAt: string;
	items: ArmorItem[];
}

export type ArmorLoadout = Partial<Record<ArmorSlot, string | null>>;

export interface ArmorSelectionState {
	bodyType: BodyType;
	loadout: ArmorLoadout;
	search: string;
	selectedSlot: ArmorSlot;
	selectedMaterialByItemId: Record<string, string>;
}

export const ARMOR_SLOTS: ArmorSlot[] = [
	'undersuit',
	'helmet',
	'torso',
	'arms',
	'legs',
	'backpack'
];
