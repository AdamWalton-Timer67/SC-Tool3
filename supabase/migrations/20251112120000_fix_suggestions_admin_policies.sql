-- Fix admin policies for suggestions table
-- Use user_roles table instead of raw_user_meta_data

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can delete any suggestion" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can update any suggestion" ON public.suggestions;

-- Recreate policies using user_roles table
CREATE POLICY "Admins can view all suggestions"
    ON public.suggestions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete any suggestion"
    ON public.suggestions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update any suggestion"
    ON public.suggestions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );
