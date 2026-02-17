import { supabase } from '$lib/supabase';
import type { User } from '$lib/supabase';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

class AuthStore {
	user = $state<User | null>(null);
	loading = $state(true);
	showAuthDialog = $state(false);

	constructor() {
		// Only initialize on the client
		if (browser) {
			this.init();
		}
	}

	async init() {
		// Set loading to false immediately to not block UI
		this.loading = false;

		// Get initial user (secure method) with timeout
		try {
			const timeoutPromise = new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error('Auth timeout')), 3000)
			);

			const authPromise = supabase.auth.getUser();

			const result = await Promise.race([authPromise, timeoutPromise]);

			this.user = result.error ? null : result.data.user;
		} catch (err) {
			console.warn('Auth initialization timeout or error - Supabase may be unavailable:', err);
			this.user = null;
		}

		// Listen for auth changes
		try {
			supabase.auth.onAuthStateChange(async (event: any, session: any) => {
				try {
					if (event === 'SIGNED_IN' && session?.user) {
						// Verify the user with getUser() for security
						const {
							data: { user },
							error
						} = await supabase.auth.getUser();
						this.user = !error ? user : null;
					} else if (event === 'SIGNED_OUT') {
						this.user = null;
					}
					// Invalidate all data to refresh isAdmin status (client-only)
					if (browser) {
						await invalidateAll();
					}
				} catch (err) {
					console.warn('Error handling auth state change:', err);
				}
			});
		} catch (err) {
			console.warn('Error setting up auth listener - Supabase may be unavailable:', err);
		}
	}

	async signIn(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) throw error;
		this.showAuthDialog = false;
		// Invalidate to refresh isAdmin status (client-only)
		if (browser) {
			await invalidateAll();
		}
		return data;
	}

	async signUp(email: string, password: string, displayName: string | null = null) {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					display_name: displayName
				}
			}
		});

		if (error) throw error;
		this.showAuthDialog = false;
		// Invalidate to refresh isAdmin status (client-only)
		if (browser) {
			await invalidateAll();
		}
		return data;
	}

	async signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		// Invalidate to refresh isAdmin status (client-only)
		if (browser) {
			await invalidateAll();
		}
	}

	async signInWithOAuth(provider: 'discord' | 'twitch' | 'google') {
		// Use custom redirect URL from env if set, otherwise use current origin
		const redirectUrl = browser
			? env.PUBLIC_OAUTH_REDIRECT_URL || window.location.origin
			: undefined;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: redirectUrl,
				skipBrowserRedirect: false
			}
		});

		if (error) throw error;
		return data;
	}

	openAuthDialog() {
		this.showAuthDialog = true;
	}

	closeAuthDialog() {
		this.showAuthDialog = false;
	}
}

export const authStore = new AuthStore();
