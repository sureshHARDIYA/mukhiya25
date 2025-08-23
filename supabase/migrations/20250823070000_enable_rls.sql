-- supabase/migrations/20250823070000_enable_rls.sql
-- Enable Row Level Security for all tables

-- Enable RLS on intents table
ALTER TABLE intents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on responses table  
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_queries table
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for intents table
-- Allow public read access for chatbot functionality
CREATE POLICY "Allow public read access to intents" ON intents
    FOR SELECT USING (true);

-- Only allow authenticated admin users to modify intents
CREATE POLICY "Allow admin write access to intents" ON intents
    FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Create policies for responses table
-- Allow public read access for chatbot functionality
CREATE POLICY "Allow public read access to responses" ON responses
    FOR SELECT USING (true);

-- Only allow authenticated admin users to modify responses
CREATE POLICY "Allow admin write access to responses" ON responses
    FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Create policies for user_queries table
-- Allow public insert for logging user queries
CREATE POLICY "Allow public insert to user_queries" ON user_queries
    FOR INSERT WITH CHECK (true);

-- Only allow authenticated admin users to read query analytics
CREATE POLICY "Allow admin read access to user_queries" ON user_queries
    FOR SELECT USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Only allow authenticated admin users to modify user_queries
CREATE POLICY "Allow admin write access to user_queries" ON user_queries
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Create a function to check if user is admin (alternative approach)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
