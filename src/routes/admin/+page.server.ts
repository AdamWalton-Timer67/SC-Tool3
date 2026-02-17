import { fail } from '@sveltejs/kit';
import { approveUserById, listPendingUsers, rejectUserById } from '$lib/server/admin-users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Load statistics
	const { data: ingredientsData } = await supabase.from('ingredients').select('count');
	const { data: rewardsData } = await supabase.from('rewards').select('count');
	const { data: locationsData } = await supabase.from('locations').select('count');
	const { data: usersData } = await supabase.from('user_roles').select('count');
	const { data: suggestionsData } = await supabase.from('suggestions').select('count');
	const { data: pendingUsersData } = await listPendingUsers();

	const pendingUsers = (pendingUsersData ?? []).map((user: any) => ({
		id: user.id,
		email: user.email,
		characterName: user.display_name ?? 'Unknown',
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
	acceptPendingUser: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		const { error, data } = await approveUserById(userId);

		if (error) {
			return fail(500, { error: 'Failed to approve user.' });
		}

		if (!data || (Array.isArray(data) && data.length === 0)) {
			return fail(404, { error: 'User not found.' });
		}

		return { success: true };
	},
	rejectPendingUser: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		const { error: rejectError } = await rejectUserById(userId);
		if (rejectError) {
			const status = rejectError.message === 'User not found.' ? 404 : 500;
			return fail(status, { error: rejectError.message || 'Failed to reject user.' });
		}

		return { success: true };
	}
};
