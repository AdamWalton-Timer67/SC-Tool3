import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, createSupabaseClient, findAuthUserById } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionUserId = event.cookies.get(SESSION_COOKIE) ?? null;
	const authUser = findAuthUserById(sessionUserId) as any;
	const approvedUser: any = authUser && authUser.approved !== false ? authUser : null;

	event.locals.supabase = createSupabaseClient({ requestUserId: approvedUser?.id ?? null }) as any;
	event.locals.safeGetSession = async () => {
		if (!approvedUser) return { session: null, user: null };
		const session = {
			access_token: `nas-token-${approvedUser.id}`,
			user: {
				id: approvedUser.id,
				email: approvedUser.email,
				created_at: approvedUser.created_at,
				last_sign_in_at: approvedUser.last_sign_in_at,
				user_metadata: approvedUser.raw_user_meta_data ?? {}
			}
		};
		return { session, user: session.user };
	};

	return resolve(event);
};
