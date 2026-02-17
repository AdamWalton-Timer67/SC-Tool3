// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type User = {
	id: string;
	email?: string;
	created_at?: string;
	last_sign_in_at?: string;
	user_metadata?: Record<string, unknown>;
};

type Session = {
	access_token: string;
	user: User;
};

declare global {
	namespace App {
		interface Locals {
			supabase: any;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session?: Session | null;
			isAdmin?: boolean;
		}
	}
}

export {};
