/**
 * Admin Ingredients API - Update & Delete
 *
 * PUT /api/admin/ingredients/[id]
 * DELETE /api/admin/ingredients/[id]
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

function toIngredientPayload(body: Record<string, unknown>) {
	return {
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

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		// Check admin permissions
		await requireAdmin(supabase);

		// Parse request body
		const body = await request.json();
		const updateData = toIngredientPayload(body);
		const { id } = params;

		// Validate required fields
		if (!updateData.name_en || !updateData.name_fr || !updateData.category || !updateData.rarity) {
			return json(
				{ error: 'Missing required fields: name_en, name_fr, category, rarity' },
				{ status: 400 }
			);
		}

		// Update ingredient using admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('ingredients')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating ingredient:', error);
			return json({ error: error.message }, { status: 500 });
		}

		if (!data) {
			return json({ error: 'Ingredient not found' }, { status: 404 });
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{ status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		// Check admin permissions
		await requireAdmin(supabase);

		const { id } = params;

		// Delete ingredient using admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { error } = await adminClient.from('ingredients').delete().eq('id', id);

		if (error) {
			console.error('Error deleting ingredient:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{ status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
		);
	}
};
