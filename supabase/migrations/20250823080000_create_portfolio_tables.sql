-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create portfolio data tables to replace hardcoded TypeScript data

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  skill_level INTEGER CHECK (skill_level >= 1 AND skill_level <= 10),
  color VARCHAR(7) DEFAULT '#3B82F6', -- Default blue color
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  degree VARCHAR(200) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  start_year INTEGER,
  end_year INTEGER,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'current', 'pending')),
  grade VARCHAR(50),
  location VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT[],
  technologies TEXT[],
  location VARCHAR(100),
  employment_type VARCHAR(50) DEFAULT 'full-time',
  company_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  long_description TEXT,
  technologies TEXT[],
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planned', 'archived')),
  featured BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  category VARCHAR(100),
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research papers table
CREATE TABLE IF NOT EXISTS research_papers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  authors TEXT[],
  publication VARCHAR(200),
  publication_date DATE,
  abstract TEXT,
  doi VARCHAR(100),
  url VARCHAR(500),
  pdf_url VARCHAR(500),
  keywords TEXT[],
  citation_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal information table (for bio, contact, etc.)
CREATE TABLE IF NOT EXISTS personal_info (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  data_type VARCHAR(50) DEFAULT 'text' CHECK (data_type IN ('text', 'json', 'array', 'url', 'email')),
  is_public BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_name);
CREATE INDEX IF NOT EXISTS idx_education_status ON education(status);
CREATE INDEX IF NOT EXISTS idx_experience_current ON experience(is_current);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_research_featured ON research_papers(is_featured);
CREATE INDEX IF NOT EXISTS idx_personal_info_key ON personal_info(key);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admin users can only see their own record
CREATE POLICY "Users can view own record" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Portfolio data policies (admin-only write, public read)
CREATE POLICY "Public read access to skills" ON skills
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin write access to skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to education" ON education
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to education" ON education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to experience" ON experience
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to experience" ON experience
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to research" ON research_papers
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to research" ON research_papers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to personal_info" ON personal_info
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admin write access to personal_info" ON personal_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
