-- Create reputation_requirements table
CREATE TABLE IF NOT EXISTS public.reputation_requirements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reward_id text NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    reputation_name_en text NOT NULL,
    reputation_name_fr text NOT NULL,
    required_level integer NOT NULL CHECK (required_level > 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS reputation_requirements_reward_id_idx ON public.reputation_requirements(reward_id);

-- Add trigger for updated_at
CREATE TRIGGER update_reputation_requirements_updated_at
    BEFORE UPDATE ON public.reputation_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.reputation_requirements ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view reputation requirements"
    ON public.reputation_requirements
    FOR SELECT
    USING (true);

-- Admin write access
CREATE POLICY "Admins can manage reputation requirements"
    ON public.reputation_requirements
    FOR ALL
    USING (public.is_admin());

-- Add comment
COMMENT ON TABLE public.reputation_requirements IS 'Reputation requirements for Wikelo rewards';
