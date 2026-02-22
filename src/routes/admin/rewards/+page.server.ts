/**
 * Admin Rewards Page - Server Load
 *
 * Loads all rewards from the database for the admin panel
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
	let query = supabase.from('rewards').select('*').order('name_en', { ascending: true });

	// Apply filters
	if (category !== 'all') {
		query = query.eq('category', category);
	}

	if (rarity !== 'all') {
		query = query.eq('rarity', rarity);
	}

	const { data: rewards, error } = await query;

	if (error) {
		console.error('Error loading rewards:', error);
		return {
			rewards: [],
			error: error.message
		};
	}

	const normalizedSearch = search.trim().toLowerCase();
	const filteredRewards = (rewards || [])
		.filter((reward: any) => {
			if (!normalizedSearch) return true;
			return [reward.name_en, reward.name_fr]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(normalizedSearch));
		})
		.map((reward: any) => ({
			...reward,
			image_url: normalizeImageUrl(reward.image_url)
		}));

	return {
		rewards: filteredRewards,
		filters: {
			category,
			rarity,
			search
		}
	};
};
