import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/supabase';
import { createMariaSupabaseClient, findMariaAuthUserById, isApprovedUser } from '$lib/server/maria-supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionUserId = event.cookies.get(SESSION_COOKIE) ?? null;
	const authUser = await findMariaAuthUserById(sessionUserId);
	const approvedUser: any = authUser && isApprovedUser(authUser) ? authUser : null;

	event.locals.supabase = createMariaSupabaseClient({ requestUserId: approvedUser?.id ?? null }) as any;
	event.locals.safeGetSession = async () => {
		if (!approvedUser) return { session: null, user: null };
		const session = {
			access_token: `nas-token-${approvedUser.id}`,
			user: {
				id: approvedUser.id,
				email: approvedUser.email,
				created_at: approvedUser.created_at,
				last_sign_in_at: approvedUser.last_sign_in_at,
				user_metadata:
					typeof approvedUser.raw_user_meta_data === 'string'
						? JSON.parse(approvedUser.raw_user_meta_data)
						: approvedUser.raw_user_meta_data ?? {}
			}
		};
		return { session, user: session.user };
	};

	return resolve(event);
};
