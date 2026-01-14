-- =====================================================
-- MIGRATION: FIX MEMBERS WITH USER INFO
-- =====================================================
-- Date: 2025-12-13
-- Description: Create function to properly join organization_members with auth.users
-- =====================================================

-- Function to get members with user info for an organization
CREATE OR REPLACE FUNCTION public.get_org_members_with_user_info(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    user_id uuid,
    role text,
    joined_at timestamptz,
    user_email text,
    user_meta jsonb,
    ingredient_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        om.id,
        om.organization_id,
        om.user_id,
        om.role,
        om.joined_at,
        u.email as user_email,
        u.raw_user_meta_data as user_meta,
        COALESCE(COUNT(ui.id), 0) as ingredient_count
    FROM public.organization_members om
    LEFT JOIN auth.users u ON om.user_id = u.id
    LEFT JOIN public.user_inventory ui ON om.user_id = ui.user_id
    WHERE om.organization_id = org_id
    GROUP BY om.id, om.organization_id, om.user_id, om.role, om.joined_at, u.email, u.raw_user_meta_data
    ORDER BY COALESCE(COUNT(ui.id), 0) DESC, om.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO anon;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
