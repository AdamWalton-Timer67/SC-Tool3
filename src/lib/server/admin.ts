/**
 * Admin Authentication & Authorization
 */

import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';
import { createMariaSupabaseClient } from '$lib/server/maria-supabase';
import { hasMariaConfig } from '$lib/server/maria';

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

export function createAdminClient(): any | null {
	const url = env.SUPABASE_URL;
	const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

	if (url && serviceRoleKey) {
		return createClient(url, serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}

	if (hasMariaConfig()) {
		return createMariaSupabaseClient();
	}

	return null;
}
