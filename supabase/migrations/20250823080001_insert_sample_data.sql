-- Insert sample portfolio data to replace hardcoded TypeScript data

-- Insert personal information
INSERT INTO personal_info (key, value, data_type, description) VALUES
  ('full_name', 'Suresh Kumar Mukhiya', 'text', 'Full name'),
  ('title', 'Senior Software Engineer & AI Researcher', 'text', 'Professional title'),
  ('bio', 'Passionate software engineer with expertise in full-stack development, AI/ML, and research. Experienced in building scalable applications and conducting cutting-edge research in healthcare informatics.', 'text', 'Professional bio'),
  ('email', 'suresh@example.com', 'email', 'Contact email'),
  ('phone', '+1 (555) 123-4567', 'text', 'Contact phone'),
  ('location', 'San Francisco, CA', 'text', 'Current location'),
  ('website', 'https://sureshmukhiya.com', 'url', 'Personal website'),
  ('github', 'https://github.com/sureshHARDIYA', 'url', 'GitHub profile'),
  ('linkedin', 'https://linkedin.com/in/sureshmukhiya', 'url', 'LinkedIn profile'),
  ('twitter', 'https://twitter.com/sureshmukhiya', 'url', 'Twitter profile')
ON CONFLICT (key) DO NOTHING;

-- Insert skills data
INSERT INTO skills (category_name, skill_name, skill_level, color, sort_order) VALUES
  -- Frontend
  ('Frontend', 'React', 9, '#61DAFB', 1),
  ('Frontend', 'Next.js', 9, '#000000', 2),
  ('Frontend', 'TypeScript', 8, '#3178C6', 3),
  ('Frontend', 'Vue.js', 7, '#4FC08D', 4),
  ('Frontend', 'Angular', 6, '#DD0031', 5),
  ('Frontend', 'Svelte', 7, '#FF3E00', 6),
  
  -- Backend  
  ('Backend', 'Node.js', 9, '#339933', 1),
  ('Backend', 'Python', 9, '#3776AB', 2),
  ('Backend', 'Java', 7, '#ED8B00', 3),
  ('Backend', 'Go', 6, '#00ADD8', 4),
  ('Backend', 'Rust', 5, '#000000', 5),
  
  -- Database
  ('Database', 'PostgreSQL', 8, '#336791', 1),
  ('Database', 'MongoDB', 7, '#47A248', 2),
  ('Database', 'Redis', 7, '#DC382D', 3),
  ('Database', 'Supabase', 8, '#3ECF8E', 4),
  ('Database', 'Firebase', 7, '#FFCA28', 5),
  
  -- AI/ML
  ('AI/ML', 'TensorFlow', 8, '#FF6F00', 1),
  ('AI/ML', 'PyTorch', 7, '#EE4C2C', 2),
  ('AI/ML', 'Scikit-learn', 8, '#F7931E', 3),
  ('AI/ML', 'OpenAI API', 9, '#412991', 4),
  ('AI/ML', 'Hugging Face', 7, '#FFD21E', 5),
  
  -- Cloud & DevOps
  ('Cloud & DevOps', 'AWS', 8, '#FF9900', 1),
  ('Cloud & DevOps', 'Docker', 8, '#2496ED', 2),
  ('Cloud & DevOps', 'Kubernetes', 6, '#326CE5', 3),
  ('Cloud & DevOps', 'Vercel', 8, '#000000', 4),
  ('Cloud & DevOps', 'GitHub Actions', 7, '#2088FF', 5);

-- Insert education data
INSERT INTO education (degree, institution, start_year, end_year, description, status, grade, location, is_featured, sort_order) VALUES
  ('Ph.D. in Computer Science', 'Stanford University', 2020, 2024, 'Specialized in Artificial Intelligence and Healthcare Informatics. Dissertation focused on machine learning applications in medical diagnosis.', 'completed', '4.0 GPA', 'Stanford, CA', true, 1),
  ('M.S. in Computer Science', 'University of California, Berkeley', 2018, 2020, 'Focus on distributed systems and machine learning. Graduated Summa Cum Laude.', 'completed', '3.9 GPA', 'Berkeley, CA', true, 2),
  ('B.S. in Computer Engineering', 'MIT', 2014, 2018, 'Strong foundation in computer systems, algorithms, and software engineering. Active in robotics club.', 'completed', '3.8 GPA', 'Cambridge, MA', true, 3);

-- Insert experience data
INSERT INTO experience (title, company, start_date, end_date, is_current, description, technologies, location, employment_type, company_url, is_featured, sort_order) VALUES
  ('Senior Software Engineer', 'Google', '2024-01-01', NULL, true, 
   ARRAY[
     'Lead development of AI-powered features for Google Search',
     'Mentor junior engineers and conduct technical interviews',
     'Collaborate with cross-functional teams to define product roadmaps',
     'Optimize system performance handling millions of queries per second'
   ],
   ARRAY['Python', 'C++', 'TensorFlow', 'Kubernetes', 'BigQuery'],
   'Mountain View, CA', 'full-time', 'https://google.com', true, 1),
   
  ('AI Research Engineer', 'OpenAI', '2023-06-01', '2023-12-31', false,
   ARRAY[
     'Developed novel neural network architectures for language understanding',
     'Published research papers on transformer model optimization',
     'Collaborated with research scientists on GPT model improvements',
     'Implemented efficient training pipelines for large language models'
   ],
   ARRAY['Python', 'PyTorch', 'CUDA', 'Transformers', 'MLOps'],
   'San Francisco, CA', 'full-time', 'https://openai.com', true, 2),
   
  ('Full Stack Developer', 'Startup XYZ', '2022-01-01', '2023-05-31', false,
   ARRAY[
     'Built scalable web applications from ground up using modern tech stack',
     'Designed and implemented RESTful APIs and GraphQL endpoints',
     'Set up CI/CD pipelines and deployment automation',
     'Collaborated with designers to create responsive user interfaces'
   ],
   ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
   'Remote', 'full-time', 'https://startupxyz.com', false, 3);

-- Insert projects data
INSERT INTO projects (title, description, long_description, technologies, github_url, live_url, status, featured, start_date, end_date, category, difficulty_level, sort_order) VALUES
  ('AI-Powered Portfolio Chatbot', 'Intelligent chatbot for portfolio website with NLP intent detection', 
   'A sophisticated chatbot system that uses natural language processing to understand user queries about my background, skills, and experience. Features include intent classification, dynamic response generation, and comprehensive analytics dashboard.',
   ARRAY['Next.js', 'TypeScript', 'Supabase', 'OpenAI API', 'Tailwind CSS'],
   'https://github.com/sureshHARDIYA/portfolio-chatbot', 'https://sureshmukhiya.com', 'completed', true, '2024-08-01', '2024-08-23', 'AI/ML', 4, 1),
   
  ('Healthcare Data Analytics Platform', 'Real-time analytics for medical institutions',
   'A comprehensive platform for healthcare providers to analyze patient data, track treatment outcomes, and generate insights for improved care delivery. Includes HIPAA compliance and advanced visualization.',
   ARRAY['React', 'Python', 'PostgreSQL', 'D3.js', 'FastAPI'],
   'https://github.com/sureshHARDIYA/healthcare-analytics', 'https://healthanalytics.demo.com', 'completed', true, '2023-03-01', '2023-08-31', 'Healthcare', 5, 2),
   
  ('E-commerce Microservices', 'Scalable microservices architecture for online retail',
   'A modern e-commerce platform built with microservices architecture, featuring user management, product catalog, order processing, and payment integration. Deployed on Kubernetes with automated scaling.',
   ARRAY['Node.js', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
   'https://github.com/sureshHARDIYA/ecommerce-microservices', 'https://ecommerce.demo.com', 'completed', true, '2022-09-01', '2023-01-31', 'E-commerce', 4, 3),
   
  ('Machine Learning Model Deployment', 'MLOps pipeline for model serving',
   'End-to-end machine learning pipeline with automated model training, validation, and deployment. Includes monitoring, A/B testing, and rollback capabilities.',
   ARRAY['Python', 'MLflow', 'Docker', 'AWS SageMaker', 'FastAPI'],
   'https://github.com/sureshHARDIYA/ml-deployment', NULL, 'completed', false, '2022-06-01', '2022-08-31', 'AI/ML', 3, 4);

-- Insert research papers data
INSERT INTO research_papers (title, authors, publication, publication_date, abstract, doi, url, keywords, is_featured, sort_order) VALUES
  ('Deep Learning Approaches for Medical Image Analysis: A Comprehensive Survey', 
   ARRAY['Suresh Kumar Mukhiya', 'Dr. Jane Smith', 'Dr. John Doe'],
   'IEEE Transactions on Medical Imaging', '2024-03-15',
   'This paper presents a comprehensive survey of deep learning techniques applied to medical image analysis. We review state-of-the-art architectures, discuss challenges in medical imaging, and propose future research directions.',
   '10.1109/TMI.2024.1234567', 'https://ieeexplore.ieee.org/document/1234567',
   ARRAY['deep learning', 'medical imaging', 'computer vision', 'healthcare AI'],
   true, 1),
   
  ('Transformer-Based Models for Healthcare Natural Language Processing',
   ARRAY['Suresh Kumar Mukhiya', 'Dr. Sarah Johnson'],
   'Journal of Biomedical Informatics', '2023-11-20',
   'We propose novel transformer architectures specifically designed for processing clinical text data, achieving state-of-the-art performance on medical NLP benchmarks.',
   '10.1016/j.jbi.2023.104321', 'https://www.sciencedirect.com/science/article/pii/S1532046423001234',
   ARRAY['transformers', 'clinical NLP', 'BERT', 'healthcare informatics'],
   true, 2),
   
  ('Federated Learning for Privacy-Preserving Healthcare Analytics',
   ARRAY['Suresh Kumar Mukhiya', 'Dr. Michael Brown', 'Dr. Lisa Wang'],
   'Nature Machine Intelligence', '2023-07-08',
   'This work introduces a federated learning framework that enables collaborative machine learning across healthcare institutions while preserving patient privacy.',
   '10.1038/s42256-023-00678-9', 'https://www.nature.com/articles/s42256-023-00678-9',
   ARRAY['federated learning', 'privacy preservation', 'healthcare', 'differential privacy'],
   true, 3);
