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

		try {
			const response = await fetch('/api/auth/session');
			const payload = await response.json();
			this.user = response.ok ? (payload?.user ?? null) : null;
		} catch (err) {
			console.warn('Auth initialization error:', err);
			this.user = null;
		}
	}

	async signIn(email: string, password: string) {
		const response = await fetch('/api/auth/signin', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const payload = await response.json();
		if (!response.ok) throw new Error(payload?.error || 'Sign in failed.');

		this.user = payload?.user ?? null;
		this.showAuthDialog = false;
		if (browser) {
			await invalidateAll();
		}
		return payload;
	}

	async signUp(email: string, password: string, displayName: string | null = null) {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password, displayName })
		});

		const payload = await response.json();
		if (!response.ok) {
			throw new Error(payload?.error || 'Signup failed.');
		}

		this.showAuthDialog = false;
		if (browser) {
			await invalidateAll();
		}
		return payload;
	}

	async signOut() {
		const response = await fetch('/api/auth/signout', { method: 'POST' });
		if (!response.ok) throw new Error('Sign out failed.');
		this.user = null;
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
