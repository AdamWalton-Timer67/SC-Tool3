/**
 * Centralized category utilities
 * Used across the app for consistent category handling
 */

export interface CategoryInfo {
	id: string;
	icon: string;
	name: {
		en: string;
		fr: string;
	};
}

export const CATEGORIES: Record<string, CategoryInfo> = {
	armor: {
		id: 'armor',
		icon: '🛡️',
		name: { en: 'Armor', fr: 'Armures' }
	},
	collectible: {
		id: 'collectible',
		icon: '🎨',
		name: { en: 'Collectibles', fr: 'Objets de collection' }
	},
	currency: {
		id: 'currency',
		icon: '💰',
		name: { en: 'Currency', fr: 'Monnaie' }
	},
	experimental: {
		id: 'experimental',
		icon: '🧪',
		name: { en: 'Experimental', fr: 'Expérimental' }
	},
	mining: {
		id: 'mining',
		icon: '⛏️',
		name: { en: 'Mining', fr: 'Minage' }
	},
	organic: {
		id: 'organic',
		icon: '🌿',
		name: { en: 'Organic Materials', fr: 'Matériaux Organiques' }
	},
	rare_material: {
		id: 'rare_material',
		icon: '💎',
		name: { en: 'Rare Materials', fr: 'Matériaux Rares' }
	},
	special: {
		id: 'special',
		icon: '✨',
		name: { en: 'Special Items', fr: 'Objets Spéciaux' }
	},
	technology: {
		id: 'technology',
		icon: '🔧',
		name: { en: 'Technology', fr: 'Technologie' }
	},
	vehicle: {
		id: 'vehicle',
		icon: '🚗',
		name: { en: 'Vehicles', fr: 'Véhicules' }
	},
	weapon: {
		id: 'weapon',
		icon: '🔫',
		name: { en: 'Weapons', fr: 'Armes' }
	},
	weapon_component: {
		id: 'weapon_component',
		icon: '🔩',
		name: { en: 'Weapon Components', fr: "Composants d'armes" }
	}
};

export interface RarityInfo {
	id: string;
	name: {
		en: string;
		fr: string;
	};
	color: string; // Tailwind gradient class
}

export const RARITIES: Record<string, RarityInfo> = {
	legendary: {
		id: 'legendary',
		name: { en: 'Legendary', fr: 'Légendaire' },
		color: 'from-purple-500 via-pink-500 to-yellow-500'
	},
	epic: {
		id: 'epic',
		name: { en: 'Epic', fr: 'Épique' },
		color: 'from-purple-600 to-blue-500'
	},
	rare: {
		id: 'rare',
		name: { en: 'Rare', fr: 'Rare' },
		color: 'from-blue-500 to-cyan-400'
	},
	uncommon: {
		id: 'uncommon',
		name: { en: 'Uncommon', fr: 'Peu commun' },
		color: 'from-emerald-500 to-green-600'
	},
	common: {
		id: 'common',
		name: { en: 'Common', fr: 'Commun' },
		color: 'from-gray-500 to-gray-400'
	}
};

/**
 * Get category icon
 */
export function getCategoryIcon(categoryId: string): string {
	return CATEGORIES[categoryId]?.icon || '📦';
}

/**
 * Get category translation
 */
export function getCategoryTranslation(categoryId: string, lang: 'en' | 'fr'): string {
	return CATEGORIES[categoryId]?.name[lang] || categoryId;
}

/**
 * Get all category translations for a given language
 */
export function getAllCategoryTranslations(lang: 'en' | 'fr'): Record<string, string> {
	const translations: Record<string, string> = {};
	Object.entries(CATEGORIES).forEach(([key, value]) => {
		translations[key] = value.name[lang];
	});
	return translations;
}

/**
 * Get rarity color gradient
 */
export function getRarityColor(rarityId: string): string {
	return RARITIES[rarityId]?.color || RARITIES.common.color;
}

/**
 * Get rarity translation
 */
export function getRarityTranslation(rarityId: string, lang: 'en' | 'fr'): string {
	return RARITIES[rarityId]?.name[lang] || rarityId;
}

/**
 * Get rarity badge CSS class
 */
export function getRarityBadgeClass(rarityId: string): string {
	const baseClass =
		'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-linear-to-r';
	const color = getRarityColor(rarityId);
	return `${baseClass} ${color} text-white shadow-lg`;
}
