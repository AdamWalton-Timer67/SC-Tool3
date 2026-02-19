/**
 * Admin Rewards API - Update & Delete
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

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		// First verify the user is an admin
		await requireAdmin(supabase);

		const body = await request.json();
		const { id } = params;

		const { ...updateData } = body;

		// Normalize category to plural form
		if (updateData.category) {
			updateData.category = normalizeCategory(updateData.category);
		}

		// Use admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('rewards')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating reward:', error);
			return json({ error: error.message }, { status: 500 });
		}

		if (!data) {
			console.error('Reward not found for update:', id);
			return json({ error: 'Reward not found' }, { status: 404 });
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('Unexpected error in PUT /api/admin/rewards/[id]:', error);
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		// First verify the user is an admin
		await requireAdmin(supabase);
		const { id } = params;

		// Use admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { error } = await adminClient.from('rewards').delete().eq('id', id);

		if (error) {
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};
