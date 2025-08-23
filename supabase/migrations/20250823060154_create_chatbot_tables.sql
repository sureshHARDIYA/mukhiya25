-- Create intents table for chatbot intent classification
CREATE TABLE IF NOT EXISTS intents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responses table for storing chatbot responses
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  intent_id INTEGER REFERENCES intents(id) ON DELETE CASCADE,
  trigger_patterns TEXT[] DEFAULT '{}',
  response_text TEXT NOT NULL,
  response_type VARCHAR(20) NOT NULL,
  response_data JSONB,
  follow_up_questions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_queries table for analytics and monitoring
CREATE TABLE IF NOT EXISTS user_queries (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  detected_intent VARCHAR(50),
  confidence DECIMAL(3,2),
  response_id INTEGER REFERENCES responses(id),
  user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_responses_intent_id ON responses(intent_id);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_user_queries_intent ON user_queries(detected_intent);

-- Insert initial intents
INSERT INTO intents (name, description, confidence_threshold) VALUES
  ('SKILLS_INQUIRY', 'Questions about technical skills, technologies, and expertise', 0.6),
  ('EXPERIENCE_INQUIRY', 'Questions about work experience and professional background', 0.6),
  ('EDUCATION_INQUIRY', 'Questions about educational background and academic qualifications', 0.6),
  ('PROJECT_INQUIRY', 'Questions about projects, portfolio work, and creations', 0.6),
  ('RESEARCH_INQUIRY', 'Questions about research work, publications, and academic contributions', 0.6),
  ('CONTACT_INQUIRY', 'Questions about contact information and how to get in touch', 0.7),
  ('OVERVIEW_INQUIRY', 'General questions about background and overview', 0.5),
  ('GENERAL_INQUIRY', 'Fallback for unclassified questions', 0.3)
ON CONFLICT (name) DO NOTHING;

-- Insert initial responses
INSERT INTO responses (intent_id, trigger_patterns, response_text, response_type, response_data, follow_up_questions)
SELECT 
  i.id,
  ARRAY[trigger_pattern],
  response_text,
  response_type,
  response_data::jsonb,
  follow_up_questions
FROM intents i
CROSS JOIN (
  VALUES 
    ('SKILLS_INQUIRY', 'skill', 'Here are my technical skills across different domains. I''m passionate about full-stack development with particular expertise in React, Node.js, and AI technologies.', 'skills', '{"type": "skills", "data": []}', ARRAY['What is Suresh''s professional experience?', 'What projects has Suresh worked on?', 'Tell me about Suresh''s educational background']),
    ('EXPERIENCE_INQUIRY', 'experience', 'I have over 5 years of professional experience as a Senior Software Engineer, with a strong background in healthcare technology and full-stack development.', 'experience', '{"type": "experience", "data": []}', ARRAY['What are Suresh''s technical skills?', 'What projects has Suresh built?', 'What research has Suresh done?']),
    ('EDUCATION_INQUIRY', 'education', 'I hold a PhD in Computer Science with specialization in Digital Health Solutions. My academic journey has been focused on bridging technology and healthcare.', 'education', '{"type": "education", "data": []}', ARRAY['What is Suresh''s professional experience?', 'What research has Suresh published?', 'What are Suresh''s technical skills?']),
    ('PROJECT_INQUIRY', 'project', 'I''ve worked on various exciting projects ranging from AI-powered healthcare solutions to open-source development tools. Each project showcases different aspects of my technical expertise.', 'projects', '{"type": "projects", "data": []}', ARRAY['What technologies does Suresh use?', 'Tell me about Suresh''s work experience', 'How can I contact Suresh?']),
    ('RESEARCH_INQUIRY', 'research', 'My research focuses on AI applications in digital health and software engineering methodologies. I''ve published papers in peer-reviewed journals and conferences.', 'research', '{"type": "research", "data": []}', ARRAY['What is Suresh''s educational background?', 'What projects has Suresh worked on?', 'What are Suresh''s technical skills?']),
    ('OVERVIEW_INQUIRY', 'about', 'I''m a technology professional who bridges the gap between academic research and practical software development, with a special focus on healthcare technology and AI applications.', 'overview', '{"type": "overview", "data": {"summary": "I''m a PhD holder specializing in software engineering, digital health, and AI applications. I combine academic research with practical industry experience to create innovative technology solutions.", "highlights": ["🎓 PhD in Computer Science", "💼 5+ years as Senior Software Engineer", "🔬 Published researcher in digital health", "🚀 Full-stack development expert", "🤖 AI and machine learning enthusiast"]}}', ARRAY['What are Suresh''s technical skills?', 'What is Suresh''s professional experience?', 'What projects has Suresh worked on?'])
) AS data(intent_name, trigger_pattern, response_text, response_type, response_data, follow_up_questions)
WHERE i.name = data.intent_name
ON CONFLICT DO NOTHING;
