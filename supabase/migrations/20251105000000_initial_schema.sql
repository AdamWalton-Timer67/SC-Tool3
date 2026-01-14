-- Create user_inventory table
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredient_id text NOT NULL,
    quantity integer DEFAULT 0 CHECK (quantity >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_inventory
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_inventory
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

-- Create user_reward_ingredients table
CREATE TABLE IF NOT EXISTS public.user_reward_ingredients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id text NOT NULL,
    ingredient_id text NOT NULL,
    is_checked boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_reward_ingredients
ALTER TABLE public.user_reward_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_reward_ingredients
CREATE POLICY "Users can view their own reward ingredients"
    ON public.user_reward_ingredients
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward ingredients"
    ON public.user_reward_ingredients
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reward ingredients"
    ON public.user_reward_ingredients
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reward ingredients"
    ON public.user_reward_ingredients
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_inventory_user_id_idx ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS user_inventory_ingredient_id_idx ON public.user_inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS user_reward_ingredients_user_id_idx ON public.user_reward_ingredients(user_id);
CREATE INDEX IF NOT EXISTS user_reward_ingredients_reward_id_idx ON public.user_reward_ingredients(reward_id);

-- Create trigger for updated_at on user_inventory
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_inventory_updated_at
    BEFORE UPDATE ON public.user_inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_reward_ingredients_updated_at
    BEFORE UPDATE ON public.user_reward_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
