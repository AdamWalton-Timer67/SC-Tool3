import type { PageServerLoad } from './$types';
import type { Suggestion } from '$lib/types/suggestion';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();

	if (!user) {
		return {
			suggestions: []
		};
	}

	// Fetch all suggestions
	const { data: suggestions, error } = await supabase
		.from('suggestions')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching suggestions:', error);
		return {
			suggestions: []
		};
	}

	return {
		suggestions: (suggestions as Suggestion[]) || []
	};
};
