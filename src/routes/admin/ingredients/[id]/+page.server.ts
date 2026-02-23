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

	// Load existing ingredient (allow legacy ID variants with spaces/underscores)
	const idVariants = Array.from(new Set([id, id.replace(/_/g, ' '), id.replace(/\s+/g, '_')]));
	const { data: ingredients, error: fetchError } = await supabase
		.from('ingredients')
		.select('*')
		.in('id', idVariants)
		.limit(1);

	const ingredient = ingredients?.[0] ?? null;
	if (fetchError || !ingredient) {
		throw error(404, 'Ingredient not found');
	}

	return {
		ingredient,
		locations: locations || [],
		isNew: false
	};
};
