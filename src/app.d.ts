// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/ssr';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session?: Session | null;
			isAdmin?: boolean;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
