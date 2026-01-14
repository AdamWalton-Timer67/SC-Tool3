-- =====================================================
-- MIGRATION: ORGANIZATIONS FEATURE
-- =====================================================
-- Date: 2025-12-12
-- Description: Create tables for organizations, members, and join requests
-- =====================================================

-- =====================================================
-- 1. ORGANIZATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    image_url text,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    -- Constraints
    CONSTRAINT organizations_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    CONSTRAINT organizations_description_length CHECK (description IS NULL OR char_length(description) <= 500)
);

-- =====================================================
-- 2. ORGANIZATION MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.organization_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at timestamptz DEFAULT now(),

    -- Constraints
    UNIQUE(organization_id, user_id)
);

-- =====================================================
-- 3. ORGANIZATION JOIN REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.organization_join_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    message text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at timestamptz,

    -- Constraints
    UNIQUE(organization_id, user_id),
    CONSTRAINT join_request_message_length CHECK (message IS NULL OR char_length(message) <= 200)
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS organizations_owner_id_idx ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS organizations_slug_idx ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS organizations_created_at_idx ON public.organizations(created_at DESC);
CREATE INDEX IF NOT EXISTS organizations_name_search_idx ON public.organizations USING gin (to_tsvector('english', name));

-- Members indexes
CREATE INDEX IF NOT EXISTS organization_members_org_id_idx ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS organization_members_user_id_idx ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS organization_members_role_idx ON public.organization_members(role);

-- Join requests indexes
CREATE INDEX IF NOT EXISTS org_join_requests_org_id_idx ON public.organization_join_requests(organization_id);
CREATE INDEX IF NOT EXISTS org_join_requests_user_id_idx ON public.organization_join_requests(user_id);
CREATE INDEX IF NOT EXISTS org_join_requests_status_idx ON public.organization_join_requests(status);

-- =====================================================
-- 5. TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_org_join_requests_updated_at
    BEFORE UPDATE ON public.organization_join_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_join_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. RLS POLICIES - ORGANIZATIONS
-- =====================================================

-- Anyone can view all organizations (public listing)
CREATE POLICY "Anyone can view organizations"
    ON public.organizations
    FOR SELECT
    USING (true);

-- Only authenticated users can create organizations
CREATE POLICY "Authenticated users can create organizations"
    ON public.organizations
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

-- Only owner can update organization
CREATE POLICY "Owners can update their organizations"
    ON public.organizations
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Only owner can delete organization
CREATE POLICY "Owners can delete their organizations"
    ON public.organizations
    FOR DELETE
    USING (auth.uid() = owner_id);

-- =====================================================
-- 8. RLS POLICIES - ORGANIZATION MEMBERS
-- =====================================================

-- Anyone can view members (for public member lists)
CREATE POLICY "Anyone can view organization members"
    ON public.organization_members
    FOR SELECT
    USING (true);

-- System can insert members (via trigger or approved join request)
CREATE POLICY "System can insert members"
    ON public.organization_members
    FOR INSERT
    WITH CHECK (true);

-- Owner and admins can update member roles
CREATE POLICY "Owner and admins can update members"
    ON public.organization_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Owner, admins, and the member themselves can delete
CREATE POLICY "Owner, admins, or self can delete members"
    ON public.organization_members
    FOR DELETE
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- =====================================================
-- 9. RLS POLICIES - JOIN REQUESTS
-- =====================================================

-- Users can view their own requests
CREATE POLICY "Users can view their own join requests"
    ON public.organization_join_requests
    FOR SELECT
    USING (auth.uid() = user_id);

-- Owner and admins can view all requests for their org
CREATE POLICY "Owner and admins can view org join requests"
    ON public.organization_join_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_join_requests.organization_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Authenticated users can create join requests
CREATE POLICY "Authenticated users can create join requests"
    ON public.organization_join_requests
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND auth.uid() = user_id
        AND status = 'pending'
    );

-- Owner and admins can update (approve/reject) requests
CREATE POLICY "Owner and admins can update join requests"
    ON public.organization_join_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_join_requests.organization_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Users can delete their own pending requests
CREATE POLICY "Users can delete their own pending requests"
    ON public.organization_join_requests
    FOR DELETE
    USING (auth.uid() = user_id AND status = 'pending');

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================

-- Function to generate unique slug from organization name
CREATE OR REPLACE FUNCTION public.generate_org_slug(org_name text)
RETURNS text AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 0;
BEGIN
    -- Convert to lowercase, replace spaces with hyphens, remove special chars
    base_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9\s-]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);

    final_slug := base_slug;

    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to get member count for an organization
CREATE OR REPLACE FUNCTION public.get_org_member_count(org_id uuid)
RETURNS integer AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::integer
        FROM public.organization_members
        WHERE organization_id = org_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is owner or admin of an organization
CREATE OR REPLACE FUNCTION public.is_org_manager(org_id uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id
        AND user_id = user_uuid
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search organizations by name
CREATE OR REPLACE FUNCTION public.search_organizations(
    search_term text DEFAULT NULL,
    limit_count integer DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    image_url text,
    owner_id uuid,
    created_at timestamptz,
    member_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id,
        o.name,
        o.slug,
        o.description,
        o.image_url,
        o.owner_id,
        o.created_at,
        COUNT(om.id) as member_count
    FROM public.organizations o
    LEFT JOIN public.organization_members om ON o.id = om.organization_id
    WHERE
        search_term IS NULL OR
        o.name ILIKE '%' || search_term || '%' OR
        o.description ILIKE '%' || search_term || '%'
    GROUP BY o.id
    ORDER BY member_count DESC, o.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. TRIGGER TO AUTO-ADD OWNER AS MEMBER
-- =====================================================

CREATE OR REPLACE FUNCTION public.add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically add the owner as a member with 'owner' role
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_add_owner_as_member
    AFTER INSERT ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.add_owner_as_member();

-- =====================================================
-- 12. TRIGGER TO HANDLE APPROVED JOIN REQUESTS
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_approved_join_request()
RETURNS TRIGGER AS $$
BEGIN
    -- When a join request is approved, add user as member
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO public.organization_members (organization_id, user_id, role)
        VALUES (NEW.organization_id, NEW.user_id, 'member')
        ON CONFLICT (organization_id, user_id) DO NOTHING;

        NEW.reviewed_at = now();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_join_request_approved
    BEFORE UPDATE ON public.organization_join_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_approved_join_request();

-- =====================================================
-- 13. COMMENTS
-- =====================================================

COMMENT ON TABLE public.organizations IS 'Organizations/guilds that users can create and join';
COMMENT ON TABLE public.organization_members IS 'Members of organizations with their roles';
COMMENT ON TABLE public.organization_join_requests IS 'Requests from users to join organizations';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
