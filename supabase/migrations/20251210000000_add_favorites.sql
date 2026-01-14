-- =====================================================
-- MIGRATION: AJOUT DES FAVORIS
-- =====================================================
-- Cette migration ajoute les tables pour gérer les favoris
-- des utilisateurs (récompenses et ingrédients)
-- Date: 2025-12-10
-- =====================================================

-- Table des récompenses favorites
CREATE TABLE IF NOT EXISTS public.user_favorite_rewards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id text NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, reward_id)
);

-- Table des ingrédients favoris
CREATE TABLE IF NOT EXISTS public.user_favorite_ingredients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredient_id text NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, ingredient_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS
ALTER TABLE public.user_favorite_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_ingredients ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_favorite_rewards
CREATE POLICY "Users can view their own favorite rewards"
    ON public.user_favorite_rewards
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite rewards"
    ON public.user_favorite_rewards
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite rewards"
    ON public.user_favorite_rewards
    FOR DELETE
    USING (auth.uid() = user_id);

-- Politiques pour user_favorite_ingredients
CREATE POLICY "Users can view their own favorite ingredients"
    ON public.user_favorite_ingredients
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite ingredients"
    ON public.user_favorite_ingredients
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite ingredients"
    ON public.user_favorite_ingredients
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS user_favorite_rewards_user_id_idx ON public.user_favorite_rewards(user_id);
CREATE INDEX IF NOT EXISTS user_favorite_rewards_reward_id_idx ON public.user_favorite_rewards(reward_id);

CREATE INDEX IF NOT EXISTS user_favorite_ingredients_user_id_idx ON public.user_favorite_ingredients(user_id);
CREATE INDEX IF NOT EXISTS user_favorite_ingredients_ingredient_id_idx ON public.user_favorite_ingredients(ingredient_id);

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE public.user_favorite_rewards IS 'Table des récompenses mises en favori par les utilisateurs';
COMMENT ON TABLE public.user_favorite_ingredients IS 'Table des ingrédients mis en favori par les utilisateurs';
