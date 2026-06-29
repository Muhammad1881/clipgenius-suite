
-- Pin search_path on functions missing it
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pg_temp;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pg_temp;

-- Revoke public/anon/authenticated EXECUTE on privileged SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.consume_minutes_for(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_minutes_for(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_expired_free_cycles() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_minutes_for(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_minutes_for(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_expired_free_cycles() TO service_role;

-- User-self helpers: restrict to authenticated only (no anon)
REVOKE ALL ON FUNCTION public.consume_minutes(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.refund_minutes(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_minutes(integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refund_minutes(integer) TO authenticated, service_role;
