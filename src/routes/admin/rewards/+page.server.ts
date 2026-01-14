/**
 * Admin Rewards Page - Server Load
 *
 * Loads all rewards from the database for the admin panel
 */

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter parameters
	const category = url.searchParams.get('category') || 'all';
	const rarity = url.searchParams.get('rarity') || 'all';
	const search = url.searchParams.get('search') || '';

	// Build query
	let query = supabase.from('rewards').select('*').order('name_en', { ascending: true });

	// Apply filters
	if (category !== 'all') {
		query = query.eq('category', category);
	}

	if (rarity !== 'all') {
		query = query.eq('rarity', rarity);
	}

	if (search) {
		query = query.or(`name_en.ilike.%${search}%,name_fr.ilike.%${search}%`);
	}

	const { data: rewards, error } = await query;

	if (error) {
		console.error('Error loading rewards:', error);
		return {
			rewards: [],
			error: error.message
		};
	}

	return {
		rewards: rewards || [],
		filters: {
			category,
			rarity,
			search
		}
	};
};
