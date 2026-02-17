import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/admin';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		await requireAdmin(locals.supabase);

		const { data: users, error } = await locals.supabase.from('auth.users').select('*');
		if (error) {
			return json({ error: error.message || 'Failed to load users' }, { status: 500 });
		}

		const pendingUsers = (users || [])
			.filter((user: any) => user.approved !== true)
			.map((user: any) => ({
				id: user.id,
				email: user.email,
				created_at: user.created_at,
				display_name: user.raw_user_meta_data?.display_name ?? null
			}));

		return json({ pendingUsers });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 403 });
	}
};
