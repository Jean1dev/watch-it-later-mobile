-- Explicit grants required for Supabase Data API access after Oct 30, 2026
-- See: https://supabase.com/changelog (schema exposure policy change)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.watchlist TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.watchlist TO authenticated;
