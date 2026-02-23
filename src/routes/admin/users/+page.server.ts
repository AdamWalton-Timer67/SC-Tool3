import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const DEFAULT_LOCAL_ADMIN_ID = 'local-user-1';

function isApproved(value: unknown): boolean {
	if (value === true || value === 1 || value === '1') return true;
	if (value instanceof Uint8Array) return value.length > 0 && value[0] === 1;
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value))
		return value.length > 0 && value[0] === 1;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		return normalized === 'true' || normalized === 'yes';
	}
	return false;
}

function getDisplayName(rawUserMetaData: unknown, email: string): string {
	if (!rawUserMetaData) return email;
	if (typeof rawUserMetaData === 'string') {
		try {
			const parsed = JSON.parse(rawUserMetaData);
			return typeof parsed?.display_name === 'string' && parsed.display_name.trim()
				? parsed.display_name
				: email;
		} catch {
			return email;
		}
	}
	if (typeof rawUserMetaData === 'object' && rawUserMetaData !== null) {
		const displayName = (rawUserMetaData as { display_name?: unknown }).display_name;
		if (typeof displayName === 'string' && displayName.trim()) return displayName;
	}
	return email;
}

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	const [{ data: authUsers, error: authUsersError }, { data: userRoles }] = await Promise.all([
		supabase.from('auth.users').select('*').order('created_at', { ascending: false }),
		supabase.from('user_roles').select('user_id, role')
	]);

	if (authUsersError) {
		return {
			users: [],
			currentUserId: currentUser?.id ?? null,
			isLocalAdmin: currentUser?.id === DEFAULT_LOCAL_ADMIN_ID,
			error: authUsersError.message || 'Failed to load users.'
		};
	}

	const roleMap = new Map<string, string>();
	for (const role of userRoles || []) {
		if (!role?.user_id || !role?.role) continue;
		if (role.role === 'admin') roleMap.set(role.user_id, 'admin');
		else if (!roleMap.has(role.user_id)) roleMap.set(role.user_id, role.role);
	}

	const users = (authUsers || []).map((authUser: any) => {
		const approved = isApproved(authUser.approved);
		const role = roleMap.get(authUser.id) || 'user';
		const status = !approved ? 'unverified' : role === 'admin' ? 'admin' : 'user';
		return {
			id: authUser.id,
			email: authUser.email,
			displayName: getDisplayName(authUser.raw_user_meta_data, authUser.email),
			approved,
			role,
			status,
			created_at: authUser.created_at ?? null,
			isDefaultLocalAdmin: authUser.id === DEFAULT_LOCAL_ADMIN_ID
		};
	});

	return {
		users,
		currentUserId: currentUser?.id ?? null,
		isLocalAdmin: currentUser?.id === DEFAULT_LOCAL_ADMIN_ID,
		error: null
	};
};

export const actions: Actions = {
	deleteAccount: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = String(formData.get('userId') || '').trim();
		if (!userId) return fail(400, { error: 'Missing user id.' });
		if (userId === DEFAULT_LOCAL_ADMIN_ID) {
			return fail(400, { error: 'Default local admin account cannot be deleted.' });
		}

		const { error: deleteAuthError } = await locals.supabase
			.from('auth.users')
			.delete()
			.eq('id', userId);
		if (deleteAuthError)
			return fail(500, { error: deleteAuthError.message || 'Failed to delete account.' });

		await Promise.all([
			locals.supabase.from('profiles').delete().eq('id', userId),
			locals.supabase.from('user_roles').delete().eq('user_id', userId),
			locals.supabase.from('organization_members').delete().eq('user_id', userId),
			locals.supabase.from('organization_join_requests').delete().eq('user_id', userId),
			locals.supabase.from('user_inventory').delete().eq('user_id', userId),
			locals.supabase.from('user_reward_ingredients').delete().eq('user_id', userId),
			locals.supabase.from('user_reward_completions').delete().eq('user_id', userId),
			locals.supabase.from('user_favorite_rewards').delete().eq('user_id', userId),
			locals.supabase.from('user_favorite_ingredients').delete().eq('user_id', userId)
		]);

		throw redirect(303, '/admin/users');
	},

	toggleAdmin: async ({ request, locals }) => {
		const {
			data: { user: currentUser }
		} = await locals.supabase.auth.getUser();
		if (currentUser?.id !== DEFAULT_LOCAL_ADMIN_ID) {
			return fail(403, { error: 'Only local admin can promote/demote users.' });
		}

		const formData = await request.formData();
		const userId = String(formData.get('userId') || '').trim();
		const makeAdmin = String(formData.get('makeAdmin') || '0') === '1';
		if (!userId) return fail(400, { error: 'Missing user id.' });
		if (userId === DEFAULT_LOCAL_ADMIN_ID && !makeAdmin) {
			return fail(400, { error: 'Default local admin cannot be demoted.' });
		}

		const { data: existingRoles } = await locals.supabase
			.from('user_roles')
			.select('id')
			.eq('user_id', userId)
			.limit(1);
		const existingRoleId =
			Array.isArray(existingRoles) && existingRoles.length > 0 ? existingRoles[0]?.id : null;

		if (existingRoleId) {
			const { error } = await locals.supabase
				.from('user_roles')
				.update({ role: makeAdmin ? 'admin' : 'user' })
				.eq('id', existingRoleId);
			if (error) return fail(500, { error: error.message || 'Failed updating role.' });
		} else {
			const roleId = `role_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
			const { error } = await locals.supabase
				.from('user_roles')
				.insert({ id: roleId, user_id: userId, role: makeAdmin ? 'admin' : 'user' });
			if (error) return fail(500, { error: error.message || 'Failed creating role.' });
		}

		throw redirect(303, '/admin/users');
	},

	purgeItems: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = String(formData.get('userId') || '').trim();
		const userEmail = String(formData.get('userEmail') || '').trim();
		if (!userId && !userEmail) return fail(400, { error: 'Missing user id/email.' });

		let suggestionsQuery = locals.supabase
			.from('suggestions')
			.select('id,item_type,item_id,user_id,user_email');
		if (userId) suggestionsQuery = suggestionsQuery.eq('user_id', userId);
		const { data: suggestionsByUser } = await suggestionsQuery;

		const suggestions = (suggestionsByUser || []).filter((s: any) => {
			if (userId && s.user_id === userId) return true;
			if (userEmail && s.user_email === userEmail) return true;
			return false;
		});

		const ingredientIds = suggestions
			.filter((s: any) => s.item_type === 'ingredient')
			.map((s: any) => s.item_id)
			.filter(Boolean);
		const rewardIds = suggestions
			.filter((s: any) => s.item_type === 'reward')
			.map((s: any) => s.item_id)
			.filter(Boolean);
		const locationIds = suggestions
			.filter((s: any) => s.item_type === 'location')
			.map((s: any) => s.item_id)
			.filter(Boolean);

		if (ingredientIds.length)
			await locals.supabase.from('ingredients').delete().in('id', ingredientIds);
		if (rewardIds.length) await locals.supabase.from('rewards').delete().in('id', rewardIds);
		if (locationIds.length) await locals.supabase.from('locations').delete().in('id', locationIds);

		if (suggestions.length) {
			await locals.supabase
				.from('suggestions')
				.delete()
				.in(
					'id',
					suggestions.map((s: any) => s.id)
				);
		}

		throw redirect(303, '/admin/users');
	}
};
