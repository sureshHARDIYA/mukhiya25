// lib/portfolio-chatbot-dynamic.ts - Dynamic portfolio data fetcher
import { supabase } from './supabase-auth';

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

// Fetch data from Supabase directly (server-side)
async function fetchPortfolioData<T>(tableName: string, key: keyof typeof portfolioCache): Promise<T[]> {
  if (isCacheValid() && portfolioCache[key]) {
    return portfolioCache[key] as T[];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];
    
    if (tableName === 'education') {
      const { data: educationData, error } = await supabase
        .from('education')
        .select('*')
        .order('end_year', { ascending: false });
      
      if (error) throw error;
      
      // Format education data
      data = educationData?.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.end_year ? edu.end_year.toString() : 'Present',
        description: edu.description || '',
        status: edu.status as 'completed' | 'current',
      })) || [];
      
    } else if (tableName === 'skills') {
      const { data: skillsData, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .order('category_name')
        .order('sort_order');
      
      if (error) throw error;
      
      // Group skills by category
      const skillCategories: { [key: string]: Array<{ name: string; level: number; color: string }> } = {};
      skillsData?.forEach(skill => {
        if (!skillCategories[skill.category_name]) {
          skillCategories[skill.category_name] = [];
        }
        skillCategories[skill.category_name].push({
          name: skill.skill_name,
          level: skill.skill_level,
          color: skill.color || '#3B82F6'
        });
      });
      
      data = Object.entries(skillCategories).map(([name, skills]) => ({
        name,
        skills
      }));
      
    } else if (tableName === 'experience') {
      const { data: experienceData, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      data = experienceData?.map(exp => ({
        title: exp.job_title,
        company: exp.company_name,
        duration: `${exp.start_date} - ${exp.end_date || 'Present'}`,
        description: exp.responsibilities || [],
        technologies: exp.technologies || [],
      })) || [];
      
    } else if (tableName === 'projects') {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      data = projectsData?.map(project => ({
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        github: project.github_url,
        live: project.live_url,
        featured: project.featured || false,
        stars: project.github_stars || 0,
        forks: project.github_forks || 0,
        language: project.primary_language || 'JavaScript',
      })) || [];
      
    } else if (tableName === 'research') {
      const { data: researchData, error } = await supabase
        .from('research_papers')
        .select('*')
        .order('publication_date', { ascending: false });
      
      if (error) throw error;
      
      data = researchData?.map(paper => ({
        title: paper.title,
        authors: paper.authors || [],
        journal: paper.publication || '',
        year: paper.publication_date ? new Date(paper.publication_date).getFullYear().toString() : '',
        abstract: paper.abstract || '',
        doi: paper.doi,
        url: paper.url,
      })) || [];
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (portfolioCache as any)[key] = data;
    portfolioCache.lastUpdated = Date.now();
    
    return data as T[];
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    // Return cached data if available, otherwise empty array
    return (portfolioCache[key] as T[]) || [];
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
