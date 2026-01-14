import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/organizations/[id]/members
 * Get all members of an organization
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase } = locals;
	const { id: orgId } = params;

	try {
		// Get members with user info
		const { data: members, error: fetchError } = await supabase
			.from('organization_members')
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
			.order('joined_at', { ascending: false });

		if (fetchError) {
			console.error('Error fetching members:', fetchError);
			return json({ error: 'Failed to fetch members' }, { status: 500 });
		}

		return json({ members: members || [] });
	} catch (err) {
		console.error('Error fetching members:', err);
		return json({ error: 'Failed to fetch members' }, { status: 500 });
	}
};

/**
 * PATCH /api/organizations/[id]/members
 * Manage members: promote, demote, or remove (owner/admin only)
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
				{ error: 'Forbidden: Only owner and admins can manage members' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { member_id, action } = body;

		if (!member_id || !action) {
			return json({ error: 'Missing member_id or action' }, { status: 400 });
		}

		if (!['promote', 'demote', 'remove'].includes(action)) {
			return json(
				{ error: 'Invalid action. Must be "promote", "demote", or "remove"' },
				{ status: 400 }
			);
		}

		// Get target member info
		const { data: targetMember } = await supabase
			.from('organization_members')
			.select('*')
			.eq('id', member_id)
			.single();

		if (!targetMember) {
			return json({ error: 'Member not found' }, { status: 404 });
		}

		if (targetMember.organization_id !== orgId) {
			return json({ error: 'Member does not belong to this organization' }, { status: 400 });
		}

		// Prevent modifying the owner
		if (targetMember.role === 'owner') {
			return json({ error: 'Cannot modify the owner' }, { status: 403 });
		}

		// Handle different actions
		if (action === 'promote') {
			if (targetMember.role === 'admin') {
				return json({ error: 'Member is already an admin' }, { status: 400 });
			}

			const { data: updated, error: updateError } = await supabase
				.from('organization_members')
				.update({ role: 'admin' })
				.eq('id', member_id)
				.select()
				.single();

			if (updateError) {
				console.error('Error promoting member:', updateError);
				return json({ error: 'Failed to promote member' }, { status: 500 });
			}

			return json({ member: updated });
		} else if (action === 'demote') {
			if (targetMember.role === 'member') {
				return json({ error: 'Member is already a regular member' }, { status: 400 });
			}

			const { data: updated, error: updateError } = await supabase
				.from('organization_members')
				.update({ role: 'member' })
				.eq('id', member_id)
				.select()
				.single();

			if (updateError) {
				console.error('Error demoting member:', updateError);
				return json({ error: 'Failed to demote member' }, { status: 500 });
			}

			return json({ member: updated });
		} else if (action === 'remove') {
			const { error: deleteError } = await supabase
				.from('organization_members')
				.delete()
				.eq('id', member_id);

			if (deleteError) {
				console.error('Error removing member:', deleteError);
				return json({ error: 'Failed to remove member' }, { status: 500 });
			}

			return json({ success: true });
		}

		return json({ error: 'Invalid action' }, { status: 400 });
	} catch (err) {
		console.error('Error managing member:', err);
		return json({ error: 'Failed to manage member' }, { status: 500 });
	}
};

/**
 * DELETE /api/organizations/[id]/members
 * Leave organization (member only, not owner)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { supabase, safeGetSession } = locals;
	const { user } = await safeGetSession();
	const { id: orgId } = params;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Get user's membership
		const { data: membership } = await supabase
			.from('organization_members')
			.select('*')
			.eq('organization_id', orgId)
			.eq('user_id', user.id)
			.single();

		if (!membership) {
			return json({ error: 'You are not a member of this organization' }, { status: 400 });
		}

		// Prevent owner from leaving
		if (membership.role === 'owner') {
			return json(
				{
					error:
						'Owner cannot leave the organization. Please transfer ownership or delete the organization.'
				},
				{ status: 403 }
			);
		}

		// Delete membership
		const { error: deleteError } = await supabase
			.from('organization_members')
			.delete()
			.eq('id', membership.id);

		if (deleteError) {
			console.error('Error leaving organization:', deleteError);
			return json({ error: 'Failed to leave organization' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Error leaving organization:', err);
		return json({ error: 'Failed to leave organization' }, { status: 500 });
	}
};
