import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST /api/organizations/[id]/join
 * Send a join request to an organization
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id: orgId } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if organization exists
		const { data: organization } = await supabase
			.from('organizations')
			.select('id')
			.eq('id', orgId)
			.single();

		if (!organization) {
			return json({ error: 'Organization not found' }, { status: 404 });
		}

		// Check if already a member
		const { data: existingMember } = await supabase
			.from('organization_members')
			.select('id')
			.eq('organization_id', orgId)
			.eq('user_id', user.id)
			.maybeSingle();

		if (existingMember) {
			return json({ error: 'You are already a member of this organization' }, { status: 400 });
		}

		// Check if already has a pending request
		const { data: existingRequest } = await supabase
			.from('organization_join_requests')
			.select('id, status')
			.eq('organization_id', orgId)
			.eq('user_id', user.id)
			.maybeSingle();

		if (existingRequest) {
			if (existingRequest.status === 'pending') {
				return json(
					{ error: 'You already have a pending request for this organization' },
					{ status: 400 }
				);
			} else if (existingRequest.status === 'rejected') {
				// Allow retry if previously rejected - delete old request
				await supabase
					.from('organization_join_requests')
					.delete()
					.eq('id', existingRequest.id);
			}
		}

		const body = await request.json();
		const { message } = body;

		// Validate message length
		if (message && message.length > 200) {
			return json({ error: 'Message must not exceed 200 characters' }, { status: 400 });
		}

		// Create join request
		const { data: joinRequest, error: createError } = await supabase
			.from('organization_join_requests')
			.insert({
				organization_id: orgId,
				user_id: user.id,
				message: message?.trim() || null,
				status: 'pending'
			})
			.select()
			.single();

		if (createError) {
			console.error('Error creating join request:', createError);
			return json({ error: 'Failed to create join request' }, { status: 500 });
		}

		return json({ request: joinRequest }, { status: 201 });
	} catch (err) {
		console.error('Error creating join request:', err);
		return json({ error: 'Failed to create join request' }, { status: 500 });
	}
};
