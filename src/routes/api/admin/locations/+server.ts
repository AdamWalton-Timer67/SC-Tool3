import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

// GET: List all locations
export const GET: RequestHandler = async ({ locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('locations')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			return json({ error: error.message }, { status: 500 });
		}

		return json(data);
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{
				status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500
			}
		);
	}
};

// POST: Create new location
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const locationData = await request.json();

		// Validate required fields
		if (!locationData.slug || !locationData.name_en || !locationData.name_fr) {
			return json({ error: 'Missing required fields: slug, name_en, name_fr' }, { status: 400 });
		}

		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('locations')
			.insert([locationData])
			.select()
			.single();

		if (error) {
			console.error('Error creating location:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data }, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{
				status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500
			}
		);
	}
};
