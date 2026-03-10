import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient, requireAdmin } from '$lib/server/admin';

type SuggestionStatus = 'pending' | 'resolved';

type AuthContext = {
	db: any;
	id: string;
};

async function getAuthorizedContext(
	params: { id: string },
	locals: Parameters<RequestHandler>[0]['locals']
): Promise<AuthContext | Response> {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const adminSupabase = createAdminClient();
	const db = adminSupabase ?? supabase;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await ensureAdminAccess(db, user.id);
	} catch {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const adminSupabase = createAdminClient();
	const db = adminSupabase ?? supabase;

	return {
		db,
		id: params.id
	};
}

function parseStatus(value: unknown): SuggestionStatus | null {
	return value === 'pending' || value === 'resolved' ? value : null;
}

/**
 * DELETE /api/suggestions/[id]
 * Delete a suggestion (admin only)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const auth = await getAuthorizedContext(params, locals);
	if (auth instanceof Response) return auth;

	const { db, id } = auth;
	const { error } = await db.from('suggestions').delete().eq('id', id);

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
	const auth = await getAuthorizedContext(params, locals);
	if (auth instanceof Response) return auth;

	const { db, id } = auth;

	try {
		const body = await request.json();
		const status = parseStatus(body?.status);

		if (!status) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		const { error: updateError } = await db.from('suggestions').update({ status }).eq('id', id);

		if (updateError) {
			console.error('Error updating suggestion:', updateError);
			return json({ error: 'Failed to update suggestion' }, { status: 500 });
		}

		const { data: suggestion, error: fetchError } = await db
			.from('suggestions')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError) {
			console.error('Error fetching updated suggestion:', fetchError);
			return json({ error: 'Suggestion updated but failed to fetch result' }, { status: 500 });
		}

		return json({ suggestion });
	} catch (err) {
		console.error('Error parsing request:', err);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
