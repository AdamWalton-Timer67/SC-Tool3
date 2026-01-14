-- =====================================================
-- MIGRATION: UPDATE PROFILE TRIGGER FOR DISPLAY_NAME
-- =====================================================
-- Date: 2025-12-13
-- Description: Update handle_new_user trigger to support display_name from email signup
-- =====================================================

-- Update the trigger function to include display_name from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',  -- From email signup
            NEW.raw_user_meta_data->>'full_name',     -- From OAuth (Google, etc.)
            NEW.raw_user_meta_data->>'name',          -- From OAuth (Discord, etc.)
            NEW.raw_user_meta_data->>'global_name',   -- From OAuth (Discord global name)
            NULL
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
