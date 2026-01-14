-- =====================================================
-- MIGRATION: FIX AMBIGUOUS COLUMN REFERENCE
-- =====================================================
-- Date: 2025-12-13
-- Description: Fix ambiguous column reference in get_org_members_with_user_info
-- =====================================================

-- Update function to properly qualify column names
CREATE OR REPLACE FUNCTION public.get_org_members_with_user_info(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    user_id uuid,
    role text,
    joined_at timestamptz,
    user_display_name text,
    unique_ingredients_count bigint,
    total_ingredients_count bigint
) AS $$
BEGIN
    -- Check if the current user is a member of this organization
    IF NOT EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = org_id
        AND om.user_id = auth.uid()
    ) THEN
        -- If not a member, return empty result
        RETURN;
    END IF;

    -- If member, return full member list
    RETURN QUERY
    SELECT
        om.id,
        om.organization_id,
        om.user_id,
        om.role,
        om.joined_at,
        COALESCE(p.display_name, 'Inconnu') as user_display_name,
        COUNT(DISTINCT ui.ingredient_id) as unique_ingredients_count,
        COALESCE(SUM(ui.quantity), 0) as total_ingredients_count
    FROM public.organization_members om
    LEFT JOIN public.profiles p ON om.user_id = p.id
    LEFT JOIN public.user_inventory ui ON om.user_id = ui.user_id
    WHERE om.organization_id = org_id
    GROUP BY om.id, om.organization_id, om.user_id, om.role, om.joined_at, p.display_name
    ORDER BY COALESCE(SUM(ui.quantity), 0) DESC, COUNT(DISTINCT ui.ingredient_id) DESC, om.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO anon;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
