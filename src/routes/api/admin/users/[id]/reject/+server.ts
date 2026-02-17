import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';
import { rejectUserById } from '$lib/server/admin-users';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		await requireAdmin(locals.supabase);
		const userId = params.id;

		const { error } = await rejectUserById(userId);
		if (error) {
			const status = error.message === 'User not found.' ? 404 : 500;
			return json({ error: error.message || 'Failed to reject user' }, { status });
		}

		return json({ rejected: true, userId });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
