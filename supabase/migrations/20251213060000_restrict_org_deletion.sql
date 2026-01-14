-- =====================================================
-- MIGRATION: RESTRICT ORGANIZATION DELETION
-- =====================================================
-- Date: 2025-12-13
-- Description: Only allow deletion if owner and no other members
-- =====================================================

-- Drop existing delete policy
DROP POLICY IF EXISTS "Owners can delete their organizations" ON public.organizations;

-- Create new delete policy with member count check
CREATE POLICY "Owners can delete their organizations if alone"
    ON public.organizations
    FOR DELETE
    TO public
    USING (
        auth.uid() = owner_id
        AND (
            SELECT COUNT(*)
            FROM public.organization_members
            WHERE organization_id = organizations.id
        ) <= 1
    );

-- =====================================================
-- END OF MIGRATION
-- =====================================================
