-- Add unique constraint on user_id in user_roles table
-- This allows only one role per user and enables ON CONFLICT operations

-- First, remove any duplicate entries (keep the first one)
DELETE FROM public.user_roles a
USING public.user_roles b
WHERE a.id > b.id
AND a.user_id = b.user_id;

-- Add unique constraint on user_id
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);
