import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		await requireAdmin(locals.supabase);
		const userId = params.id;

		const { data: updatedUsers, error } = await locals.supabase
			.from('auth.users')
			.update({ approved: true })
			.eq('id', userId)
			.select('*');

		if (error) {
			return json({ error: error.message || 'Failed to approve user' }, { status: 500 });
		}

		if (!updatedUsers || updatedUsers.length === 0) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ approved: true, user: updatedUsers[0] });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
