import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Validate environment variables
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		console.warn('Missing Supabase environment variables - running in degraded mode:', {
			hasUrl: !!supabaseUrl,
			hasKey: !!supabaseKey
		});

		// Create a mock client that returns null values
		event.locals.supabase = null as any;
		event.locals.safeGetSession = async () => ({ session: null, user: null });

		return resolve(event, {
			filterSerializedResponseHeaders(name) {
				return name === 'content-range' || name === 'x-supabase-api-version';
			}
		});
	}

	// Create a Supabase client with SSR support
	try {
		event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
			cookies: {
				getAll: () => {
					return event.cookies.getAll();
				},
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		});

		// Helper function to get session
		event.locals.safeGetSession = async () => {
			try {
				const {
					data: { session }
				} = await event.locals.supabase.auth.getSession();
				if (!session) {
					return { session: null, user: null };
				}

				const {
					data: { user },
					error
				} = await event.locals.supabase.auth.getUser();
				if (error) {
					return { session: null, user: null };
				}

				return { session, user };
			} catch (error) {
				console.warn('Error getting session:', error);
				return { session: null, user: null };
			}
		};
	} catch (error) {
		console.warn('Error creating Supabase client:', error);
		event.locals.supabase = null as any;
		event.locals.safeGetSession = async () => ({ session: null, user: null });
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
