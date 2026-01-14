-- Add function to aggregate inventory for an organization
-- This function returns the total inventory of all members of an organization
-- Only ingredients with quantity > 0 are included

CREATE OR REPLACE FUNCTION get_org_aggregated_inventory(org_id uuid)
RETURNS TABLE (
    ingredient_id text,
    total_quantity integer
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

    -- Aggregate inventory from all members
    RETURN QUERY
    SELECT
        ui.ingredient_id::text,
        SUM(ui.quantity)::integer as total_quantity
    FROM user_inventory ui
    INNER JOIN organization_members om ON ui.user_id = om.user_id
    WHERE om.organization_id = org_id
      AND ui.quantity > 0  -- Only include ingredients with at least 1 unit
    GROUP BY ui.ingredient_id
    HAVING SUM(ui.quantity) > 0  -- Ensure total is also > 0
    ORDER BY total_quantity DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_org_aggregated_inventory(uuid) TO authenticated;
