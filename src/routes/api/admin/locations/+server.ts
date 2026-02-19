import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import { ensureMariaWikeloSeedData } from '$lib/server/maria-seed';
import type { RequestHandler } from './$types';

function toLocationPayload(body: Record<string, unknown>) {
	return {
		id: body.id,
		slug: body.slug,
		name_en: body.name_en,
		name_fr: body.name_fr,
		system: body.system,
		planet: body.planet ?? null,
		moon: body.moon ?? null,
		type: body.type,
		difficulty: body.difficulty ?? null,
		short_description_en: body.short_description_en ?? null,
		short_description_fr: body.short_description_fr ?? null,
		description_en: body.description_en ?? null,
		description_fr: body.description_fr ?? null,
		how_to_access_en: body.how_to_access_en ?? null,
		how_to_access_fr: body.how_to_access_fr ?? null,
		mission_types_en: body.mission_types_en ?? null,
		mission_types_fr: body.mission_types_fr ?? null,
		loot_types_en: body.loot_types_en ?? null,
		loot_types_fr: body.loot_types_fr ?? null,
		requirements: body.requirements ?? null,
		rewards: body.rewards ?? null,
		coordinates: body.coordinates ?? null,
		crate_types: body.crate_types ?? null,
		related_missions: body.related_missions ?? null,
		image_url: body.image_url ?? null,
		cheatsheet_image_url: body.cheatsheet_image_url ?? null
	};
}

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
		await ensureMariaWikeloSeedData();
		await requireAdmin(supabase);

		const body = await request.json();
		const locationData = toLocationPayload(body);

		// Validate required fields
		if (!locationData.slug || !locationData.name_en || !locationData.name_fr) {
			return json({ error: 'Missing required fields: slug, name_en, name_fr' }, { status: 400 });
		}

		const adminClient = createAdminClient() ?? supabase;
		let { data, error } = await adminClient
			.from('locations')
			.insert([locationData])
			.select()
			.single();

		if (error?.message?.includes('Unknown column')) {
			const legacyPayload = {
				id: locationData.id,
				slug: locationData.slug,
				name_en: locationData.name_en,
				name_fr: locationData.name_fr,
				system: locationData.system,
				type: locationData.type,
				difficulty: locationData.difficulty,
				description_en: locationData.description_en,
				description_fr: locationData.description_fr,
				image_url: locationData.image_url
			};
			({ data, error } = await adminClient
				.from('locations')
				.insert([legacyPayload])
				.select()
				.single());
		}

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
