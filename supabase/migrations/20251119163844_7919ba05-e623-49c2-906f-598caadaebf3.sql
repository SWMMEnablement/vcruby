-- Create table for storing network fix history
CREATE TABLE IF NOT EXISTS public.fix_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipe_id TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning')),
  parameter_changed TEXT NOT NULL,
  value_before DECIMAL NOT NULL,
  value_after DECIMAL NOT NULL,
  impact_description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
  performance_improvement JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for network snapshots (for what-if simulation)
CREATE TABLE IF NOT EXISTS public.network_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_name TEXT NOT NULL,
  pipes_data JSONB NOT NULL,
  overall_stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for ML optimization suggestions
CREATE TABLE IF NOT EXISTS public.ml_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_text TEXT NOT NULL,
  confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  based_on_fixes INTEGER NOT NULL DEFAULT 0,
  suggestion_type TEXT NOT NULL,
  target_pipes TEXT[],
  recommended_actions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_fix_history_pipe ON public.fix_history(pipe_id);
CREATE INDEX idx_fix_history_applied ON public.fix_history(applied_at DESC);
CREATE INDEX idx_fix_history_issue ON public.fix_history(issue_type);
CREATE INDEX idx_ml_suggestions_created ON public.ml_suggestions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.fix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for demo purposes - adjust for production)
CREATE POLICY "Allow public read access to fix_history" 
  ON public.fix_history FOR SELECT USING (true);

CREATE POLICY "Allow public insert to fix_history" 
  ON public.fix_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to network_snapshots" 
  ON public.network_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow public insert to network_snapshots" 
  ON public.network_snapshots FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to ml_suggestions" 
  ON public.ml_suggestions FOR SELECT USING (true);

CREATE POLICY "Allow public insert to ml_suggestions" 
  ON public.ml_suggestions FOR INSERT WITH CHECK (true);