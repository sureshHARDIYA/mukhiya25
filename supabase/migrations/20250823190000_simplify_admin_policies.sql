-- Temporarily allow authenticated users to manage portfolio data
-- This is a simplified approach until proper admin role system is implemented

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin write access to skills" ON skills;
DROP POLICY IF EXISTS "Admin write access to education" ON education;  
DROP POLICY IF EXISTS "Admin write access to experience" ON experience;
DROP POLICY IF EXISTS "Admin write access to projects" ON projects;
DROP POLICY IF EXISTS "Admin write access to research" ON research;
DROP POLICY IF EXISTS "Admin write access to personal_info" ON personal_info;

-- Create new policies that allow any authenticated user to manage portfolio data
-- This is suitable for a personal portfolio where the owner is the only user
CREATE POLICY "Authenticated user write access to skills" ON skills
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated user write access to education" ON education
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated user write access to experience" ON experience
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated user write access to projects" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated user write access to research" ON research
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated user write access to personal_info" ON personal_info
  FOR ALL USING (auth.uid() IS NOT NULL);
