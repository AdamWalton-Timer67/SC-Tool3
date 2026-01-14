import { supabase } from '$lib/supabase';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	await parent(); // Wait for layout data

	try {
		// Check if user is authenticated
		const { data: { user } } = await supabase.auth.getUser();

		// If user is authenticated, load only their organizations
		// Otherwise, return empty array (public orgs will be shown only via search)
		if (user) {
			const { data, error } = await supabase.rpc('get_user_organizations');

			if (error) {
				console.error('Error fetching user organizations:', error);
				return {
					organizations: [],
					error: error.message
				};
			}

			return {
				organizations: data || [],
				error: null
			};
		}

		// User not authenticated - return empty array
		return {
			organizations: [],
			error: null
		};
	} catch (err) {
		console.error('Error loading organizations:', err);
		return {
			organizations: [],
			error: 'Failed to load organizations'
		};
	}
};
