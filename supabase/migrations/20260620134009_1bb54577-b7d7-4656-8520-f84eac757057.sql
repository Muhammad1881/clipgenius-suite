-- Add columns to track Stripe customer + free-plan cycle reset
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS cycle_start timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON public.profiles(stripe_customer_id);

-- Atomic minute consumption. Returns ok=false when over quota; no partial deduction.
CREATE OR REPLACE FUNCTION public.consume_minutes(_minutes int)
RETURNS TABLE (ok boolean, minutes_used int, monthly_minutes int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_used int;
  v_total int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;
  IF _minutes IS NULL OR _minutes <= 0 THEN
    RAISE EXCEPTION 'invalid minutes';
  END IF;

  SELECT p.minutes_used, p.monthly_minutes
    INTO v_used, v_total
  FROM public.profiles p
  WHERE p.user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'profile missing';
  END IF;

  IF v_used + _minutes > v_total THEN
    RETURN QUERY SELECT false, v_used, v_total;
    RETURN;
  END IF;

  UPDATE public.profiles
    SET minutes_used = minutes_used + _minutes
  WHERE user_id = v_user_id
  RETURNING minutes_used, monthly_minutes INTO v_used, v_total;

  RETURN QUERY SELECT true, v_used, v_total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_minutes(int) TO authenticated;

-- Refund minutes (if downstream processing failed). Never goes below 0.
CREATE OR REPLACE FUNCTION public.refund_minutes(_minutes int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;
  IF _minutes IS NULL OR _minutes <= 0 THEN
    RETURN;
  END IF;
  UPDATE public.profiles
    SET minutes_used = GREATEST(0, minutes_used - _minutes)
  WHERE user_id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_minutes(int) TO authenticated;

-- Cron-callable: reset Free-plan cycles older than 30 days. Returns rows affected.
CREATE OR REPLACE FUNCTION public.reset_expired_free_cycles()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  WITH updated AS (
    UPDATE public.profiles
      SET minutes_used = 0, cycle_start = now()
    WHERE plan = 'free'
      AND cycle_start < now() - interval '30 days'
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM updated;
  RETURN v_count;
END;
$$;

-- Cron runs as the postgres role, not anon/authenticated; no grant needed.