/**
 * Admin Ingredients API - Update & Delete
 *
 * PUT /api/admin/ingredients/[id]
 * DELETE /api/admin/ingredients/[id]
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		// Check admin permissions
		await requireAdmin(supabase);

		// Parse request body
		const body = await request.json();
		const { id } = params;

		// Validate required fields
		if (!body.name_en || !body.name_fr || !body.category || !body.rarity) {
			return json(
				{ error: 'Missing required fields: name_en, name_fr, category, rarity' },
				{ status: 400 }
			);
		}

		// Remove id from body (cannot update id)
		const { id: _, ...updateData } = body;

		// Update ingredient using admin client to bypass RLS
		const adminClient = createAdminClient();
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
		const adminClient = createAdminClient();
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
