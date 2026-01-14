-- =====================================================
-- MIGRATION: ADD IS_ORG_MEMBER FUNCTION
-- =====================================================
-- Date: 2025-12-13
-- Description: Add function to check if a user is a member of an organization
-- =====================================================

-- Function to check if user is a member of an organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO anon;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
