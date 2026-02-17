import { createAdminClient } from '$lib/server/admin';

function isApproved(user: any): boolean {
	if (user?.approved === true) return true;
	if (user?.raw_user_meta_data?.approved === true) return true;
	if (user?.user_metadata?.approved === true) return true;
	if (user?.app_metadata?.approved === true) return true;
	return false;
}

function toPendingUser(user: any) {
	return {
		id: user.id,
		email: user.email,
		created_at: user.created_at,
		display_name:
			user.raw_user_meta_data?.display_name ??
			user.user_metadata?.display_name ??
			user.email ??
			'Unknown'
	};
}

export async function listPendingUsers(userSupabase: any) {
	const adminSupabase = createAdminClient();

	if (adminSupabase) {
		const { data, error } = await adminSupabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
		if (error) return { data: null, error };

		const pendingUsers = (data?.users ?? [])
			.filter((user: any) => !isApproved(user))
			.map(toPendingUser);
		return { data: pendingUsers, error: null };
	}

	const { data: users, error } = await userSupabase.from('auth.users').select('*');
	if (error) return { data: null, error };

	const pendingUsers = (users ?? []).filter((user: any) => !isApproved(user)).map(toPendingUser);
	return { data: pendingUsers, error: null };
}

export async function approveUserById(userSupabase: any, userId: string) {
	const adminSupabase = createAdminClient();

	if (adminSupabase) {
		const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
			user_metadata: { approved: true }
		});
		if (error) return { data: null, error };
		return { data, error: null };
	}

	const { data, error } = await userSupabase
		.from('auth.users')
		.update({ approved: true })
		.eq('id', userId)
		.select('id');
	return { data, error };
}

export async function rejectUserById(userSupabase: any, userId: string) {
	const adminSupabase = createAdminClient();

	if (adminSupabase) {
		const { error } = await adminSupabase.auth.admin.deleteUser(userId);
		if (error) return { error };

		await userSupabase.from('profiles').delete().eq('id', userId);
		await userSupabase.from('user_roles').delete().eq('user_id', userId);
		return { error: null };
	}

	const { error } = await userSupabase.from('auth.users').delete().eq('id', userId);
	if (error) return { error };

	await userSupabase.from('profiles').delete().eq('id', userId);
	await userSupabase.from('user_roles').delete().eq('user_id', userId);
	return { error: null };
}
