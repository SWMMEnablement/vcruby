-- Add user_id columns to all tables
ALTER TABLE fix_history ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ml_suggestions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE network_snapshots ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set user_id for existing data to a default (if any exists, it will need manual assignment)
-- Since we don't have a default user, we'll make it nullable for now to allow the migration

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access to fix_history" ON fix_history;
DROP POLICY IF EXISTS "Allow public insert to fix_history" ON fix_history;
DROP POLICY IF EXISTS "Allow public read access to ml_suggestions" ON ml_suggestions;
DROP POLICY IF EXISTS "Allow public insert to ml_suggestions" ON ml_suggestions;
DROP POLICY IF EXISTS "Allow public read access to network_snapshots" ON network_snapshots;
DROP POLICY IF EXISTS "Allow public insert to network_snapshots" ON network_snapshots;

-- Create user-scoped RLS policies for fix_history
CREATE POLICY "Users can read own fixes" ON fix_history
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fixes" ON fix_history
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fixes" ON fix_history
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fixes" ON fix_history
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user-scoped RLS policies for ml_suggestions
CREATE POLICY "Users can read own suggestions" ON ml_suggestions
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions" ON ml_suggestions
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions" ON ml_suggestions
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggestions" ON ml_suggestions
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user-scoped RLS policies for network_snapshots
CREATE POLICY "Users can read own snapshots" ON network_snapshots
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots" ON network_snapshots
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snapshots" ON network_snapshots
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own snapshots" ON network_snapshots
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);