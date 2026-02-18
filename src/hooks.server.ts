import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/supabase';
import { createMariaSupabaseClient, findMariaAuthUserById, isApprovedUser } from '$lib/server/maria-supabase';

function createUnavailableSupabaseClient() {
	const unavailable = { message: 'MariaDB is not configured or unavailable.' };
	const queryResult = Promise.resolve({ data: null, error: unavailable });
	const queryBuilder = {
		select: () => queryBuilder,
		insert: () => queryBuilder,
		update: () => queryBuilder,
		upsert: () => queryBuilder,
		delete: () => queryBuilder,
		eq: () => queryBuilder,
		in: () => queryBuilder,
		order: () => queryBuilder,
		limit: () => queryBuilder,
		single: async () => ({ data: null, error: unavailable }),
		maybeSingle: async () => ({ data: null, error: unavailable }),
		then: queryResult.then.bind(queryResult)
	};

	return {
		from: () => queryBuilder,
		rpc: async () => ({ data: null, error: unavailable }),
		auth: {
			getSession: async () => ({ data: { session: null }, error: null }),
			getUser: async () => ({ data: { user: null }, error: null }),
			signInWithPassword: async () => ({ data: null, error: unavailable }),
			signUp: async () => ({ data: null, error: unavailable }),
			signOut: async () => ({ error: null }),
			signInWithOAuth: async () => ({ data: null, error: unavailable }),
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null })
		}
	};
}

export const handle: Handle = async ({ event, resolve }) => {
	const sessionUserId = event.cookies.get(SESSION_COOKIE) ?? null;
	try {
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
	} catch (error) {
		console.warn('Maria unavailable, using degraded server mode:', error);
		event.locals.supabase = createUnavailableSupabaseClient() as any;
		event.locals.safeGetSession = async () => ({ session: null, user: null });
	}

	return resolve(event);
};
