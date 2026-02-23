/**
 * Admin Rewards API - Create (single + bulk)
 */

import { json } from '@sveltejs/kit';
import { requireAdmin, createAdminClient } from '$lib/server/admin';
import type { RequestHandler } from './$types';

function normalizeCategory(category: string): string {
	const normalizations: Record<string, string> = {
		ship: 'ships',
		weapon: 'weapons',
		utility: 'utilities'
	};
	return normalizations[category] || category;
}

function toRewardPayload(body: Record<string, unknown>) {
	const category = String(body.category || '')
		.trim()
		.toLowerCase();
	return {
		id: body.id,
		name_en: body.name_en,
		name_fr: body.name_fr,
		category: normalizeCategory(category),
		rarity: body.rarity,
		type_en: body.type_en ?? null,
		type_fr: body.type_fr ?? null,
		description_en: body.description_en ?? null,
		description_fr: body.description_fr ?? null,
		location_en: body.location_en ?? null,
		location_fr: body.location_fr ?? null,
		stats: body.stats ?? null,
		image_url: body.image_url ?? null,
		has_loadout: body.has_loadout ?? false,
		components: body.components ?? null
	};
}

function isDuplicateError(error: any): boolean {
	const msg = String(error?.message || '').toLowerCase();
	return msg.includes('duplicate') || msg.includes('unique') || msg.includes('uniq_');
}

async function upsertReward(adminClient: any, payload: Record<string, any>) {
	let { data, error } = await adminClient.from('rewards').insert([payload]).select().single();

	if (error && isDuplicateError(error)) {
		({ data, error } = await adminClient
			.from('rewards')
			.update(payload)
			.eq('id', payload.id)
			.select()
			.single());
		if (!error) return { data, mode: 'updated' as const };
	}

	if (error) throw new Error(error.message || 'Failed to create reward');
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
				const payload = toRewardPayload(raw);
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
					const res = await upsertReward(adminClient, payload);
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

		const payload = toRewardPayload(body as Record<string, unknown>);
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

		const { data } = await upsertReward(adminClient, payload);
		return json({ success: true, data }, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return json(
			{ error: 'Unauthorized or server error' },
			{ status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
		);
	}
};
