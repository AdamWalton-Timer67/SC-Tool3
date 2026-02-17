import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';
import { approveUserById } from '$lib/server/admin-users';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		await requireAdmin(locals.supabase);
		const userId = params.id;

		const { data, error } = await approveUserById(locals.supabase, userId);

		if (error) {
			return json({ error: 'Failed to approve user' }, { status: 500 });
		}

		if (!data || (Array.isArray(data) && data.length === 0)) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ approved: true, user: Array.isArray(data) ? data[0] : data });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
