import type { LayoutServerLoad } from './$types';
import { isUserAdmin } from '$lib/server/admin';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	let isAdmin = false;
	if (session) {
		try {
			isAdmin = await isUserAdmin(locals.supabase);
		} catch (error) {
			console.error('Error checking admin status:', error);
		}
	}

	return {
		session,
		isAdmin
	};
};
