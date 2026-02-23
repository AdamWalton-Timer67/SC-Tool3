/**
 * Admin Ingredients API - Create (single + bulk)
 *
 * POST /api/admin/ingredients
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

function toIngredientPayload(body: Record<string, unknown>) {
	return {
		id: body.id,
		name_en: body.name_en,
		name_fr: body.name_fr,
		category: body.category,
		rarity: body.rarity,
		image_url: body.image_url ?? null,
		image_credit: body.image_credit ?? null,
		description_en: body.description_en ?? null,
		description_fr: body.description_fr ?? null,
		how_to_obtain_en: body.how_to_obtain_en ?? null,
		how_to_obtain_fr: body.how_to_obtain_fr ?? null,
		locations_en: body.locations_en ?? null,
		locations_fr: body.locations_fr ?? null,
		location_id: body.location_id ?? null
	};
}

function isDuplicateError(error: any): boolean {
	const msg = String(error?.message || '').toLowerCase();
	return msg.includes('duplicate') || msg.includes('unique') || msg.includes('uniq_');
}

async function upsertIngredient(adminClient: any, payload: Record<string, any>) {
	let { data, error } = await adminClient.from('ingredients').insert([payload]).select().single();

	if (error && isDuplicateError(error)) {
		({ data, error } = await adminClient
			.from('ingredients')
			.update(payload)
			.eq('id', payload.id)
			.select()
			.single());
		if (!error) return { data, mode: 'updated' as const };
	}

	if (error) throw new Error(error.message || 'Failed to create ingredient');
	return { data, mode: 'inserted' as const };
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		await requireAdmin(supabase);

		const body = await request.json();
		const adminClient = createAdminClient() ?? supabase;

		const rawItems: unknown[] = Array.isArray(body)
			? body
			: Array.isArray(body?.items)
				? body.items
				: [];

		if (rawItems.length > 0 || body?.bulk === true) {
			if (rawItems.length === 0) {
				return json({ error: 'Bulk upload requires a non-empty items array' }, { status: 400 });
			}

			let inserted = 0;
			let updated = 0;
			const errors: Array<{ index: number; id?: string; error: string }> = [];

			for (let i = 0; i < rawItems.length; i++) {
				const raw = rawItems[i] as Record<string, unknown>;
				const payload = toIngredientPayload(raw);
				payload.id = String(payload.id || '')
					.trim()
					.replace(/\s+/g, '_');

				if (
					!payload.id ||
					!payload.name_en ||
					!payload.name_fr ||
					!payload.category ||
					!payload.rarity
				) {
					errors.push({ index: i, id: String(payload.id || ''), error: 'Missing required fields' });
					continue;
				}

				try {
					const res = await upsertIngredient(adminClient, payload);
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

		const payload = toIngredientPayload(body);
		payload.id = String(payload.id || '')
			.trim()
			.replace(/\s+/g, '_');

		if (
			!payload.id ||
			!payload.name_en ||
			!payload.name_fr ||
			!payload.category ||
			!payload.rarity
		) {
			return json(
				{ error: 'Missing required fields: id, name_en, name_fr, category, rarity' },
				{ status: 400 }
			);
		}

		const { data } = await upsertIngredient(adminClient, payload);
		return json({ success: true, data }, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{ status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
		);
	}
};
