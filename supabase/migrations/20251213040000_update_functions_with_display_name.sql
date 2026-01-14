-- =====================================================
-- MIGRATION: UPDATE FUNCTIONS TO USE DISPLAY_NAME
-- =====================================================
-- Date: 2025-12-13
-- Description: Replace email with display_name in RPC functions
-- =====================================================

-- Update members function to use display_name instead of email
DROP FUNCTION IF EXISTS public.get_org_members_with_user_info(uuid);

CREATE OR REPLACE FUNCTION public.get_org_members_with_user_info(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    user_id uuid,
    role text,
    joined_at timestamptz,
    user_display_name text,
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
        COALESCE(p.display_name, 'Inconnu') as user_display_name,
        COALESCE(COUNT(ui.id), 0) as ingredient_count
    FROM public.organization_members om
    LEFT JOIN public.profiles p ON om.user_id = p.id
    LEFT JOIN public.user_inventory ui ON om.user_id = ui.user_id
    WHERE om.organization_id = org_id
    GROUP BY om.id, om.organization_id, om.user_id, om.role, om.joined_at, p.display_name
    ORDER BY COALESCE(COUNT(ui.id), 0) DESC, om.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_members_with_user_info(uuid) TO anon;

-- Update join requests function to use display_name instead of email
DROP FUNCTION IF EXISTS public.get_org_join_requests_with_user_info(uuid);

CREATE OR REPLACE FUNCTION public.get_org_join_requests_with_user_info(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    user_id uuid,
    message text,
    status text,
    created_at timestamptz,
    reviewed_by uuid,
    reviewed_at timestamptz,
    user_display_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        jr.id,
        jr.organization_id,
        jr.user_id,
        jr.message,
        jr.status,
        jr.created_at,
        jr.reviewed_by,
        jr.reviewed_at,
        COALESCE(p.display_name, 'Inconnu') as user_display_name
    FROM public.organization_join_requests jr
    LEFT JOIN public.profiles p ON jr.user_id = p.id
    WHERE jr.organization_id = org_id
    AND jr.status = 'pending'
    ORDER BY jr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_org_join_requests_with_user_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_join_requests_with_user_info(uuid) TO anon;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
