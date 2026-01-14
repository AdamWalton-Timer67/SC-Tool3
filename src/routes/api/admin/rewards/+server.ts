/**
 * Admin Rewards API - Create
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

/**
 * Normalize category names to plural form
 */
function normalizeCategory(category: string): string {
	const normalizations: Record<string, string> = {
		ship: 'ships',
		weapon: 'weapons',
		utility: 'utilities'
	};
	return normalizations[category] || category;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		// First verify the user is an admin
		await requireAdmin(supabase);
		const body = await request.json();

		if (!body.id || !body.name_en || !body.name_fr || !body.category || !body.rarity) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Normalize category to plural form
		body.category = normalizeCategory(body.category);

		// Use admin client to bypass RLS
		const adminClient = createAdminClient();
		const { data, error } = await adminClient.from('rewards').insert([body]).select().single();

		if (error) {
			console.error('Error creating reward:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data }, { status: 201 });
	} catch (error) {
		return json({ error: 'Unauthorized or server error', initialError: error }, { status: 403 });
	}
};
