-- Disable RLS on all tables
ALTER TABLE public.fix_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_suggestions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_snapshots DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can delete own fixes" ON public.fix_history;
DROP POLICY IF EXISTS "Users can insert own fixes" ON public.fix_history;
DROP POLICY IF EXISTS "Users can read own fixes" ON public.fix_history;
DROP POLICY IF EXISTS "Users can update own fixes" ON public.fix_history;

DROP POLICY IF EXISTS "Users can delete own suggestions" ON public.ml_suggestions;
DROP POLICY IF EXISTS "Users can insert own suggestions" ON public.ml_suggestions;
DROP POLICY IF EXISTS "Users can read own suggestions" ON public.ml_suggestions;
DROP POLICY IF EXISTS "Users can update own suggestions" ON public.ml_suggestions;

DROP POLICY IF EXISTS "Users can delete own snapshots" ON public.network_snapshots;
DROP POLICY IF EXISTS "Users can insert own snapshots" ON public.network_snapshots;
DROP POLICY IF EXISTS "Users can read own snapshots" ON public.network_snapshots;
DROP POLICY IF EXISTS "Users can update own snapshots" ON public.network_snapshots;

-- Make user_id nullable since we're removing auth
ALTER TABLE public.fix_history ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.ml_suggestions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.network_snapshots ALTER COLUMN user_id DROP NOT NULL;