import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/suggestions
 * Get all suggestions (admin only)
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Check if user is admin
	const { data: userData } = await supabase
		.from('auth.users')
		.select('raw_user_meta_data')
		.eq('id', user.id)
		.single();

	const isAdmin = userData?.raw_user_meta_data?.role === 'admin';

	if (!isAdmin) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	// Fetch all suggestions
	const { data: suggestions, error } = await supabase
		.from('suggestions')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching suggestions:', error);
		return json({ error: 'Failed to fetch suggestions' }, { status: 500 });
	}

	return json({ suggestions });
};

/**
 * POST /api/suggestions
 * Create a new suggestion (no authentication required)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { supabase, safeGetSession } = locals;

	// Get user if authenticated (optional)
	const { user } = await safeGetSession();

	try {
		const body = await request.json();
		const { item_type, item_id, item_name, suggestion_type, content, user_email } = body;

		// Validate required fields
		if (!item_type || !item_id || !item_name || !suggestion_type || !content) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Validate item_type
		if (!['reward', 'ingredient'].includes(item_type)) {
			return json({ error: 'Invalid item_type' }, { status: 400 });
		}

		// Insert suggestion (user_id can be null for anonymous suggestions)
		const { data, error } = await supabase
			.from('suggestions')
			.insert({
				user_id: user?.id || null,
				item_type,
				item_id,
				item_name,
				suggestion_type,
				content,
				user_email: user_email || null
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating suggestion:', error);
			return json({ error: 'Failed to create suggestion' }, { status: 500 });
		}

		return json({ suggestion: data }, { status: 201 });
	} catch (err) {
		console.error('Error parsing request:', err);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
