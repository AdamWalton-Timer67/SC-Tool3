-- =====================================================
-- MIGRATION INITIALE COMPLÈTE - Star Citizen Emporium Tracker
-- =====================================================
-- Cette migration crée l'ensemble du schéma de base de données
-- pour le Star Citizen Emporium Tracker (Wikelo)
-- Date: 2025-11-07
-- Version: 1.0.0
-- =====================================================

-- =====================================================
-- 1. EXTENSIONS ET FONCTIONS UTILITAIRES
-- =====================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. TABLES PRINCIPALES - DONNÉES DE RÉFÉRENCE
-- =====================================================

-- Table des ingrédients (matériaux, composants, etc.)
CREATE TABLE IF NOT EXISTS public.ingredients (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_fr text NOT NULL,
    category text NOT NULL,
    rarity text NOT NULL,
    image_url text,
    image_credit text,
    description_en text,
    description_fr text,
    how_to_obtain_en text,
    how_to_obtain_fr text,
    locations_en text[],
    locations_fr text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table des récompenses (vaisseaux, armes, armures, etc.)
CREATE TABLE IF NOT EXISTS public.rewards (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_fr text NOT NULL,
    type_en text,
    type_fr text,
    category text NOT NULL,
    rarity text NOT NULL,
    version text,
    favor_cost integer,
    description_en text,
    description_fr text,
    image_url text,
    image_credit text,
    mission_name_en text,
    mission_name_fr text,
    has_loadout boolean DEFAULT false,
    components jsonb,
    gives integer,
    not_released boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table de liaison entre récompenses et ingrédients requis
CREATE TABLE IF NOT EXISTS public.reward_ingredients (
    reward_id text NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    ingredient_id text NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit text,
    PRIMARY KEY (reward_id, ingredient_id)
);

-- =====================================================
-- 3. TABLES UTILISATEURS - DONNÉES PERSONNELLES
-- =====================================================

-- Table de l'inventaire utilisateur
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredient_id text NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity integer DEFAULT 0 CHECK (quantity >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, ingredient_id)
);

-- Table du progrès utilisateur sur les récompenses (ingrédients cochés)
CREATE TABLE IF NOT EXISTS public.user_reward_ingredients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id text NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    ingredient_id text NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    is_checked boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, reward_id, ingredient_id)
);

-- Table des complétions de récompenses (compteur de fois complétées)
CREATE TABLE IF NOT EXISTS public.user_reward_completions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id text NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    completion_count integer DEFAULT 0 CHECK (completion_count >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, reward_id)
);

-- =====================================================
-- 4. TABLES ADMINISTRATIVES
-- =====================================================

-- Table des rôles utilisateurs (pour l'administration)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
    granted_by uuid REFERENCES auth.users(id),
    granted_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Table des logs d'activité admin (optionnel)
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action text NOT NULL,
    table_name text,
    record_id text,
    old_values jsonb,
    new_values jsonb,
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. INDEXES POUR LES PERFORMANCES
-- =====================================================

-- Index pour les ingrédients
CREATE INDEX IF NOT EXISTS ingredients_category_idx ON public.ingredients(category);
CREATE INDEX IF NOT EXISTS ingredients_rarity_idx ON public.ingredients(rarity);
CREATE INDEX IF NOT EXISTS ingredients_name_search_idx ON public.ingredients USING gin ((name_en || ' ' || name_fr) gin_trgm_ops);

-- Index pour les récompenses
CREATE INDEX IF NOT EXISTS rewards_category_idx ON public.rewards(category);
CREATE INDEX IF NOT EXISTS rewards_rarity_idx ON public.rewards(rarity);
CREATE INDEX IF NOT EXISTS rewards_name_search_idx ON public.rewards USING gin ((name_en || ' ' || name_fr) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS rewards_not_released_idx ON public.rewards(not_released);

-- Index pour les liaisons récompenses-ingrédients
CREATE INDEX IF NOT EXISTS reward_ingredients_reward_id_idx ON public.reward_ingredients(reward_id);
CREATE INDEX IF NOT EXISTS reward_ingredients_ingredient_id_idx ON public.reward_ingredients(ingredient_id);

-- Index pour l'inventaire utilisateur
CREATE INDEX IF NOT EXISTS user_inventory_user_id_idx ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS user_inventory_ingredient_id_idx ON public.user_inventory(ingredient_id);

-- Index pour le progrès utilisateur
CREATE INDEX IF NOT EXISTS user_reward_ingredients_user_id_idx ON public.user_reward_ingredients(user_id);
CREATE INDEX IF NOT EXISTS user_reward_ingredients_reward_id_idx ON public.user_reward_ingredients(reward_id);
CREATE INDEX IF NOT EXISTS user_reward_ingredients_ingredient_id_idx ON public.user_reward_ingredients(ingredient_id);

-- Index pour les complétions
CREATE INDEX IF NOT EXISTS user_reward_completions_user_id_idx ON public.user_reward_completions(user_id);
CREATE INDEX IF NOT EXISTS user_reward_completions_reward_id_idx ON public.user_reward_completions(reward_id);

-- Index pour les rôles
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON public.user_roles(role);

-- Index pour les logs admin
CREATE INDEX IF NOT EXISTS admin_logs_user_id_idx ON public.admin_logs(user_id);
CREATE INDEX IF NOT EXISTS admin_logs_created_at_idx ON public.admin_logs(created_at);
CREATE INDEX IF NOT EXISTS admin_logs_action_idx ON public.admin_logs(action);

-- =====================================================
-- 6. TRIGGERS POUR UPDATED_AT
-- =====================================================

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_ingredients_updated_at
    BEFORE UPDATE ON public.ingredients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_rewards_updated_at
    BEFORE UPDATE ON public.rewards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_inventory_updated_at
    BEFORE UPDATE ON public.user_inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_reward_ingredients_updated_at
    BEFORE UPDATE ON public.user_reward_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_reward_completions_updated_at
    BEFORE UPDATE ON public.user_reward_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables utilisateur
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. POLITIQUES RLS - INVENTAIRE UTILISATEUR
-- =====================================================

CREATE POLICY "Users can view their own inventory"
    ON public.user_inventory
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory"
    ON public.user_inventory
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
    ON public.user_inventory
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
    ON public.user_inventory
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 9. POLITIQUES RLS - PROGRÈS RÉCOMPENSES
-- =====================================================

CREATE POLICY "Users can view their own reward progress"
    ON public.user_reward_ingredients
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward progress"
    ON public.user_reward_ingredients
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reward progress"
    ON public.user_reward_ingredients
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reward progress"
    ON public.user_reward_ingredients
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 10. POLITIQUES RLS - COMPLÉTIONS RÉCOMPENSES
-- =====================================================

CREATE POLICY "Users can view their own reward completions"
    ON public.user_reward_completions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward completions"
    ON public.user_reward_completions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reward completions"
    ON public.user_reward_completions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reward completions"
    ON public.user_reward_completions
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 11. POLITIQUES RLS - RÔLES UTILISATEURS
-- =====================================================

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Les utilisateurs peuvent voir leurs propres rôles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Seuls les admins peuvent gérer les rôles
CREATE POLICY "Admins can manage all roles"
    ON public.user_roles
    FOR ALL
    USING (public.is_admin());

-- =====================================================
-- 12. POLITIQUES RLS - LOGS ADMIN
-- =====================================================

-- Seuls les admins peuvent voir les logs
CREATE POLICY "Admins can view all logs"
    ON public.admin_logs
    FOR SELECT
    USING (public.is_admin());

-- Les logs sont créés automatiquement (pas d'insert direct)
CREATE POLICY "System can insert logs"
    ON public.admin_logs
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 13. POLITIQUES RLS - DONNÉES PUBLIQUES
-- =====================================================

-- Les tables de référence sont en lecture libre pour tous les utilisateurs authentifiés
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_ingredients ENABLE ROW LEVEL SECURITY;

-- Lecture libre pour les ingrédients
CREATE POLICY "Anyone can view ingredients"
    ON public.ingredients
    FOR SELECT
    USING (true);

-- Lecture libre pour les récompenses
CREATE POLICY "Anyone can view rewards"
    ON public.rewards
    FOR SELECT
    USING (true);

-- Lecture libre pour les liaisons récompenses-ingrédients
CREATE POLICY "Anyone can view reward ingredients"
    ON public.reward_ingredients
    FOR SELECT
    USING (true);

-- Seuls les admins peuvent modifier les données de référence
CREATE POLICY "Admins can manage ingredients"
    ON public.ingredients
    FOR ALL
    USING (public.is_admin());

CREATE POLICY "Admins can manage rewards"
    ON public.rewards
    FOR ALL
    USING (public.is_admin());

CREATE POLICY "Admins can manage reward ingredients"
    ON public.reward_ingredients
    FOR ALL
    USING (public.is_admin());

-- =====================================================
-- 14. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid uuid DEFAULT auth.uid())
RETURNS jsonb AS $$
DECLARE
    total_rewards integer;
    completed_rewards integer;
    total_ingredients integer;
    inventory_items integer;
BEGIN
    -- Vérifier que l'utilisateur demande ses propres stats ou est admin
    IF user_uuid != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Compter le total de récompenses
    SELECT COUNT(*) INTO total_rewards FROM public.rewards;
    
    -- Compter les récompenses complétées par l'utilisateur
    SELECT COUNT(DISTINCT reward_id) INTO completed_rewards
    FROM public.user_reward_completions
    WHERE user_id = user_uuid AND completion_count > 0;
    
    -- Compter le total d'ingrédients
    SELECT COUNT(*) INTO total_ingredients FROM public.ingredients;
    
    -- Compter les items dans l'inventaire
    SELECT COUNT(*) INTO inventory_items
    FROM public.user_inventory
    WHERE user_id = user_uuid AND quantity > 0;

    RETURN jsonb_build_object(
        'total_rewards', total_rewards,
        'completed_rewards', completed_rewards,
        'total_ingredients', total_ingredients,
        'inventory_items', inventory_items,
        'completion_percentage', 
        CASE 
            WHEN total_rewards > 0 THEN ROUND((completed_rewards::decimal / total_rewards) * 100, 2)
            ELSE 0
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les données utilisateur (RGPD)
CREATE OR REPLACE FUNCTION public.delete_user_data(user_uuid uuid)
RETURNS void AS $$
BEGIN
    -- Seul l'utilisateur lui-même ou un admin peut supprimer les données
    IF user_uuid != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Supprimer toutes les données utilisateur
    DELETE FROM public.user_inventory WHERE user_id = user_uuid;
    DELETE FROM public.user_reward_ingredients WHERE user_id = user_uuid;
    DELETE FROM public.user_reward_completions WHERE user_id = user_uuid;
    DELETE FROM public.user_roles WHERE user_id = user_uuid;
    DELETE FROM public.admin_logs WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 15. VUES UTILES
-- =====================================================

-- Vue pour les récompenses avec leurs ingrédients
CREATE OR REPLACE VIEW public.rewards_with_ingredients AS
SELECT 
    r.*,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'ingredient_id', ri.ingredient_id,
                'quantity', ri.quantity,
                'unit', ri.unit,
                'ingredient_name_en', i.name_en,
                'ingredient_name_fr', i.name_fr,
                'ingredient_category', i.category,
                'ingredient_rarity', i.rarity
            )
        ) FILTER (WHERE ri.ingredient_id IS NOT NULL),
        '[]'::jsonb
    ) AS ingredients
FROM public.rewards r
LEFT JOIN public.reward_ingredients ri ON r.id = ri.reward_id
LEFT JOIN public.ingredients i ON ri.ingredient_id = i.id
GROUP BY r.id;

-- Vue pour les statistiques globales
CREATE OR REPLACE VIEW public.global_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.rewards) as total_rewards,
    (SELECT COUNT(*) FROM public.ingredients) as total_ingredients,
    (SELECT COUNT(*) FROM public.reward_ingredients) as total_requirements,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_inventory WHERE quantity > 0) as active_users,
    (SELECT AVG(completion_count) FROM public.user_reward_completions WHERE completion_count > 0) as avg_completions;

-- =====================================================
-- 16. COMMENTAIRES SUR LES TABLES
-- =====================================================

COMMENT ON TABLE public.ingredients IS 'Table des ingrédients/matériaux du jeu Star Citizen pour le système Wikelo';
COMMENT ON TABLE public.rewards IS 'Table des récompenses disponibles dans le système Wikelo';
COMMENT ON TABLE public.reward_ingredients IS 'Table de liaison définissant les ingrédients requis pour chaque récompense';
COMMENT ON TABLE public.user_inventory IS 'Inventaire personnel de chaque utilisateur';
COMMENT ON TABLE public.user_reward_ingredients IS 'Progrès de chaque utilisateur sur les récompenses (ingrédients cochés)';
COMMENT ON TABLE public.user_reward_completions IS 'Compteur de complétions de récompenses par utilisateur';
COMMENT ON TABLE public.user_roles IS 'Rôles et permissions des utilisateurs';
COMMENT ON TABLE public.admin_logs IS 'Logs des actions administratives';

-- =====================================================
-- 17. DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer un utilisateur admin par défaut (à adapter selon vos besoins)
-- INSERT INTO public.user_roles (user_id, role, granted_at)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin', now())
-- ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

-- Log de la migration
DO $$
BEGIN
    RAISE NOTICE 'Migration complète terminée avec succès !';
    RAISE NOTICE 'Tables créées: ingredients, rewards, reward_ingredients, user_inventory, user_reward_ingredients, user_reward_completions, user_roles, admin_logs';
    RAISE NOTICE 'RLS activé sur toutes les tables utilisateur';
    RAISE NOTICE 'Index de performance créés';
    RAISE NOTICE 'Fonctions utilitaires disponibles: get_user_stats(), delete_user_data(), is_admin()';
    RAISE NOTICE 'Vues créées: rewards_with_ingredients, global_stats';
END $$;
