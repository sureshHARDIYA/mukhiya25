-- Update portfolio tables to match component expectations

-- Update education table structure
ALTER TABLE education 
  ADD COLUMN IF NOT EXISTS field_of_study VARCHAR(200),
  ADD COLUMN IF NOT EXISTS start_date VARCHAR(7), -- YYYY-MM format
  ADD COLUMN IF NOT EXISTS end_date VARCHAR(7); -- YYYY-MM format

-- Migrate existing data
UPDATE education SET 
  start_date = start_year::text || '-01' 
WHERE start_year IS NOT NULL AND start_date IS NULL;

UPDATE education SET
  end_date = end_year::text || '-12'
WHERE end_year IS NOT NULL AND end_date IS NULL;

-- Update experience table structure  
ALTER TABLE experience
  ADD COLUMN IF NOT EXISTS position VARCHAR(200),
  ADD COLUMN IF NOT EXISTS start_date VARCHAR(7), -- YYYY-MM format
  ADD COLUMN IF NOT EXISTS end_date VARCHAR(7); -- YYYY-MM format

-- Migrate experience data
UPDATE experience SET position = title WHERE position IS NULL;

-- Update projects table structure
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS is_ongoing BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date VARCHAR(7), -- YYYY-MM format  
  ADD COLUMN IF NOT EXISTS end_date VARCHAR(7); -- YYYY-MM format

-- Update research table structure (rename to research)
CREATE TABLE IF NOT EXISTS research (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  abstract TEXT,
  authors TEXT[] DEFAULT '{}',
  publication_date DATE,
  publication_venue VARCHAR(200),
  doi VARCHAR(100),
  paper_url VARCHAR(500),
  categories TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('published', 'under_review', 'in_progress', 'submitted')),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrate data from research_papers to research
INSERT INTO research (title, abstract, authors, publication_date, publication_venue, doi, paper_url, keywords, featured, sort_order, created_at, updated_at)
SELECT 
  title,
  abstract,
  authors,
  publication_date,
  publication as publication_venue,
  doi,
  url as paper_url,
  keywords,
  is_featured as featured,
  sort_order,
  created_at,
  updated_at
FROM research_papers
ON CONFLICT DO NOTHING;

-- Update personal_info table structure for better usability
CREATE TABLE IF NOT EXISTS personal_info_structured (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200),
  email VARCHAR(200),
  phone VARCHAR(50),
  location VARCHAR(200),
  bio TEXT,
  website VARCHAR(500),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info_structured ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Public read access to research" ON research
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to research" ON research
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Public read access to personal_info_structured" ON personal_info_structured
  FOR SELECT USING (true);

CREATE POLICY "Admin write access to personal_info_structured" ON personal_info_structured
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_research_status ON research(status);
CREATE INDEX IF NOT EXISTS idx_research_featured ON research(featured);
