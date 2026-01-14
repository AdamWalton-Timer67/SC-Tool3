/**
 * Organizations Store - Svelte 5 Runes State Management
 * Manages organizations, memberships, and join requests
 */

import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import type {
	Organization,
	OrganizationMemberWithUser,
	JoinRequest,
	JoinRequestWithUser,
	OrganizationInventoryItem,
	IngredientMemberBreakdown
} from '$lib/types/organizations';

class OrganizationsStore {
	// State
	organizations = $state<Organization[]>([]);
	currentOrganization = $state<Organization | null>(null);
	members = $state<OrganizationMemberWithUser[]>([]);
	joinRequests = $state<JoinRequestWithUser[]>([]);
	organizationInventory = $state<OrganizationInventoryItem[]>([]);
	userOrganizations = $state<Organization[]>([]); // Organizations where current user is a member

	// UI state
	searchQuery = $state<string>('');
	isLoading = $state<boolean>(false);
	error = $state<string | null>(null);

	// Current user
	currentUser = $state<{ id: string; email?: string } | null>(null);

	// Membership status (checked independently from members array)
	userIsMember = $state<boolean>(false);

	constructor() {
		if (browser) {
			this.initAuth();
		}
	}

	// Initialize auth
	async initAuth() {
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (user) {
				this.currentUser = { id: user.id, email: user.email };
			}

			supabase.auth.onAuthStateChange(async (event, session) => {
				if (event === 'SIGNED_IN' && session?.user) {
					this.currentUser = {
						id: session.user.id,
						email: session.user.email
					};
				} else if (event === 'SIGNED_OUT') {
					this.currentUser = null;
				}
			});
		} catch (err) {
			console.warn('Error initializing organizations auth - Supabase may be unavailable:', err);
			this.currentUser = null;
		}
	}

	// Search organizations
	async searchOrganizations(query: string = '', limit: number = 5) {
		this.isLoading = true;
		this.error = null;

		try {
			// Only search if there's a query term
			if (!query || !query.trim()) {
				// No search query - just use user organizations
				this.organizations = this.userOrganizations;
				this.isLoading = false;
				return;
			}

			// Search public organizations (limited to 5 results)
			const { data, error } = await supabase.rpc('search_organizations', {
				search_term: query,
				limit_count: limit
			});

			if (error) throw error;

			this.organizations = data || [];

			// Mark organizations where user is a member
			if (this.currentUser && this.userOrganizations.length > 0) {
				this.organizations = this.organizations.map(org => {
					const userOrg = this.userOrganizations.find(uo => uo.id === org.id);
					return {
						...org,
						is_member: !!userOrg,
						user_role: userOrg?.user_role
					};
				});
			}
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Search failed';
			console.error('Search error:', err);
		} finally {
			this.isLoading = false;
		}
	}

	// Load user's organizations (where they are a member)
	async loadUserOrganizations() {
		if (!this.currentUser) {
			this.userOrganizations = [];
			return;
		}

		try {
			const { data, error } = await supabase.rpc('get_user_organizations');

			if (error) throw error;

			this.userOrganizations = data || [];
		} catch (err) {
			console.error('❌ Error loading user organizations:', err);
			this.userOrganizations = [];
		}
	}

	// Get organization by slug
	async loadOrganization(slug: string) {
		this.isLoading = true;
		this.error = null;

		try {
			// Load organization with member count
			const { data: orgData, error: orgError } = await supabase
				.from('organizations')
				.select('*')
				.eq('slug', slug)
				.single();

			if (orgError) throw orgError;

			// Get member count
			const { data: memberCountData } = await supabase
				.rpc('get_org_member_count', { org_id: orgData.id });

			this.currentOrganization = {
				...orgData,
				member_count: memberCountData || 0
			};

			// Check if current user is a member (independent check)
			if (this.currentUser) {
				const { data: isMemberData } = await supabase
					.rpc('is_org_member', { org_id: orgData.id });
				this.userIsMember = isMemberData || false;
			} else {
				this.userIsMember = false;
			}

			// Load members (will only return data if user is a member)
			await this.loadMembers(orgData.id);

			// If user is a member, load organization inventory
			if (this.userIsMember) {
				await this.loadOrganizationInventory(orgData.id);
			}

			// If user is owner/admin, load join requests
			const userMember = this.members.find((m) => m.user_id === this.currentUser?.id);
			if (userMember && ['owner', 'admin'].includes(userMember.role)) {
				await this.loadJoinRequests(orgData.id);
			}
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Failed to load organization';
			console.error('Load organization error:', err);
		} finally {
			this.isLoading = false;
		}
	}

	// Load members with user info and ingredient counts
	async loadMembers(orgId: string) {

		// Use RPC function that does the join with auth.users and counts ingredients
		const { data, error } = await supabase.rpc('get_org_members_with_user_info', {
			org_id: orgId
		});

		if (error) {
			console.error('❌ Error loading members:', error);
			this.members = [];
			return;
		}


		if (!data || data.length === 0) {
			this.members = [];
			return;
		}

		// Transform RPC result to match OrganizationMemberWithUser type
		this.members = data.map((member: any) => ({
			id: member.id,
			organization_id: member.organization_id,
			user_id: member.user_id,
			role: member.role,
			joined_at: member.joined_at,
			display_name: member.user_display_name,
			unique_ingredients_count: Number(member.unique_ingredients_count) || 0,
			total_ingredients_count: Number(member.total_ingredients_count) || 0
		})) as OrganizationMemberWithUser[];

	}

	// Load join requests with user info
	async loadJoinRequests(orgId: string) {
		// Use RPC function that does the join with auth.users
		const { data, error } = await supabase.rpc('get_org_join_requests_with_user_info', {
			org_id: orgId
		});

		if (error) {
			console.error('Error loading join requests:', error);
			this.joinRequests = [];
			return;
		}

		if (!data || data.length === 0) {
			this.joinRequests = [];
			return;
		}

		// Transform RPC result to match JoinRequestWithUser type
		this.joinRequests = data.map((request: any) => ({
			id: request.id,
			organization_id: request.organization_id,
			user_id: request.user_id,
			message: request.message,
			status: request.status,
			created_at: request.created_at,
			reviewed_by: request.reviewed_by,
			reviewed_at: request.reviewed_at,
			updated_at: request.created_at,
			display_name: request.user_display_name
		})) as JoinRequestWithUser[];
	}

	// Load organization aggregated inventory
	async loadOrganizationInventory(orgId: string) {

		const { data, error } = await supabase.rpc('get_org_aggregated_inventory', {
			org_id: orgId
		});

		if (error) {
			console.error('❌ Error loading organization inventory:', error);
			this.organizationInventory = [];
			return;
		}


		if (!data || data.length === 0) {
			this.organizationInventory = [];
			return;
		}

		this.organizationInventory = data.map(
			(item: { ingredient_id: string; total_quantity: number }) => ({
				ingredient_id: item.ingredient_id,
				total_quantity: Number(item.total_quantity) || 0
			})
		) as OrganizationInventoryItem[];

	}

	// Load ingredient breakdown by member
	async loadIngredientBreakdown(
		orgId: string,
		ingredientId: string
	): Promise<IngredientMemberBreakdown[]> {

		const { data, error } = await supabase.rpc('get_org_ingredient_breakdown', {
			org_id: orgId,
			p_ingredient_id: ingredientId
		});

		if (error) {
			console.error('❌ Error loading ingredient breakdown:', error);
			return [];
		}


		if (!data || data.length === 0) {
			return [];
		}

		return data.map(
			(item: { member_id: string; display_name: string; quantity: number }) => ({
				member_id: item.member_id,
				display_name: item.display_name,
				quantity: Number(item.quantity) || 0
			})
		) as IngredientMemberBreakdown[];
	}

	// Create organization
	async createOrganization(name: string, description?: string, imageUrl?: string) {
		if (!this.currentUser) {
			throw new Error('Must be logged in to create organization');
		}

		// Step 1: Generate slug
		const { data: slug, error: slugError } = await supabase.rpc('generate_org_slug', {
			org_name: name
		});

		if (slugError) throw slugError;

		// Step 2: Create organization
		const { data: organization, error: orgError } = await supabase
			.from('organizations')
			.insert({
				name,
				slug,
				description: description || null,
				image_url: imageUrl || null,
				owner_id: this.currentUser.id
			})
			.select()
			.single();

		if (orgError) throw orgError;

		// Step 3: Owner is automatically added as member by the database trigger
		// (auto_add_owner_as_member trigger in organizations table)
		// No need to manually insert the member here

		return organization;
	}

	// Send join request
	async sendJoinRequest(orgId: string, message?: string) {
		if (!this.currentUser) {
			throw new Error('Must be logged in to join organization');
		}

		// Check if already a member
		const { data: existingMember } = await supabase
			.from('organization_members')
			.select('id')
			.eq('organization_id', orgId)
			.eq('user_id', this.currentUser.id)
			.maybeSingle();

		if (existingMember) {
			throw new Error('You are already a member of this organization');
		}

		// Check if already has a pending request
		const { data: existingRequest } = await supabase
			.from('organization_join_requests')
			.select('id')
			.eq('organization_id', orgId)
			.eq('user_id', this.currentUser.id)
			.eq('status', 'pending')
			.maybeSingle();

		if (existingRequest) {
			throw new Error('You already have a pending request for this organization');
		}

		const { data, error } = await supabase
			.from('organization_join_requests')
			.insert({
				organization_id: orgId,
				user_id: this.currentUser.id,
				message: message || null,
				status: 'pending'
			})
			.select()
			.single();

		if (error) throw error;

		return data;
	}

	// Approve join request
	async approveJoinRequest(requestId: string) {
		const { data, error } = await supabase
			.from('organization_join_requests')
			.update({
				status: 'approved',
				reviewed_by: this.currentUser?.id,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', requestId)
			.select()
			.single();

		if (error) throw error;

		// Reload join requests and members
		if (this.currentOrganization) {
			await this.loadJoinRequests(this.currentOrganization.id);
			await this.loadMembers(this.currentOrganization.id);
		}

		return data;
	}

	// Reject join request
	async rejectJoinRequest(requestId: string) {
		const { data, error } = await supabase
			.from('organization_join_requests')
			.update({
				status: 'rejected',
				reviewed_by: this.currentUser?.id,
				reviewed_at: new Date().toISOString()
			})
			.eq('id', requestId)
			.select()
			.single();

		if (error) throw error;

		// Remove from local state
		this.joinRequests = this.joinRequests.filter((r) => r.id !== requestId);

		return data;
	}

	// Promote member to admin
	async promoteMember(memberId: string) {
		const { data, error } = await supabase
			.from('organization_members')
			.update({ role: 'admin' })
			.eq('id', memberId)
			.select()
			.single();

		if (error) throw error;

		// Update local state
		const idx = this.members.findIndex((m) => m.id === memberId);
		if (idx !== -1) {
			this.members[idx] = { ...this.members[idx], role: 'admin' };
			this.members = [...this.members]; // Trigger reactivity
		}

		return data;
	}

	// Demote admin to member
	async demoteMember(memberId: string) {
		const { data, error } = await supabase
			.from('organization_members')
			.update({ role: 'member' })
			.eq('id', memberId)
			.select()
			.single();

		if (error) throw error;

		// Update local state
		const idx = this.members.findIndex((m) => m.id === memberId);
		if (idx !== -1) {
			this.members[idx] = { ...this.members[idx], role: 'member' };
			this.members = [...this.members];
		}

		return data;
	}

	// Remove member
	async removeMember(memberId: string) {
		const { error } = await supabase.from('organization_members').delete().eq('id', memberId);

		if (error) throw error;

		// Remove from local state
		this.members = this.members.filter((m) => m.id !== memberId);
	}

	// Leave organization
	async leaveOrganization(orgId: string) {
		if (!this.currentUser) throw new Error('Not authenticated');

		const { error } = await supabase
			.from('organization_members')
			.delete()
			.eq('organization_id', orgId)
			.eq('user_id', this.currentUser.id);

		if (error) throw error;

		// Update membership status
		this.userIsMember = false;
		this.members = [];
	}

	// Update organization
	async updateOrganization(orgId: string, updates: Partial<Organization>) {
		const { data, error } = await supabase
			.from('organizations')
			.update(updates)
			.eq('id', orgId)
			.select()
			.single();

		if (error) throw error;

		this.currentOrganization = data;
		return data;
	}

	// Delete organization
	async deleteOrganization(orgId: string) {
		const { error } = await supabase.from('organizations').delete().eq('id', orgId);

		if (error) throw error;
	}

	// Cancel join request
	async cancelJoinRequest(orgId: string) {
		if (!this.currentUser) throw new Error('Not authenticated');

		const { error } = await supabase
			.from('organization_join_requests')
			.delete()
			.eq('organization_id', orgId)
			.eq('user_id', this.currentUser.id)
			.eq('status', 'pending');

		if (error) throw error;
	}

	// Check if user has pending request
	async checkPendingRequest(orgId: string): Promise<JoinRequest | null> {
		if (!this.currentUser) return null;

		const { data } = await supabase
			.from('organization_join_requests')
			.select('*')
			.eq('organization_id', orgId)
			.eq('user_id', this.currentUser.id)
			.eq('status', 'pending')
			.maybeSingle();

		return data;
	}

	// Computed: filtered organizations
	get filteredOrganizations() {
		// No client-side filtering - return organizations as-is from server
		// If no search: returns userOrganizations (set in searchOrganizations)
		// With search: returns public orgs from RPC search_organizations
		return this.organizations;
	}

	// Computed: current user's role in current org
	get currentUserRole(): 'owner' | 'admin' | 'member' | null {
		if (!this.currentUser || !this.currentOrganization) return null;

		const member = this.members.find((m) => m.user_id === this.currentUser!.id);
		return member?.role || null;
	}

	// Computed: is current user a manager (owner or admin)
	get isManager(): boolean {
		const role = this.currentUserRole;
		return role === 'owner' || role === 'admin';
	}

	// Computed: is current user the owner
	get isOwner(): boolean {
		return this.currentUserRole === 'owner';
	}

	// Computed: is current user a member
	get isMember(): boolean {
		return this.userIsMember;
	}
}

export const organizationsStore = new OrganizationsStore();
