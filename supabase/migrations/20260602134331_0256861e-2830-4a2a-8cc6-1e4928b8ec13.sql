-- Add minutes-based usage tracking columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS monthly_minutes integer NOT NULL DEFAULT 30,
ADD COLUMN IF NOT EXISTS minutes_used integer NOT NULL DEFAULT 0;

-- Backfill existing profiles with plan-appropriate monthly minutes
UPDATE public.profiles
SET monthly_minutes = CASE plan
  WHEN 'starter' THEN 300
  WHEN 'creator' THEN 500
  ELSE 30
END;

-- Update handle_new_user to set minutes columns for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name, monthly_minutes, minutes_used)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    30,
    0
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;