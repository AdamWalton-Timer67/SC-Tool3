import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Load statistics
	const { data: ingredientsData } = await supabase.from('ingredients').select('count');
	const { data: rewardsData } = await supabase.from('rewards').select('count');
	const { data: locationsData } = await supabase.from('locations').select('count');
	const { data: usersData } = await supabase.from('user_roles').select('count');
	const { data: suggestionsData } = await supabase.from('suggestions').select('count');

	return {
		stats: {
			ingredients: ingredientsData?.[0]?.count || 0,
			rewards: rewardsData?.[0]?.count || 0,
			locations: locationsData?.[0]?.count || 0,
			users: usersData?.[0]?.count || 0,
			suggestions: suggestionsData?.[0]?.count || 0
		}
	};
};
