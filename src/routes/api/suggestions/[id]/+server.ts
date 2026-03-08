import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function ensureAdminAccess(supabase: any, userId: string) {
	const { data: roles, error } = await supabase
		.from('user_roles')
		.select('role')
		.eq('user_id', userId);

	if (
		error ||
		!Array.isArray(roles) ||
		!roles.some((role: { role?: string }) => role.role === 'admin')
	) {
		throw new Error('Forbidden');
	}
}

/**
 * DELETE /api/suggestions/[id]
 * Delete a suggestion (admin only)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await ensureAdminAccess(supabase, user.id);
	} catch {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = params;

	// Delete the suggestion
	const { error } = await supabase.from('suggestions').delete().eq('id', id);

	if (error) {
		console.error('Error deleting suggestion:', error);
		return json({ error: 'Failed to delete suggestion' }, { status: 500 });
	}

	return json({ success: true });
};

/**
 * PATCH /api/suggestions/[id]
 * Update a suggestion status (admin only)
 */
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await ensureAdminAccess(supabase, user.id);
	} catch {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = params;

	try {
		const body = await request.json();
		const { status } = body;

		// Validate status
		if (!['pending', 'reviewed', 'resolved'].includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		// Update the suggestion
		const { data, error } = await supabase
			.from('suggestions')
			.update({ status })
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating suggestion:', error);
			return json({ error: 'Failed to update suggestion' }, { status: 500 });
		}

		return json({ suggestion: data });
	} catch (err) {
		console.error('Error parsing request:', err);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
