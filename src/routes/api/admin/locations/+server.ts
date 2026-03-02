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

function toLegacyLocationPayload(locationData: Record<string, any>) {
	return {
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
}

function isDuplicateError(error: any): boolean {
	const msg = String(error?.message || '').toLowerCase();
	return msg.includes('duplicate') || msg.includes('unique') || msg.includes('uniq_');
}

async function upsertLocation(adminClient: any, payload: Record<string, any>) {
	let { data, error } = await adminClient.from('locations').insert([payload]).select().single();

	if (error?.message?.includes('Unknown column')) {
		({ data, error } = await adminClient
			.from('locations')
			.insert([toLegacyLocationPayload(payload)])
			.select()
			.single());
	}

	if (error && isDuplicateError(error)) {
		({ data, error } = await adminClient
			.from('locations')
			.update(payload)
			.eq('id', payload.id)
			.select()
			.single());
		if (error?.message?.includes('Unknown column')) {
			({ data, error } = await adminClient
				.from('locations')
				.update(toLegacyLocationPayload(payload))
				.eq('id', payload.id)
				.select()
				.single());
		}
		if (!error) return { data, mode: 'updated' as const };
	}

	if (error) throw new Error(error.message || 'Failed to create location');
	return { data, mode: 'inserted' as const };
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

// POST: Create new location (single + bulk)
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		await ensureMariaWikeloSeedData();
		await requireAdmin(supabase);

		const body = await request.json();
		const adminClient = createAdminClient() ?? supabase;

		const rawItems: unknown[] = Array.isArray(body)
			? body
			: body && typeof body === 'object' && Array.isArray((body as { items?: unknown[] }).items)
				? ((body as { items: unknown[] }).items ?? [])
				: [];
		const isBulkFlag = Boolean(
			body && typeof body === 'object' && (body as { bulk?: boolean }).bulk
		);

		if (rawItems.length > 0 || isBulkFlag) {
			if (rawItems.length === 0) {
				return json({ error: 'Bulk upload requires a non-empty items array' }, { status: 400 });
			}

			let inserted = 0;
			let updated = 0;
			const errors: Array<{ index: number; id?: string; error: string }> = [];

			for (let i = 0; i < rawItems.length; i++) {
				const raw = rawItems[i] as Record<string, unknown>;
				const payload = toLocationPayload(raw);
				payload.id = String(payload.id || '')
					.trim()
					.replace(/\s+/g, '_');
				payload.slug = String(payload.slug || '')
					.trim()
					.toLowerCase()
					.replace(/\s+/g, '-');

				if (!payload.id || !payload.slug || !payload.name_en || !payload.name_fr) {
					errors.push({ index: i, id: String(payload.id || ''), error: 'Missing required fields' });
					continue;
				}

				try {
					const res = await upsertLocation(adminClient, payload);
					if (res.mode === 'inserted') inserted++;
					else updated++;
				} catch (error) {
					errors.push({
						index: i,
						id: String(payload.id || ''),
						error: error instanceof Error ? error.message : 'Unknown error'
					});
				}
			}

			return json(
				{ success: errors.length === 0, inserted, updated, errors },
				{ status: errors.length ? 207 : 201 }
			);
		}

		if (!body || typeof body !== 'object') {
			return json({ error: 'Invalid payload' }, { status: 400 });
		}

		const locationData = toLocationPayload(body as Record<string, unknown>);
		locationData.id = String(locationData.id || '')
			.trim()
			.replace(/\s+/g, '_');
		locationData.slug = String(locationData.slug || '')
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-');

		if (!locationData.slug || !locationData.name_en || !locationData.name_fr) {
			return json({ error: 'Missing required fields: slug, name_en, name_fr' }, { status: 400 });
		}

		const { data } = await upsertLocation(adminClient, locationData);
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
