-- =====================================================
-- MIGRATION: JOIN REQUESTS WITH USER INFO
-- =====================================================
-- Date: 2025-12-13
-- Description: Function to get join requests with user info
-- =====================================================

-- Function to get join requests with user info
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
    user_email varchar(255),
    user_meta jsonb
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
        u.email as user_email,
        u.raw_user_meta_data as user_meta
    FROM public.organization_join_requests jr
    LEFT JOIN auth.users u ON jr.user_id = u.id
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
