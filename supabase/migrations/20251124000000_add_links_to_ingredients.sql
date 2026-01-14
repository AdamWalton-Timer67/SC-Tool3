-- Add links column to ingredients table
ALTER TABLE public.ingredients
ADD COLUMN IF NOT EXISTS links jsonb;

COMMENT ON COLUMN public.ingredients.links IS 'External links related to the ingredient (e.g., wiki pages, guides)';
