/**
 * Admin Ingredients API - Create
 *
 * POST /api/admin/ingredients
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		// Check admin permissions
		await requireAdmin(supabase);

		// Parse request body
		const body = await request.json();

		// Validate required fields
		if (!body.id || !body.name_en || !body.name_fr || !body.category || !body.rarity) {
			return json(
				{ error: 'Missing required fields: id, name_en, name_fr, category, rarity' },
				{ status: 400 }
			);
		}

		// Insert ingredient using admin client to bypass RLS
		const adminClient = createAdminClient();
		const { data, error } = await adminClient.from('ingredients').insert([body]).select().single();

		if (error) {
			console.error('Error creating ingredient:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data }, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{ status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
		);
	}
};
