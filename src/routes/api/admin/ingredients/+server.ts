/**
 * Admin Ingredients API - Create
 *
 * POST /api/admin/ingredients
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

function toIngredientPayload(body: Record<string, unknown>) {
	return {
		id: body.id,
		name_en: body.name_en,
		name_fr: body.name_fr,
		category: body.category,
		rarity: body.rarity,
		image_url: body.image_url ?? null,
		image_credit: body.image_credit ?? null,
		description_en: body.description_en ?? null,
		description_fr: body.description_fr ?? null,
		how_to_obtain_en: body.how_to_obtain_en ?? null,
		how_to_obtain_fr: body.how_to_obtain_fr ?? null,
		locations_en: body.locations_en ?? null,
		locations_fr: body.locations_fr ?? null,
		location_id: body.location_id ?? null
	};
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		// Check admin permissions
		await requireAdmin(supabase);

		// Parse request body
		const body = await request.json();
		const payload = toIngredientPayload(body);

		// Validate required fields
		if (
			!payload.id ||
			!payload.name_en ||
			!payload.name_fr ||
			!payload.category ||
			!payload.rarity
		) {
			return json(
				{ error: 'Missing required fields: id, name_en, name_fr, category, rarity' },
				{ status: 400 }
			);
		}

		// Insert ingredient using admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('ingredients')
			.insert([payload])
			.select()
			.single();

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
