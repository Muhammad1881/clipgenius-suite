
-- Revoke direct execute from signed-in users; only service_role (server) should call these
REVOKE EXECUTE ON FUNCTION public.consume_minutes(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refund_minutes(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_expired_free_cycles() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_minutes(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_minutes(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_expired_free_cycles() TO service_role;

-- Server-callable variants that accept an explicit user id (server has already authenticated the caller)
CREATE OR REPLACE FUNCTION public.consume_minutes_for(_user_id uuid, _minutes int)
RETURNS TABLE(ok boolean, minutes_used int, monthly_minutes int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  UPDATE public.profiles SET minutes_used = minutes_used + _minutes
  WHERE user_id = _user_id
  RETURNING minutes_used, monthly_minutes INTO v_used, v_total;

  RETURN QUERY SELECT true, v_used, v_total;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_minutes_for(_user_id uuid, _minutes int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN RAISE EXCEPTION 'missing user'; END IF;
  IF _minutes IS NULL OR _minutes <= 0 THEN RETURN; END IF;
  UPDATE public.profiles SET minutes_used = GREATEST(0, minutes_used - _minutes)
  WHERE user_id = _user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_minutes_for(uuid, int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refund_minutes_for(uuid, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_minutes_for(uuid, int) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_minutes_for(uuid, int) TO service_role;
