/**
 * Admin Rewards Reputation API - Manage reputation requirements
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

/**
 * GET - Get all reputation requirements for a specific reward
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);
		const { id } = params;

		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('reputation_requirements')
			.select('*')
			.eq('reward_id', id)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Error fetching reputation requirements:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data: data || [] });
	} catch (error) {
		console.error('Unexpected error in GET /api/admin/rewards/[id]/reputation:', error);
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};

/**
 * POST - Add or update reputation requirements for a reward
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);
		const { id } = params;
		const body = await request.json();

		// Validate the input
		if (!body.reputation_name_en || !body.reputation_name_fr || !body.required_level) {
			return json(
				{
					error: 'Missing required fields: reputation_name_en, reputation_name_fr, required_level'
				},
				{ status: 400 }
			);
		}

		if (body.required_level <= 0) {
			return json({ error: 'required_level must be greater than 0' }, { status: 400 });
		}

		const adminClient = createAdminClient() ?? supabase;

		// If an ID is provided, update; otherwise insert
		if (body.id) {
			const { data, error } = await adminClient
				.from('reputation_requirements')
				.update({
					reputation_name_en: body.reputation_name_en,
					reputation_name_fr: body.reputation_name_fr,
					required_level: body.required_level
				})
				.eq('id', body.id)
				.eq('reward_id', id)
				.select()
				.single();

			if (error) {
				console.error('Error updating reputation requirement:', error);
				return json({ error: error.message }, { status: 500 });
			}

			return json({ success: true, data });
		} else {
			const { data, error } = await adminClient
				.from('reputation_requirements')
				.insert({
					reward_id: id,
					reputation_name_en: body.reputation_name_en,
					reputation_name_fr: body.reputation_name_fr,
					required_level: body.required_level
				})
				.select()
				.single();

			if (error) {
				console.error('Error creating reputation requirement:', error);
				return json({ error: error.message }, { status: 500 });
			}

			return json({ success: true, data });
		}
	} catch (error) {
		console.error('Unexpected error in POST /api/admin/rewards/[id]/reputation:', error);
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};

/**
 * DELETE - Delete a specific reputation requirement or all for a reward
 */
export const DELETE: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);
		const { id } = params;
		const url = new URL(request.url);
		const reputationId = url.searchParams.get('reputation_id');

		const adminClient = createAdminClient() ?? supabase;

		if (reputationId) {
			// Delete specific reputation requirement
			const { error } = await adminClient
				.from('reputation_requirements')
				.delete()
				.eq('id', reputationId)
				.eq('reward_id', id);

			if (error) {
				console.error('Error deleting reputation requirement:', error);
				return json({ error: error.message }, { status: 500 });
			}
		} else {
			// Delete all reputation requirements for this reward
			const { error } = await adminClient
				.from('reputation_requirements')
				.delete()
				.eq('reward_id', id);

			if (error) {
				console.error('Error deleting all reputation requirements:', error);
				return json({ error: error.message }, { status: 500 });
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Unexpected error in DELETE /api/admin/rewards/[id]/reputation:', error);
		return json({ error: 'Unauthorized or server error' }, { status: 403 });
	}
};
