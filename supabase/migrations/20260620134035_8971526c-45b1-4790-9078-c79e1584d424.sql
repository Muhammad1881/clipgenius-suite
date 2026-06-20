REVOKE EXECUTE ON FUNCTION public.consume_minutes(int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.refund_minutes(int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reset_expired_free_cycles() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_minutes(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_minutes(int) TO authenticated;