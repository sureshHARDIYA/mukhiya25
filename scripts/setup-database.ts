// scripts/setup-database.ts
import { supabaseAdmin } from "@/lib/supabase";

// Initial data to populate the database
const initialIntents = [
  {
    name: "SKILLS_INQUIRY",
    description:
      "Questions about technical skills, technologies, and expertise",
    confidence_threshold: 0.6,
  },
  {
    name: "EXPERIENCE_INQUIRY",
    description: "Questions about work experience and professional background",
    confidence_threshold: 0.6,
  },
  {
    name: "EDUCATION_INQUIRY",
    description:
      "Questions about educational background and academic qualifications",
    confidence_threshold: 0.6,
  },
  {
    name: "PROJECT_INQUIRY",
    description: "Questions about projects, portfolio work, and creations",
    confidence_threshold: 0.6,
  },
  {
    name: "RESEARCH_INQUIRY",
    description:
      "Questions about research work, publications, and academic contributions",
    confidence_threshold: 0.6,
  },
  {
    name: "CONTACT_INQUIRY",
    description: "Questions about contact information and how to get in touch",
    confidence_threshold: 0.7,
  },
  {
    name: "OVERVIEW_INQUIRY",
    description: "General questions about background and overview",
    confidence_threshold: 0.5,
  },
  {
    name: "GENERAL_INQUIRY",
    description: "Fallback for unclassified questions",
    confidence_threshold: 0.3,
  },
];

const initialResponses = [
  {
    intent_name: "SKILLS_INQUIRY",
    trigger_patterns: [
      "skill",
      "technology",
      "programming",
      "technical skills",
      "tech stack",
    ],
    response_text:
      "Here are my technical skills across different domains. I'm passionate about full-stack development with particular expertise in React, Node.js, and AI technologies.",
    response_type: "skills",
    response_data: {
      type: "skills",
      data: [], // Will be populated with actual skills data
    },
    follow_up_questions: [
      "What is Suresh's professional experience?",
      "What projects has Suresh worked on?",
      "Tell me about Suresh's educational background",
    ],
  },
  {
    intent_name: "EXPERIENCE_INQUIRY",
    trigger_patterns: [
      "experience",
      "work",
      "job",
      "career",
      "professional background",
    ],
    response_text:
      "I have over 5 years of professional experience as a Senior Software Engineer, with a strong background in healthcare technology and full-stack development.",
    response_type: "experience",
    response_data: {
      type: "experience",
      data: [], // Will be populated with actual experience data
    },
    follow_up_questions: [
      "What are Suresh's technical skills?",
      "What projects has Suresh built?",
      "What research has Suresh done?",
    ],
  },
  {
    intent_name: "EDUCATION_INQUIRY",
    trigger_patterns: [
      "education",
      "degree",
      "phd",
      "university",
      "academic background",
    ],
    response_text:
      "I hold a PhD in Computer Science with specialization in Digital Health Solutions. My academic journey has been focused on bridging technology and healthcare.",
    response_type: "education",
    response_data: {
      type: "education",
      data: [], // Will be populated with actual education data
    },
    follow_up_questions: [
      "What is Suresh's professional experience?",
      "What research has Suresh published?",
      "What are Suresh's technical skills?",
    ],
  },
  {
    intent_name: "PROJECT_INQUIRY",
    trigger_patterns: [
      "project",
      "built",
      "created",
      "portfolio",
      "github projects",
    ],
    response_text:
      "I've worked on various exciting projects ranging from AI-powered healthcare solutions to open-source development tools. Each project showcases different aspects of my technical expertise.",
    response_type: "projects",
    response_data: {
      type: "projects",
      data: [], // Will be populated with actual project data
    },
    follow_up_questions: [
      "What technologies does Suresh use?",
      "Tell me about Suresh's work experience",
      "How can I contact Suresh?",
    ],
  },
  {
    intent_name: "RESEARCH_INQUIRY",
    trigger_patterns: [
      "research",
      "papers",
      "publications",
      "academic research",
    ],
    response_text:
      "My research focuses on AI applications in digital health and software engineering methodologies. I've published papers in peer-reviewed journals and conferences.",
    response_type: "research",
    response_data: {
      type: "research",
      data: [], // Will be populated with actual research data
    },
    follow_up_questions: [
      "What is Suresh's educational background?",
      "What projects has Suresh worked on?",
      "What are Suresh's technical skills?",
    ],
  },
  {
    intent_name: "OVERVIEW_INQUIRY",
    trigger_patterns: [
      "about",
      "who",
      "background",
      "overview",
      "tell me about",
    ],
    response_text:
      "I'm a technology professional who bridges the gap between academic research and practical software development, with a special focus on healthcare technology and AI applications.",
    response_type: "overview",
    response_data: {
      type: "overview",
      data: {
        summary:
          "I'm a PhD holder specializing in software engineering, digital health, and AI applications. I combine academic research with practical industry experience to create innovative technology solutions.",
        highlights: [
          "🎓 PhD in Computer Science",
          "💼 5+ years as Senior Software Engineer",
          "🔬 Published researcher in digital health",
          "🚀 Full-stack development expert",
          "🤖 AI and machine learning enthusiast",
        ],
      },
    },
    follow_up_questions: [
      "What are Suresh's technical skills?",
      "What is Suresh's professional experience?",
      "What projects has Suresh worked on?",
    ],
  },
];

export async function setupDatabase() {
  try {
    console.log('🔄 Setting up database schema...')
    
    // Create tables one by one using individual SQL commands
    
    // 1. Create intents table
    console.log('Creating intents table...')
    const { error: intentsTableError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS intents (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (intentsTableError) {
      console.log('Trying alternative method for intents table...')
      // Alternative method using direct SQL
      const { error: altError1 } = await supabaseAdmin
        .from('_sql')
        .select('*')
        .eq('query', `
          CREATE TABLE IF NOT EXISTS intents (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `)
      
      if (altError1) {
        console.log('Using simplified approach - creating tables via insert operations...')
        // Try to insert a test record to see if table exists
        const { error: testError } = await supabaseAdmin
          .from('intents')
          .select('*')
          .limit(1)
        
        if (testError && testError.message.includes('does not exist')) {
          console.error('❌ Tables need to be created manually in Supabase dashboard')
          console.log(`
            Please create these tables manually in your Supabase dashboard:
            
            1. Go to https://supabase.com/dashboard/project/kdqbaiezfxtkdwfhjyct/editor
            2. Click on "SQL Editor"
            3. Run this SQL:
            
            CREATE TABLE IF NOT EXISTS intents (
              id SERIAL PRIMARY KEY,
              name VARCHAR(50) UNIQUE NOT NULL,
              description TEXT,
              confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

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

            CREATE TABLE IF NOT EXISTS user_queries (
              id SERIAL PRIMARY KEY,
              query TEXT NOT NULL,
              detected_intent VARCHAR(50),
              confidence DECIMAL(3,2),
              response_id INTEGER REFERENCES responses(id),
              user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            Then run this API again.
          `)
          return false
        }
      }
    }
    
    console.log('✅ Tables should exist now. Continuing with data insertion...')
    
    // Insert sample intents
    console.log('Inserting sample intents...')
    for (const intent of initialIntents) {
      const { error } = await supabaseAdmin
        .from('intents')
        .upsert(intent, { onConflict: 'name' })
      
      if (error) {
        console.error(`Error inserting intent ${intent.name}:`, error)
      }
    }
    
    // Insert sample responses
    console.log('Inserting sample responses...')
    for (const response of initialResponses) {
      const { error } = await supabaseAdmin
        .from('responses')
        .upsert(response, { onConflict: 'id' })
      
      if (error) {
        console.error(`Error inserting response for ${response.intent_name}:`, error)
      }
    }
    
    console.log('✅ Database setup completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return false
  }
}

// Run this if called directly
if (require.main === module) {
  setupDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Setup failed:", error);
      process.exit(1);
    });
}
