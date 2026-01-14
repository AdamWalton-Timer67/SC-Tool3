/**
 * Admin Authentication & Authorization
 *
 * Helper functions to check if a user is an administrator
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

/**
 * Check if the current user is an admin
 * @param supabase - Supabase client instance
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isUserAdmin(supabase: SupabaseClient): Promise<boolean> {
	try {
		// Get current user
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error('No user found or error:', userError);
			return false;
		}

		// Check user_roles table
		const { data, error } = await supabase
			.from('user_roles')
			.select('role')
			.eq('user_id', user.id)
			.maybeSingle();

		if (error) {
			return false;
		}

		if (!data) {
			return false;
		}

		return data.role === 'admin';
	} catch (error) {
		console.error('Error checking admin status:', error);
		return false;
	}
}

/**
 * Require admin access - throws error if user is not admin
 * @param supabase - Supabase client instance
 * @throws Error if user is not authenticated or not an admin
 */
export async function requireAdmin(supabase: SupabaseClient): Promise<void> {
	const isAdmin = await isUserAdmin(supabase);

	if (!isAdmin) {
		throw new Error('Unauthorized: Admin access required');
	}
}

/**
 * Create an admin Supabase client that bypasses RLS
 * This should ONLY be used after verifying the user is an admin with requireAdmin()
 * @returns SupabaseClient with service_role privileges
 */
export function createAdminClient(): SupabaseClient {
	return createClient(publicEnv.PUBLIC_SUPABASE_URL, privateEnv.SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
}
