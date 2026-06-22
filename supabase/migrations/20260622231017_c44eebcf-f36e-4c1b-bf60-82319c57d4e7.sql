CREATE OR REPLACE FUNCTION public.consume_minutes_for(_user_id uuid, _minutes integer)
 RETURNS TABLE(ok boolean, minutes_used integer, monthly_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_used int;
  v_total int;
BEGIN
  IF _user_id IS NULL THEN RAISE EXCEPTION 'missing user'; END IF;
  IF _minutes IS NULL OR _minutes <= 0 THEN RAISE EXCEPTION 'invalid minutes'; END IF;

  SELECT p.minutes_used, p.monthly_minutes INTO v_used, v_total
  FROM public.profiles p WHERE p.user_id = _user_id FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'profile missing'; END IF;

  IF v_used + _minutes > v_total THEN
    RETURN QUERY SELECT false, v_used, v_total;
    RETURN;
  END IF;

  UPDATE public.profiles p SET minutes_used = p.minutes_used + _minutes
  WHERE p.user_id = _user_id
  RETURNING p.minutes_used, p.monthly_minutes INTO v_used, v_total;

  RETURN QUERY SELECT true, v_used, v_total;
END;
$function$;

CREATE OR REPLACE FUNCTION public.consume_minutes(_minutes integer)
 RETURNS TABLE(ok boolean, minutes_used integer, monthly_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_used int;
  v_total int;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
  IF _minutes IS NULL OR _minutes <= 0 THEN RAISE EXCEPTION 'invalid minutes'; END IF;

  SELECT p.minutes_used, p.monthly_minutes INTO v_used, v_total
  FROM public.profiles p WHERE p.user_id = v_user_id FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'profile missing'; END IF;

  IF v_used + _minutes > v_total THEN
    RETURN QUERY SELECT false, v_used, v_total;
    RETURN;
  END IF;

  UPDATE public.profiles p SET minutes_used = p.minutes_used + _minutes
  WHERE p.user_id = v_user_id
  RETURNING p.minutes_used, p.monthly_minutes INTO v_used, v_total;

  RETURN QUERY SELECT true, v_used, v_total;
END;
$function$;