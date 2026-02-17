/**
 * Admin Authentication & Authorization (local NAS mode)
 */

export async function isUserAdmin(supabase: any): Promise<boolean> {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) return false;

	const { data: roles } = await supabase.from('user_roles').select('*').eq('user_id', user.id);
	return Array.isArray(roles) && roles.some((r: any) => r.role === 'admin');
}

export async function requireAdmin(supabase: any): Promise<void> {
	const isAdmin = await isUserAdmin(supabase);
	if (!isAdmin) {
		throw new Error('Unauthorized: Admin access required');
	}
}

export function createAdminClient(): any {
	throw new Error('Not required in local NAS mode: use locals.supabase with requireAdmin().');
}
