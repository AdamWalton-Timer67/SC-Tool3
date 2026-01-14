-- Add function to get ingredient breakdown by member for an organization
-- Shows which members have which quantity of a specific ingredient

CREATE OR REPLACE FUNCTION get_org_ingredient_breakdown(org_id uuid, p_ingredient_id text)
RETURNS TABLE (
    member_id uuid,
    display_name text,
    quantity integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the requesting user is a member of the organization
    IF NOT EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
    ) THEN
        -- Return empty result if user is not a member
        RETURN;
    END IF;

    -- Get ingredient quantities for each member, with user display names
    RETURN QUERY
    SELECT
        om.user_id as member_id,
        COALESCE(p.display_name, 'Unknown') as display_name,
        ui.quantity::integer
    FROM organization_members om
    INNER JOIN user_inventory ui ON ui.user_id = om.user_id
    LEFT JOIN profiles p ON p.id = om.user_id
    WHERE om.organization_id = org_id
      AND ui.ingredient_id = p_ingredient_id
      AND ui.quantity > 0
    ORDER BY ui.quantity DESC, display_name ASC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_org_ingredient_breakdown(uuid, text) TO authenticated;
