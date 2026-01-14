import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { LocationWithIngredients } from '$lib/types/location';

export const load: PageLoad = async ({ params }) => {
	try {
		// Fetch location by slug with ingredients
		const { data: locationData, error: locationError } = await supabase
			.from('locations_with_ingredients')
			.select('*')
			.eq('slug', params.slug)
			.single();

		if (locationError || !locationData) {
			throw error(404, 'Location not found');
		}

		return {
			location: locationData as LocationWithIngredients
		};
	} catch (e: any) {
		console.error('Error loading location:', e);
		if (e.status === 404) {
			throw e;
		}
		throw error(500, 'Failed to load location');
	}
};
