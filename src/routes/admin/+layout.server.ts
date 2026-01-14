/**
 * Admin Layout Server Load
 *
 * Checks if the user is an admin before allowing access to admin pages
 */

import { redirect } from '@sveltejs/kit';
import { isUserAdmin } from '$lib/server/admin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Check if Supabase is available
	if (!supabase) {
		console.warn('Supabase unavailable - redirecting from admin');
		throw redirect(303, '/');
	}

	try {
		// Check if user is logged in
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			// Redirect to home page if not logged in
			throw redirect(303, '/');
		}

		// Check if user is admin
		const isAdmin = await isUserAdmin(supabase);

		if (!isAdmin) {
			// Redirect to home page if not admin
			throw redirect(303, '/');
		}

		return {
			user,
			isAdmin
		};
	} catch (err) {
		console.warn('Error loading admin layout - Supabase may be unavailable:', err);
		throw redirect(303, '/');
	}
};
