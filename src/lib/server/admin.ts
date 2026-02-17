/**
 * Admin Authentication & Authorization
 *
 * Free NAS mode: backend auth is disabled.
 */

export async function isUserAdmin(_supabase: any): Promise<boolean> {
	return false;
}

export async function requireAdmin(_supabase: any): Promise<void> {
	throw new Error('Unauthorized: Admin access is disabled in free NAS mode');
}

export function createAdminClient(): any {
	throw new Error('Admin client is unavailable: Supabase was removed');
}
