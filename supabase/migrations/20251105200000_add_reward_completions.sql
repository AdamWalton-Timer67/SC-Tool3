-- Add completion tracking for rewards
-- This allows users to complete the same reward multiple times

-- Add a table to track reward completions
CREATE TABLE IF NOT EXISTS public.user_reward_completions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id text NOT NULL,
    completion_count integer DEFAULT 0 CHECK (completion_count >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, reward_id)
);

-- Enable RLS on user_reward_completions
ALTER TABLE public.user_reward_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_reward_completions
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_reward_completions_user_id_idx ON public.user_reward_completions(user_id);
CREATE INDEX IF NOT EXISTS user_reward_completions_reward_id_idx ON public.user_reward_completions(reward_id);

-- Create trigger for updated_at on user_reward_completions
CREATE TRIGGER update_user_reward_completions_updated_at
    BEFORE UPDATE ON public.user_reward_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
