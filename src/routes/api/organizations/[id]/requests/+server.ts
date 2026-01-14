import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/organizations/[id]/requests
 * Get all join requests for an organization (owner/admin only)
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id: orgId } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user is owner or admin
		const { data: isManager } = await supabase.rpc('is_org_manager', {
			org_id: orgId,
			user_uuid: user.id
		});

		if (!isManager) {
			return json(
				{ error: 'Forbidden: Only owner and admins can view join requests' },
				{ status: 403 }
			);
		}

		// Get join requests with user info
		const { data: requests, error: fetchError } = await supabase
			.from('organization_join_requests')
			.select(
				`
				*,
				user:user_id (
					id,
					email,
					raw_user_meta_data
				)
			`
			)
			.eq('organization_id', orgId)
			.order('created_at', { ascending: false });

		if (fetchError) {
			console.error('Error fetching join requests:', fetchError);
			return json({ error: 'Failed to fetch join requests' }, { status: 500 });
		}

		return json({ requests: requests || [] });
	} catch (err) {
		console.error('Error fetching join requests:', err);
		return json({ error: 'Failed to fetch join requests' }, { status: 500 });
	}
};

/**
 * PATCH /api/organizations/[id]/requests
 * Approve or reject a join request (owner/admin only)
 */
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id: orgId } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user is owner or admin
		const { data: isManager } = await supabase.rpc('is_org_manager', {
			org_id: orgId,
			user_uuid: user.id
		});

		if (!isManager) {
			return json(
				{ error: 'Forbidden: Only owner and admins can manage join requests' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { request_id, action } = body;

		if (!request_id || !action) {
			return json({ error: 'Missing request_id or action' }, { status: 400 });
		}

		if (!['approve', 'reject'].includes(action)) {
			return json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
		}

		// Verify request exists and belongs to this organization
		const { data: existingRequest } = await supabase
			.from('organization_join_requests')
			.select('organization_id, status')
			.eq('id', request_id)
			.single();

		if (!existingRequest) {
			return json({ error: 'Join request not found' }, { status: 404 });
		}

		if (existingRequest.organization_id !== orgId) {
			return json({ error: 'Request does not belong to this organization' }, { status: 400 });
		}

		if (existingRequest.status !== 'pending') {
			return json({ error: 'Request has already been processed' }, { status: 400 });
		}

		// Update request status
		const newStatus = action === 'approve' ? 'approved' : 'rejected';
		const { data: updatedRequest, error: updateError } = await supabase
			.from('organization_join_requests')
			.update({
				status: newStatus,
				reviewed_by: user.id,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', request_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating join request:', updateError);
			return json({ error: 'Failed to update join request' }, { status: 500 });
		}

		// If approved, get the newly created member
		let member = null;
		if (action === 'approve') {
			const { data } = await supabase
				.from('organization_members')
				.select('*')
				.eq('organization_id', orgId)
				.eq('user_id', updatedRequest.user_id)
				.single();
			member = data;
		}

		return json({
			request: updatedRequest,
			member
		});
	} catch (err) {
		console.error('Error processing join request:', err);
		return json({ error: 'Failed to process join request' }, { status: 500 });
	}
};
