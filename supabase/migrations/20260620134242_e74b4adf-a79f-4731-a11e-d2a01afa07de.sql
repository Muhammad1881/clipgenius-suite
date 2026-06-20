CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Idempotent: unschedule first if it already exists
DO $$
BEGIN
  PERFORM cron.unschedule('reset-free-cycles-daily');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'reset-free-cycles-daily',
  '0 3 * * *',
  $$ SELECT public.reset_expired_free_cycles(); $$
);