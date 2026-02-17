// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type Session = null;

type User = {
	id: string;
	email?: string;
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
