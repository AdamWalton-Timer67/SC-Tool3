-- =====================================================
-- MIGRATION - Ajout des Locations
-- =====================================================
-- Cette migration ajoute le système de locations pour Star Citizen
-- Date: 2025-11-29
-- Version: 1.1.0
-- =====================================================

-- =====================================================
-- 0. ACTIVER LES EXTENSIONS NÉCESSAIRES
-- =====================================================

-- Activer l'extension pg_trgm pour les recherches full-text
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- 1. TABLE DES LOCATIONS
-- =====================================================

-- Table des locations importantes dans Star Citizen
CREATE TABLE IF NOT EXISTS public.locations (
    id text PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    type text NOT NULL CHECK (type IN ('contested_zone', 'orbital_laser', 'investigation', 'underground_facility', 'warehouse', 'bunker', 'other')),
    system text NOT NULL,
    planet text,
    moon text,

    -- Noms et descriptions multilingues
    name_en text NOT NULL,
    name_fr text NOT NULL,
    name_de text,

    short_description_en text,
    short_description_fr text,
    short_description_de text,

    description_en text,
    description_fr text,
    description_de text,

    how_to_access_en text,
    how_to_access_fr text,
    how_to_access_de text,

    mission_types_en text,
    mission_types_fr text,
    mission_types_de text,

    loot_types_en text,
    loot_types_fr text,
    loot_types_de text,

    -- Métadonnées
    image_url text,
    image_credit text,
    crate_types text[],
    requirements text,
    rewards text,
    difficulty text CHECK (difficulty IN ('low', 'low-medium', 'medium', 'medium-high', 'high')),
    coordinates text,
    related_missions text[],

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. AJOUTER LA RELATION LOCATION AUX INGREDIENTS
-- =====================================================

-- Ajouter une colonne location_id à la table ingredients
ALTER TABLE public.ingredients
ADD COLUMN IF NOT EXISTS location_id text REFERENCES public.locations(id) ON DELETE SET NULL;

-- =====================================================
-- 3. INDEX POUR LES PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS locations_type_idx ON public.locations(type);
CREATE INDEX IF NOT EXISTS locations_system_idx ON public.locations(system);
CREATE INDEX IF NOT EXISTS locations_difficulty_idx ON public.locations(difficulty);
CREATE INDEX IF NOT EXISTS locations_slug_idx ON public.locations(slug);
CREATE INDEX IF NOT EXISTS locations_name_search_idx ON public.locations USING gin ((name_en || ' ' || name_fr) gin_trgm_ops);

-- Index sur la nouvelle colonne location_id dans ingredients
CREATE INDEX IF NOT EXISTS ingredients_location_id_idx ON public.ingredients(location_id);

-- =====================================================
-- 4. TRIGGER POUR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. FONCTION UTILITAIRE - VÉRIFICATION ADMIN
-- =====================================================

-- Créer la fonction is_admin si elle n'existe pas déjà
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uuid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Lecture libre pour les locations (données publiques)
CREATE POLICY "Anyone can view locations"
    ON public.locations
    FOR SELECT
    USING (true);

-- Seuls les admins peuvent modifier les locations
CREATE POLICY "Admins can manage locations"
    ON public.locations
    FOR ALL
    USING (public.is_admin());

-- =====================================================
-- 7. VUE UTILE - LOCATIONS AVEC INGREDIENTS ASSOCIÉS
-- =====================================================

CREATE OR REPLACE VIEW public.locations_with_ingredients AS
SELECT
    l.*,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'ingredient_id', i.id,
                'ingredient_name_en', i.name_en,
                'ingredient_name_fr', i.name_fr,
                'ingredient_category', i.category,
                'ingredient_rarity', i.rarity,
                'ingredient_image_url', i.image_url
            )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'::jsonb
    ) AS ingredients
FROM public.locations l
LEFT JOIN public.ingredients i ON i.location_id = l.id
GROUP BY l.id;

-- =====================================================
-- 8. FONCTION UTILITAIRE - RECHERCHE DE LOCATIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.search_locations(
    search_term text DEFAULT NULL,
    location_type text DEFAULT NULL,
    location_system text DEFAULT NULL,
    location_difficulty text DEFAULT NULL
)
RETURNS TABLE (
    id text,
    slug text,
    type text,
    system text,
    name_en text,
    name_fr text,
    short_description_en text,
    short_description_fr text,
    image_url text,
    difficulty text,
    ingredient_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.slug,
        l.type,
        l.system,
        l.name_en,
        l.name_fr,
        l.short_description_en,
        l.short_description_fr,
        l.image_url,
        l.difficulty,
        COUNT(i.id) as ingredient_count
    FROM public.locations l
    LEFT JOIN public.ingredients i ON i.location_id = l.id
    WHERE
        (search_term IS NULL OR
         l.name_en ILIKE '%' || search_term || '%' OR
         l.name_fr ILIKE '%' || search_term || '%' OR
         l.description_en ILIKE '%' || search_term || '%' OR
         l.description_fr ILIKE '%' || search_term || '%')
        AND (location_type IS NULL OR l.type = location_type)
        AND (location_system IS NULL OR l.system = location_system)
        AND (location_difficulty IS NULL OR l.difficulty = location_difficulty)
    GROUP BY l.id
    ORDER BY l.name_en;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. COMMENTAIRES SUR LA TABLE
-- =====================================================

COMMENT ON TABLE public.locations IS 'Table des locations importantes dans Star Citizen (zones contestées, installations, etc.)';
COMMENT ON COLUMN public.locations.type IS 'Type de location: contested_zone, orbital_laser, investigation, underground_facility, warehouse, bunker, other';
COMMENT ON COLUMN public.locations.difficulty IS 'Niveau de difficulté: low, low-medium, medium, medium-high, high';
COMMENT ON COLUMN public.locations.crate_types IS 'Types de caisses disponibles sur cette location';
COMMENT ON COLUMN public.locations.related_missions IS 'Noms des missions liées à cette location';

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Migration locations terminée avec succès !';
    RAISE NOTICE 'Table créée: locations';
    RAISE NOTICE 'Colonne ajoutée: ingredients.location_id';
    RAISE NOTICE 'RLS activé sur la table locations';
    RAISE NOTICE 'Vue créée: locations_with_ingredients';
    RAISE NOTICE 'Fonction créée: search_locations()';
END $$;
