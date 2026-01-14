import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOrganizationSchema } from '$lib/schemas/organization.schema';

/**
 * GET /api/organizations?search=<query>&limit=<num>
 * Get list of organizations with search
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = locals;

	const searchQuery = url.searchParams.get('search') || null;
	const limit = parseInt(url.searchParams.get('limit') || '50');

	try {
		const { data, error } = await supabase.rpc('search_organizations', {
			search_term: searchQuery,
			limit_count: Math.min(limit, 100) // Cap at 100
		});

		if (error) throw error;

		return json({ organizations: data || [] });
	} catch (err) {
		console.error('Error fetching organizations:', err);
		return json({ error: 'Failed to fetch organizations' }, { status: 500 });
	}
};

/**
 * POST /api/organizations
 * Create a new organization
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();

		// Validation avec Zod
		const validationResult = createOrganizationSchema.safeParse(body);

		if (!validationResult.success) {
			return json(
				{ error: validationResult.error.issues[0].message },
				{ status: 400 }
			);
		}

		const { name, description, image_url } = validationResult.data;

		// Generate unique slug
		const { data: slug, error: slugError } = await supabase.rpc('generate_org_slug', {
			org_name: name.trim()
		});

		if (slugError) {
			console.error('Error generating slug:', slugError);
			return json({ error: 'Failed to generate organization slug' }, { status: 500 });
		}

		// Create organization
		const { data: organization, error: createError } = await supabase
			.from('organizations')
			.insert({
				name: name.trim(),
				slug,
				description: description?.trim() || null,
				image_url: image_url || null,
				owner_id: user.id
			})
			.select()
			.single();

		if (createError) {
			console.error('Error creating organization:', createError);
			return json({ error: 'Failed to create organization' }, { status: 500 });
		}

		return json({ organization }, { status: 201 });
	} catch (err) {
		console.error('Error parsing request:', err);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
