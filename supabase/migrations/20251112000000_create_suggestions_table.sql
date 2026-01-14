-- Create suggestions table for user feedback on rewards and ingredients
CREATE TABLE IF NOT EXISTS public.suggestions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    item_type text NOT NULL CHECK (item_type IN ('reward', 'ingredient')),
    item_id text NOT NULL,
    item_name text NOT NULL,
    suggestion_type text NOT NULL,
    content text NOT NULL,
    user_email text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on suggestions
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suggestions
-- Users can view their own suggestions
CREATE POLICY "Users can view their own suggestions"
    ON public.suggestions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone can insert suggestions (authenticated or anonymous)
CREATE POLICY "Anyone can insert suggestions"
    ON public.suggestions
    FOR INSERT
    WITH CHECK (true);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all suggestions"
    ON public.suggestions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Admins can delete any suggestion
CREATE POLICY "Admins can delete any suggestion"
    ON public.suggestions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Admins can update any suggestion
CREATE POLICY "Admins can update any suggestion"
    ON public.suggestions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS suggestions_user_id_idx ON public.suggestions(user_id);
CREATE INDEX IF NOT EXISTS suggestions_item_type_idx ON public.suggestions(item_type);
CREATE INDEX IF NOT EXISTS suggestions_item_id_idx ON public.suggestions(item_id);
CREATE INDEX IF NOT EXISTS suggestions_status_idx ON public.suggestions(status);
CREATE INDEX IF NOT EXISTS suggestions_created_at_idx ON public.suggestions(created_at DESC);

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_suggestions_updated_at
    BEFORE UPDATE ON public.suggestions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
