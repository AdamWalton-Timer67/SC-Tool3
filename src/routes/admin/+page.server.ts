import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const DEFAULT_LOCAL_ADMIN_ID = 'local-user-1';

function isApproved(value: unknown): boolean {
	if (value === true || value === 1 || value === '1') return true;
	if (value instanceof Uint8Array) return value.length > 0 && value[0] === 1;
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return value.length > 0 && value[0] === 1;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		return normalized === 'true' || normalized === 'yes';
	}
	return false;
}

function getDisplayName(rawUserMetaData: unknown): string {
	if (!rawUserMetaData) return 'Unknown';
	if (typeof rawUserMetaData === 'string') {
		try {
			const parsed = JSON.parse(rawUserMetaData);
			return typeof parsed?.display_name === 'string' && parsed.display_name.trim()
				? parsed.display_name
				: 'Unknown';
		} catch {
			return 'Unknown';
		}
	}
	if (typeof rawUserMetaData === 'object' && rawUserMetaData !== null) {
		const displayName = (rawUserMetaData as { display_name?: unknown }).display_name;
		if (typeof displayName === 'string' && displayName.trim()) return displayName;
	}
	return 'Unknown';
}

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
		.filter((user: any) => !isApproved(user.approved))
		.map((user: any) => ({
			id: user.id,
			email: user.email,
			characterName: getDisplayName(user.raw_user_meta_data),
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
			.update({ approved: 1 })
			.eq('id', userId)
			.select('id');

		if (error) {
			return fail(500, { error: error.message || 'Failed to approve user.' });
		}

		if (!data || data.length === 0) {
			return fail(404, { error: 'User not found.' });
		}

		throw redirect(303, '/admin');
	},

	acceptPendingUserAsAdmin: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		const { error, data } = await locals.supabase
			.from('auth.users')
			.update({ approved: 1 })
			.eq('id', userId)
			.select('id');

		if (error) {
			return fail(500, { error: error.message || 'Failed to approve user as admin.' });
		}

		if (!data || data.length === 0) {
			return fail(404, { error: 'User not found.' });
		}

		const { data: existingRoles } = await locals.supabase.from('user_roles').select('id').eq('user_id', userId).limit(1);
		const existingRoleId = Array.isArray(existingRoles) && existingRoles.length > 0 ? existingRoles[0]?.id : null;

		if (existingRoleId) {
			const { error: updateRoleError } = await locals.supabase
				.from('user_roles')
				.update({ role: 'admin' })
				.eq('id', existingRoleId);
			if (updateRoleError) {
				return fail(500, { error: updateRoleError.message || 'Failed to grant admin role.' });
			}
		} else {
			const roleId = `role_admin_${Date.now()}`;
			const { error: insertRoleError } = await locals.supabase
				.from('user_roles')
				.insert({ id: roleId, user_id: userId, role: 'admin' });
			if (insertRoleError) {
				return fail(500, { error: insertRoleError.message || 'Failed to create admin role.' });
			}
		}

		throw redirect(303, '/admin');
	},
	rejectPendingUser: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Missing user id.' });
		}

		if (userId === DEFAULT_LOCAL_ADMIN_ID) {
			return fail(400, { error: 'Default local admin account cannot be rejected.' });
		}

		const { error: authError } = await locals.supabase.from('auth.users').delete().eq('id', userId);
		if (authError) {
			return fail(500, { error: authError.message || 'Failed to reject user.' });
		}

		await locals.supabase.from('profiles').delete().eq('id', userId);
		await locals.supabase.from('user_roles').delete().eq('user_id', userId);

		throw redirect(303, '/admin');
	}
};
