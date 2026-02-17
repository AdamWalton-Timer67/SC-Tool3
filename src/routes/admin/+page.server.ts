import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Load statistics
	const { data: ingredientsData } = await supabase.from('ingredients').select('count');
	const { data: rewardsData } = await supabase.from('rewards').select('count');
	const { data: locationsData } = await supabase.from('locations').select('count');
	const { data: usersData } = await supabase.from('user_roles').select('count');
	const { data: suggestionsData } = await supabase.from('suggestions').select('count');
	const { data: authUsersData } = await supabase.from('auth.users').select('*');

	const pendingUsers = (authUsersData ?? [])
		.filter((user: any) => user.approved !== true)
		.map((user: any) => ({
			id: user.id,
			email: user.email,
			characterName: user.raw_user_meta_data?.display_name ?? 'Unknown',
			createdAt: user.created_at ?? null
		}));

	return {
		stats: {
			ingredients: ingredientsData?.[0]?.count || 0,
			rewards: rewardsData?.[0]?.count || 0,
			locations: locationsData?.[0]?.count || 0,
			users: usersData?.[0]?.count || 0,
			suggestions: suggestionsData?.[0]?.count || 0
		},
		pendingUsers
	};
};

export const actions: Actions = {
	acceptPendingUser: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		const { error, data } = await locals.supabase
			.from('auth.users')
			.update({ approved: true })
			.eq('id', userId)
			.select('id');

		if (error) {
			return fail(500, { error: error.message || 'Failed to approve user.' });
		}

		if (!data || data.length === 0) {
			return fail(404, { error: 'User not found.' });
		}

		return { success: true };
	},
	rejectPendingUser: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		const { error: authError } = await locals.supabase.from('auth.users').delete().eq('id', userId);
		if (authError) {
			return fail(500, { error: authError.message || 'Failed to reject user.' });
		}

		await locals.supabase.from('profiles').delete().eq('id', userId);
		await locals.supabase.from('user_roles').delete().eq('user_id', userId);

		return { success: true };
	}
};
