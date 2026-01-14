/**
 * Organization Types
 * Type definitions for the organizations feature
 */

export type OrganizationRole = 'owner' | 'admin' | 'member';
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface Organization {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	image_url: string | null;
	owner_id: string;
	created_at: string;
	updated_at: string;
	member_count?: number;
	user_role?: OrganizationRole; // Role of the current user in this organization (if member)
	is_member?: boolean; // Flag to indicate if current user is a member
}

export interface OrganizationMember {
	id: string;
	organization_id: string;
	user_id: string;
	role: OrganizationRole;
	joined_at: string;
}

export interface JoinRequest {
	id: string;
	organization_id: string;
	user_id: string;
	status: JoinRequestStatus;
	message: string | null;
	created_at: string;
	updated_at: string;
	reviewed_by: string | null;
	reviewed_at: string | null;
}

// Extended types with user information (for UI display)
export interface OrganizationMemberWithUser extends OrganizationMember {
	display_name?: string;
	unique_ingredients_count?: number;
	total_ingredients_count?: number;
}

export interface JoinRequestWithUser extends JoinRequest {
	display_name?: string;
}

export interface UserProfile {
	id: string;
	display_name: string | null;
	created_at: string;
	updated_at: string;
}

// Organization Inventory Aggregation
export interface OrganizationInventoryItem {
	ingredient_id: string;
	total_quantity: number;
}

// Organization Ingredient Breakdown by Member
export interface IngredientMemberBreakdown {
	member_id: string;
	display_name: string;
	quantity: number;
}
