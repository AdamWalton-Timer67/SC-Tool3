-- Fix infinite recursion in user_roles policies
-- The problem: is_admin() function checks user_roles table, creating infinite loop

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate policies without recursion
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow service role to manage all roles (for admin operations via service key)
-- Regular users cannot insert/update/delete roles
CREATE POLICY "Service role can manage all roles"
    ON public.user_roles
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
