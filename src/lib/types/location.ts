/**
 * Types for the Star Citizen Locations system
 */

export type LocationType =
	| 'contested_zone'
	| 'orbital_laser'
	| 'investigation'
	| 'underground_facility'
	| 'warehouse'
	| 'bunker'
	| 'other';

export type LocationDifficulty = 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high';

export interface Location {
	id: string;
	slug: string;
	type: LocationType;
	system: string;
	planet?: string | null;
	moon?: string | null;

	// Multilingual names and descriptions
	name_en: string;
	name_fr: string;
	name_de?: string | null;

	short_description_en?: string | null;
	short_description_fr?: string | null;
	short_description_de?: string | null;

	description_en?: string | null;
	description_fr?: string | null;
	description_de?: string | null;

	how_to_access_en?: string | null;
	how_to_access_fr?: string | null;
	how_to_access_de?: string | null;

	mission_types_en?: string | null;
	mission_types_fr?: string | null;
	mission_types_de?: string | null;

	loot_types_en?: string | null;
	loot_types_fr?: string | null;
	loot_types_de?: string | null;

	// Metadata
	image_url?: string | null;
	image_credit?: string | null;
	cheatsheet_image_url?: string | null;
	crate_types?: string[] | null;
	requirements?: string | null;
	rewards?: string | null;
	difficulty?: LocationDifficulty | null;
	coordinates?: string | null;
	related_missions?: string[] | null;

	// Timestamps
	created_at: string;
	updated_at: string;
}

export interface LocationWithIngredients extends Location {
	ingredients: {
		ingredient_id: string;
		ingredient_name_en: string;
		ingredient_name_fr: string;
		ingredient_category: string;
		ingredient_rarity: string;
		ingredient_image_url?: string | null;
	}[];
}

export interface LocationSearchParams {
	search_term?: string | null;
	location_type?: LocationType | null;
	location_system?: string | null;
	location_difficulty?: LocationDifficulty | null;
}

export interface LocationCardData {
	id: string;
	slug: string;
	type: LocationType;
	system: string;
	name_en: string;
	name_fr: string;
	short_description_en?: string | null;
	short_description_fr?: string | null;
	image_url?: string | null;
	difficulty?: LocationDifficulty | null;
	ingredient_count: number;
}
