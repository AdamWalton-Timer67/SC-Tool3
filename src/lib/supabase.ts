import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { browser } from '$app/environment';
import type { SupabaseClient } from '@supabase/supabase-js';

// Create a mock Supabase client that doesn't crash when Supabase is unavailable
function createMockSupabaseClient(): any {
	const mockError = { message: 'Supabase is currently unavailable', status: 503 };
	const mockResponse = { data: null, error: mockError };

	return {
		from: () => ({
			select: () => Promise.resolve(mockResponse),
			insert: () => Promise.resolve(mockResponse),
			update: () => Promise.resolve(mockResponse),
			delete: () => Promise.resolve(mockResponse),
			upsert: () => Promise.resolve(mockResponse),
			eq: function () {
				return this;
			},
			neq: function () {
				return this;
			},
			gt: function () {
				return this;
			},
			gte: function () {
				return this;
			},
			lt: function () {
				return this;
			},
			lte: function () {
				return this;
			},
			like: function () {
				return this;
			},
			ilike: function () {
				return this;
			},
			is: function () {
				return this;
			},
			in: function () {
				return this;
			},
			contains: function () {
				return this;
			},
			containedBy: function () {
				return this;
			},
			range: function () {
				return this;
			},
			order: function () {
				return this;
			},
			limit: function () {
				return this;
			},
			single: () => Promise.resolve(mockResponse),
			maybeSingle: () => Promise.resolve(mockResponse)
		}),
		rpc: () => Promise.resolve(mockResponse),
		auth: {
			getSession: () => Promise.resolve({ data: { session: null }, error: null }),
			getUser: () => Promise.resolve({ data: { user: null }, error: mockError }),
			signInWithPassword: () => Promise.resolve(mockResponse),
			signUp: () => Promise.resolve(mockResponse),
			signOut: () => Promise.resolve({ error: null }),
			signInWithOAuth: () => Promise.resolve(mockResponse),
			onAuthStateChange: () => ({
				data: { subscription: { unsubscribe: () => {} } },
				error: null
			})
		},
		storage: {
			from: () => ({
				upload: () => Promise.resolve(mockResponse),
				download: () => Promise.resolve(mockResponse),
				remove: () => Promise.resolve(mockResponse),
				list: () => Promise.resolve(mockResponse),
				getPublicUrl: () => ({ data: { publicUrl: '' } })
			})
		}
	};
}

// Check if Supabase credentials are available
const hasSupabaseCredentials = PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = hasSupabaseCredentials
	? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				getAll() {
					if (!browser) return [];
					return document.cookie.split('; ').map((cookie) => {
						const [name, ...rest] = cookie.split('=');
						return { name, value: rest.join('=') };
					});
				},
				setAll(cookiesToSet) {
					if (!browser) return;
					cookiesToSet.forEach(({ name, value, options }) => {
						// Add secure flag in production (https)
						const secure = window.location.protocol === 'https:' ? 'secure;' : '';
						// Default to lax if not specified for CSRF protection
						const sameSite = options?.sameSite || 'lax';

						document.cookie = `${name}=${value}; path=/; ${secure} ${
							options?.maxAge ? `max-age=${options.maxAge};` : ''
						} samesite=${sameSite};`;
					});
				}
			}
		})
	: (createMockSupabaseClient() as SupabaseClient);

// Log warning if using mock client
if (!hasSupabaseCredentials && browser) {
	console.warn('⚠️ Supabase client is running in mock mode - database features are disabled');
}
