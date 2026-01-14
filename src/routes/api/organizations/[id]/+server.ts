import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateOrganizationSchema } from '$lib/schemas/organization.schema';

/**
 * GET /api/organizations/[id]
 * Get organization details
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase } = locals;
	const { id } = params;

	try {
		// Get organization
		const { data: organization, error: orgError } = await supabase
			.from('organizations')
			.select('*')
			.eq('id', id)
			.single();

		if (orgError) {
			if (orgError.code === 'PGRST116') {
				return json({ error: 'Organization not found' }, { status: 404 });
			}
			throw orgError;
		}

		// Get member count
		const { data: memberCount } = await supabase.rpc('get_org_member_count', {
			org_id: id
		});

		return json({
			organization: {
				...organization,
				member_count: memberCount || 0
			}
		});
	} catch (err) {
		console.error('Error fetching organization:', err);
		return json({ error: 'Failed to fetch organization' }, { status: 500 });
	}
};

/**
 * PATCH /api/organizations/[id]
 * Update organization (owner only)
 */
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user is owner
		const { data: organization } = await supabase
			.from('organizations')
			.select('owner_id')
			.eq('id', id)
			.single();

		if (!organization) {
			return json({ error: 'Organization not found' }, { status: 404 });
		}

		if (organization.owner_id !== user.id) {
			return json({ error: 'Forbidden: Only owner can update organization' }, { status: 403 });
		}

		const body = await request.json();

		// Validation avec Zod
		const validationResult = updateOrganizationSchema.safeParse(body);

		if (!validationResult.success) {
			return json(
				{ error: validationResult.error.issues[0].message },
				{ status: 400 }
			);
		}

		const { name, description, image_url } = validationResult.data;

		// Build update object
		const updates: Record<string, unknown> = {};

		if (name !== undefined) {
			updates.name = name;

			// Regenerate slug if name changed
			const { data: newSlug } = await supabase.rpc('generate_org_slug', {
				org_name: name
			});
			if (newSlug) {
				updates.slug = newSlug;
			}
		}

		if (description !== undefined) {
			updates.description = description;
		}

		if (image_url !== undefined) {
			updates.image_url = image_url;
		}

		// Update organization
		const { data: updated, error: updateError } = await supabase
			.from('organizations')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating organization:', updateError);
			return json({ error: 'Failed to update organization' }, { status: 500 });
		}

		return json({ organization: updated });
	} catch (err) {
		console.error('Error parsing request:', err);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};

/**
 * DELETE /api/organizations/[id]
 * Delete organization (owner only)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user is owner
		const { data: organization } = await supabase
			.from('organizations')
			.select('owner_id')
			.eq('id', id)
			.single();

		if (!organization) {
			return json({ error: 'Organization not found' }, { status: 404 });
		}

		if (organization.owner_id !== user.id) {
			return json({ error: 'Forbidden: Only owner can delete organization' }, { status: 403 });
		}

		// Delete organization (cascades to members and join requests)
		const { error: deleteError } = await supabase.from('organizations').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting organization:', deleteError);
			return json({ error: 'Failed to delete organization' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Error deleting organization:', err);
		return json({ error: 'Failed to delete organization' }, { status: 500 });
	}
};
