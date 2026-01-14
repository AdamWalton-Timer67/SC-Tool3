-- Fix missing unique constraint on user_reward_ingredients
-- This constraint is required for the upsert operation to work correctly

ALTER TABLE public.user_reward_ingredients
ADD CONSTRAINT user_reward_ingredients_user_reward_ingredient_unique
UNIQUE (user_id, reward_id, ingredient_id);
