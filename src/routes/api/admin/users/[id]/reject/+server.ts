import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		await requireAdmin(locals.supabase);
		const userId = params.id;

		const { data: removedUsers, error } = await locals.supabase
			.from('auth.users')
			.delete()
			.eq('id', userId)
			.select('*');

		if (error) {
			return json({ error: error.message || 'Failed to reject user' }, { status: 500 });
		}

		if (!removedUsers || removedUsers.length === 0) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		await locals.supabase.from('profiles').delete().eq('id', userId);
		await locals.supabase.from('user_roles').delete().eq('user_id', userId);

		return json({ rejected: true, user: removedUsers[0] });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
