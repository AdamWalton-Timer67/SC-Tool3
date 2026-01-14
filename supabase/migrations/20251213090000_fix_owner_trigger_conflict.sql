-- =====================================================
-- MIGRATION: FIX OWNER TRIGGER CONFLICT
-- =====================================================
-- Date: 2025-12-13
-- Description: Add ON CONFLICT DO NOTHING to prevent duplicate key errors
-- =====================================================

-- Update the trigger function to handle conflicts gracefully
CREATE OR REPLACE FUNCTION public.add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically add the owner as a member with 'owner' role
    -- Use ON CONFLICT DO NOTHING to prevent duplicate key errors
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
