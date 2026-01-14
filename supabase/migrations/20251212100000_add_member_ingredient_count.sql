-- =====================================================
-- MIGRATION: ADD FUNCTION TO GET MEMBERS WITH INGREDIENT COUNT
-- =====================================================
-- Date: 2025-12-12
-- Description: Create function to get organization members with their ingredient counts
-- =====================================================

-- Function to get members with ingredient count for an organization
CREATE OR REPLACE FUNCTION public.get_org_members_with_ingredients(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    user_id uuid,
    role text,
    joined_at timestamptz,
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
        COALESCE(COUNT(ui.id), 0) as ingredient_count
    FROM public.organization_members om
    LEFT JOIN public.user_inventory ui ON om.user_id = ui.user_id
    WHERE om.organization_id = org_id
    GROUP BY om.id, om.organization_id, om.user_id, om.role, om.joined_at
    ORDER BY om.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_org_members_with_ingredients(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_members_with_ingredients(uuid) TO anon;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
