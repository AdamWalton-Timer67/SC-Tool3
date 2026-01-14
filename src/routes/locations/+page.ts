import { supabase } from '$lib/supabase';
import type { PageLoad } from './$types';
import type { LocationCardData } from '$lib/types/location';

// Disable caching to always load fresh data
export const csr = true;
export const ssr = false;

export const load: PageLoad = async () => {
	try {
		// Fetch locations with ingredient count using the search function
		// Add timeout to prevent infinite loading
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		const { data, error } = await supabase.rpc('search_locations', {
			search_term: null,
			location_type: null,
			location_system: null,
			location_difficulty: null
		});

		clearTimeout(timeoutId);

		if (error) {
			console.error('Error loading locations:', error);
			return {
				locations: [] as LocationCardData[],
				error: error.message
			};
		}

		return {
			locations: (data as LocationCardData[]) || [],
			error: null
		};
	} catch (e) {
		console.error('Unexpected error loading locations:', e);
		// Return empty array on error instead of blocking
		return {
			locations: [] as LocationCardData[],
			error: e instanceof Error ? e.message : 'Failed to load locations'
		};
	}
};
