/**
 * Admin Reward Requirements API
 *
 * POST /api/admin/rewards/[id]/requirements - Create requirements
 * DELETE /api/admin/rewards/[id]/requirements - Delete all requirements for reward
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const { id } = params;
		const requirements = await request.json();

		// Validate
		if (!Array.isArray(requirements)) {
			return json({ error: 'Requirements must be an array' }, { status: 400 });
		}

		// Insert requirements using admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('reward_ingredients')
			.insert(requirements)
			.select();

		if (error) {
			console.error('Error creating requirements:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data });
	} catch (error) {
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const { id } = params;

		// Delete all requirements for this reward using admin client to bypass RLS
		const adminClient = createAdminClient() ?? supabase;
		const { error } = await adminClient.from('reward_ingredients').delete().eq('reward_id', id);

		if (error) {
			console.error('Error deleting requirements:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};
