/**
 * Admin Ingredient Edit/Create Page - Server Load
 *
 * Loads a specific ingredient or prepares for creating a new one
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const { id } = params;

	// Load all locations for the dropdown
	const { data: locations } = await supabase
		.from('locations')
		.select('id, slug, name_en, name_fr, type, system')
		.order('name_en');

	// If id is "new", return empty ingredient
	if (id === 'new') {
		return {
			ingredient: null,
			locations: locations || [],
			isNew: true
		};
	}

	// Load existing ingredient
	const { data: ingredient, error: fetchError } = await supabase
		.from('ingredients')
		.select('*')
		.eq('id', id)
		.single();

	if (fetchError || !ingredient) {
		throw error(404, 'Ingredient not found');
	}

	return {
		ingredient,
		locations: locations || [],
		isNew: false
	};
};
