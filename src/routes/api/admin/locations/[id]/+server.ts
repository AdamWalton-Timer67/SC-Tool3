import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

// GET: Get single location
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('locations')
			.select('*')
			.eq('id', params.id)
			.single();

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

// PUT: Update location
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const locationData = await request.json();

		const adminClient = createAdminClient() ?? supabase;
		const { data, error } = await adminClient
			.from('locations')
			.update(locationData)
			.eq('id', params.id)
			.select()
			.single();

		if (error) {
			console.error('Error updating location:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true, data });
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

// DELETE: Delete location
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const adminClient = createAdminClient() ?? supabase;
		const { error } = await adminClient.from('locations').delete().eq('id', params.id);

		if (error) {
			console.error('Error deleting location:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json({ success: true });
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
