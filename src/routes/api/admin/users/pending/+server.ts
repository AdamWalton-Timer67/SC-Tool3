import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';
import { listPendingUsers } from '$lib/server/admin-users';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		await requireAdmin(locals.supabase);

		const { data: pendingUsers, error } = await listPendingUsers();
		if (error) {
			return json({ error: 'Failed to load users' }, { status: 500 });
		}

		return json({ pendingUsers: pendingUsers ?? [] });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
