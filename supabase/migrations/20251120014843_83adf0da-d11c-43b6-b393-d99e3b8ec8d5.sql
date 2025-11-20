-- Enable Row Level Security on all tables
ALTER TABLE public.fix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view data)
CREATE POLICY "Public can view fix history"
ON public.fix_history
FOR SELECT
USING (true);

CREATE POLICY "Public can view ML suggestions"
ON public.ml_suggestions
FOR SELECT
USING (true);

CREATE POLICY "Public can view network snapshots"
ON public.network_snapshots
FOR SELECT
USING (true);

-- Restrictive write policies (no public writes via client)
-- Edge functions will use service role key for writes
CREATE POLICY "No public inserts on fix_history"
ON public.fix_history
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No public updates on fix_history"
ON public.fix_history
FOR UPDATE
USING (false);

CREATE POLICY "No public deletes on fix_history"
ON public.fix_history
FOR DELETE
USING (false);

CREATE POLICY "No public inserts on ml_suggestions"
ON public.ml_suggestions
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No public updates on ml_suggestions"
ON public.ml_suggestions
FOR UPDATE
USING (false);

CREATE POLICY "No public deletes on ml_suggestions"
ON public.ml_suggestions
FOR DELETE
USING (false);

CREATE POLICY "No public inserts on network_snapshots"
ON public.network_snapshots
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No public updates on network_snapshots"
ON public.network_snapshots
FOR UPDATE
USING (false);

CREATE POLICY "No public deletes on network_snapshots"
ON public.network_snapshots
FOR DELETE
USING (false);