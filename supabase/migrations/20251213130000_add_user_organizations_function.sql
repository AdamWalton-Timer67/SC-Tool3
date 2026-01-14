-- Add function to get organizations where the user is a member
-- This includes the user's role in each organization

CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    image_url text,
    owner_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    member_count bigint,
    user_role text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return organizations where the current user is a member
    RETURN QUERY
    SELECT
        o.id,
        o.name,
        o.slug,
        o.description,
        o.image_url,
        o.owner_id,
        o.created_at,
        o.updated_at,
        (SELECT COUNT(*) FROM organization_members WHERE organization_id = o.id) as member_count,
        om.role::text as user_role
    FROM organizations o
    INNER JOIN organization_members om ON om.organization_id = o.id
    WHERE om.user_id = auth.uid()
    ORDER BY o.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_organizations() TO authenticated;
