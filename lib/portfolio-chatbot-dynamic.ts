// lib/portfolio-chatbot-dynamic.ts - Dynamic portfolio data fetcher
export interface SkillCategory {
  name: string;
  skills: Array<{
    name: string;
    level: number;
    color: string;
  }>;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
  status: "completed" | "current";
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  featured: boolean;
  stars: number;
  forks: number;
  language: string;
}

export interface ResearchPaper {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  abstract: string;
  doi?: string;
  url?: string;
}

// Cache for API responses
let portfolioCache: {
  skills?: SkillCategory[];
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  research?: ResearchPaper[];
  lastUpdated?: number;
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = () => {
  return portfolioCache.lastUpdated && 
         (Date.now() - portfolioCache.lastUpdated) < CACHE_DURATION;
};

// Fetch data from API with caching
async function fetchPortfolioData<T>(endpoint: string, key: keyof typeof portfolioCache): Promise<T[]> {
  if (isCacheValid() && portfolioCache[key]) {
    return portfolioCache[key] as T[];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/portfolio/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    
    const data = await response.json();
    portfolioCache[key] = data[endpoint] || data[key] || [];
    portfolioCache.lastUpdated = Date.now();
    
    return portfolioCache[key] as T[];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return cached data if available, otherwise empty array
    return portfolioCache[key] as T[] || [];
  }
}

export const getSkills = (): Promise<SkillCategory[]> => {
  return fetchPortfolioData<SkillCategory>('skills', 'skills');
};

export const getEducation = (): Promise<Education[]> => {
  return fetchPortfolioData<Education>('education', 'education');
};

export const getExperience = (): Promise<Experience[]> => {
  return fetchPortfolioData<Experience>('experience', 'experience');
};

export const getProjects = (): Promise<Project[]> => {
  return fetchPortfolioData<Project>('projects', 'projects');
};

export const getResearch = (): Promise<ResearchPaper[]> => {
  return fetchPortfolioData<ResearchPaper>('research', 'research');
};

// Get all portfolio data
export const getAllPortfolioData = async () => {
  const [skills, education, experience, projects, research] = await Promise.all([
    getSkills(),
    getEducation(),
    getExperience(),
    getProjects(),
    getResearch(),
  ]);

  return {
    skills,
    education,
    experience,
    projects,
    research,
  };
};

// Generate response based on intent and dynamic data
export const generateDynamicResponse = async (intent: string) => {
  try {
    switch (intent) {
      case 'SKILLS_INQUIRY':
        const skills = await getSkills();
        return {
          type: 'skills',
          data: skills,
          textResponse: `I have expertise in ${skills.length} main categories: ${skills.map(cat => cat.name).join(', ')}. Here are my technical skills:`,
        };

      case 'EXPERIENCE_INQUIRY':
        const experience = await getExperience();
        return {
          type: 'experience',
          data: experience,
          textResponse: `I have ${experience.length} major professional experiences. Here's my work background:`,
        };

      case 'EDUCATION_INQUIRY':
        const education = await getEducation();
        return {
          type: 'education',
          data: education,
          textResponse: `My educational background includes ${education.length} degrees. Here's my academic journey:`,
        };

      case 'PROJECT_INQUIRY':
        const projects = await getProjects();
        const featuredProjects = projects.filter(p => p.featured);
        return {
          type: 'projects',
          data: featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3),
          textResponse: `I've worked on ${projects.length} projects. Here are some highlights:`,
        };

      case 'RESEARCH_INQUIRY':
        const research = await getResearch();
        return {
          type: 'research',
          data: research,
          textResponse: `I've published ${research.length} research papers. Here's my research work:`,
        };

      case 'OVERVIEW_INQUIRY':
        const overviewData = await getAllPortfolioData();
        return {
          type: 'overview',
          data: {
            summary: `I'm a software engineer with ${overviewData.experience.length} major roles, ${overviewData.education.length} degrees, and ${overviewData.projects.length} projects.`,
            highlights: [
              `${overviewData.skills.reduce((total, cat) => total + cat.skills.length, 0)} technical skills across ${overviewData.skills.length} categories`,
              `${overviewData.research.length} published research papers`,
              `${overviewData.projects.filter(p => p.featured).length} featured projects`,
            ],
          },
          textResponse: `Here's an overview of my background and experience:`,
        };

      default:
        return {
          type: 'general',
          data: null,
          textResponse: "I'd be happy to tell you about my skills, experience, education, projects, or research. What would you like to know?",
        };
    }
  } catch (error) {
    console.error('Error generating dynamic response:', error);
    return {
      type: 'error',
      data: null,
      textResponse: "I'm having trouble accessing my portfolio data right now. Please try again later.",
    };
  }
};

// Clear cache (useful for admin updates)
export const clearPortfolioCache = () => {
  portfolioCache = {};
};
