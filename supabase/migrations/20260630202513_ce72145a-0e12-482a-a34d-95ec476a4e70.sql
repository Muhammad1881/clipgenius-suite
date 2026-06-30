
ALTER TABLE public.profiles ALTER COLUMN monthly_minutes SET DEFAULT 60;

UPDATE public.profiles SET monthly_minutes = 60
WHERE plan = 'free' AND monthly_minutes = 30;

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
    60,
    0
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;
