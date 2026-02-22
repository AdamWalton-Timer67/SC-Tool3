/**
 * Admin Ingredients Page - Server Load
 *
 * Loads all ingredients from the database for the admin panel
 */

import type { PageServerLoad } from './$types';
import { normalizeImageUrl } from '$lib/utils/imageUrl';

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter parameters
	const category = url.searchParams.get('category') || 'all';
	const rarity = url.searchParams.get('rarity') || 'all';
	const search = url.searchParams.get('search') || '';

	// Build query
	let query = supabase.from('ingredients').select('*').order('name_en', { ascending: true });

	// Apply filters
	if (category !== 'all') {
		query = query.eq('category', category);
	}

	if (rarity !== 'all') {
		query = query.eq('rarity', rarity);
	}

	const { data: ingredients, error } = await query;

	if (error) {
		console.error('Error loading ingredients:', error);
		return {
			ingredients: [],
			error: error.message
		};
	}

	const normalizedSearch = search.trim().toLowerCase();
	const filteredIngredients = (ingredients || [])
		.filter((ingredient: any) => {
			if (!normalizedSearch) return true;
			return [ingredient.name_en, ingredient.name_fr]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(normalizedSearch));
		})
		.map((ingredient: any) => ({
			...ingredient,
			image_url: normalizeImageUrl(ingredient.image_url)
		}));

	return {
		ingredients: filteredIngredients,
		filters: {
			category,
			rarity,
			search
		}
	};
};
