// lib/chatbot-service.ts - Portfolio Chatbot System
import {
  getFollowUpQuestions as getConfiguredFollowUpQuestions,
  getFollowUpAnswer,
} from "./follow-up-config";
import { githubService } from "./github-service";

export interface SkillCategory {
  name: string;
  skills: Array<{
    name: string;
    level: number; // 1-10
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
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
  // GitHub-specific fields
  stars?: number;
  forks?: number;
  language?: string;
  lastUpdated?: string;
  homepage?: string;
}

export interface ResearchPaper {
  title: string;
  journal: string;
  year: string;
  authors: string[];
  link?: string;
}

export interface QAData {
  type: string;
  data: SkillCategory[] | Education[] | Experience[] | Project[] | ResearchPaper[] | { summary: string; highlights: string[] };
  textResponse: string;
}

export interface QACollection {
  [key: string]: QAData;
}

// Import dynamic data functions
import {
  getSkills,
  getEducation,
  getExperience,
  getResearch,
} from "./portfolio-chatbot-dynamic";

// Function to get projects from GitHub (with fallback to static data)
export async function getProjects(): Promise<Project[]> {
  try {
    // Try to fetch from GitHub first
    const githubProjects = await githubService.getFeaturedProjects([
      "mukhiya25", // Portfolio website
      "trygno-ui-storybook", // UI components storybook
      "idpt", // Digital platform project
      "phd-resources", // PhD resources
      "min-blog", // Minimalist blog
      "skmbooks", // Books platform
      "web-components", // Web components library
      "skm-components", // Component library
    ]);

    // Convert GitHub projects to Project format, preserving GitHub data
    const convertedProjects: Project[] = githubProjects.map((project) => ({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      link: project.link,
      image: undefined, // Could add repo social preview image later
      // Preserve GitHub-specific data
      stars: project.stars,
      forks: project.forks,
      language: project.language,
      lastUpdated: project.lastUpdated,
      homepage: project.homepage,
    }));

    // If we got projects from GitHub, return them
    if (convertedProjects.length > 0) {
      return convertedProjects;
    }
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
  }

  // Fallback to empty array if GitHub fails
  return [];
}

// Function to get updated portfolio data with GitHub projects
export async function getUpdatedPortfolioData() {
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
}

// Dynamic Q&A system that fetches data from database
export const getPredefinedQA = async () => {
  const [skills, education, experience, projects, research] = await Promise.all([
    getSkills(),
    getEducation(),
    getExperience(),
    getProjects(),
    getResearch(),
  ]);

  return {
    "What are Suresh's technical skills?": {
      type: "skills",
      data: skills,
      textResponse:
        "Here are my technical skills across different domains. I'm passionate about full-stack development with particular expertise in modern technologies.",
    },
    "Tell me about Suresh's educational background": {
      type: "education",
      data: education,
      textResponse:
        "I hold a PhD in Computer Science with specialization in Digital Health Solutions. My academic journey has been focused on bridging technology and healthcare.",
    },
    "What is Suresh's professional experience?": {
      type: "experience",
      data: experience,
      textResponse:
        "I have professional experience as a software engineer, with a strong background in healthcare technology and full-stack development.",
    },
    "What projects has Suresh worked on?": {
      type: "projects",
      data: projects,
      textResponse:
        "I've worked on various exciting projects ranging from AI-powered healthcare solutions to open-source development tools. Each project showcases different aspects of my technical expertise.",
    },
    "What research has Suresh done?": {
      type: "research",
      data: research,
      textResponse:
        "My research focuses on AI applications in digital health and software engineering methodologies. I've published papers in peer-reviewed journals and conferences.",
    },
    "Tell me about Suresh's background": {
      type: "overview",
      data: {
        summary:
          "I'm a PhD holder specializing in software engineering, digital health, and AI applications. I combine academic research with practical industry experience to create innovative technology solutions.",
        highlights: [
          "🎓 PhD in Computer Science",
          "💼 Professional Software Engineer",
          "🔬 Published researcher in digital health",
          "🚀 Full-stack development expert",
          "🤖 AI and machine learning enthusiast",
        ],
      },
      textResponse:
        "I'm a technology professional who bridges the gap between academic research and practical software development, with a special focus on healthcare technology and AI applications.",
    },
  };
};

// Enhanced response generation with dynamic data
export async function generateResponse(query: string): Promise<{
  type: "predefined" | "custom" | "email_request";
  response: string;
  data?: {
    type: string;
    data:
      | SkillCategory[]
      | Education[]
      | Experience[]
      | Project[]
      | ResearchPaper[]
      | { summary: string; highlights: string[] };
    textResponse: string;
  };
  followUpQuestions?: string[];
  requiresEmail?: boolean;
}> {
  // Get dynamic predefined QA
  const predefinedQA = await getPredefinedQA();
  
  // Check for exact match with predefined questions
  const exactMatch = predefinedQA[query as keyof typeof predefinedQA];
  if (exactMatch) {
    // Special handling for projects to get GitHub data
    if (exactMatch.type === "projects") {
      const projects = await getProjects();
      return {
        type: "predefined",
        response: exactMatch.textResponse,
        data: {
          ...exactMatch,
          data: projects,
        },
        followUpQuestions: getFollowUpQuestions(exactMatch.type),
      };
    }

    return {
      type: "predefined",
      response: exactMatch.textResponse,
      data: exactMatch,
      followUpQuestions: getFollowUpQuestions(exactMatch.type),
    };
  }

  // Check if this is a follow-up question with a predefined answer
  const followUpAnswer = getFollowUpAnswer(query);
  if (followUpAnswer) {
    return {
      type: "predefined",
      response: followUpAnswer.answer,
      // Don't show follow-up questions for follow-up answers to avoid infinite loops
      followUpQuestions: [],
    };
  }

  // Check for partial matches using keywords
  const queryLower = query.toLowerCase();
  const keywords = {
    skills: [
      "skill",
      "technology",
      "programming",
      "technical",
      "expertise",
      "languages",
      "frameworks",
    ],
    education: [
      "education",
      "degree",
      "phd",
      "university",
      "academic",
      "study",
    ],
    experience: [
      "experience",
      "work",
      "job",
      "career",
      "professional",
      "company",
    ],
    projects: ["project", "built", "created", "developed", "portfolio"],
    research: ["research", "paper", "publication", "published", "academic"],
    background: ["background", "about", "who", "biography", "overview"],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => queryLower.includes(word))) {
      const matchingQA = Object.entries(predefinedQA).find(
        ([, value]) =>
          (value as QAData).type === category ||
          (category === "background" && (value as QAData).type === "overview")
      );

      if (matchingQA) {
        const [, qaData] = matchingQA;
        const typedQaData = qaData as QAData;

        // Special handling for projects to get GitHub data
        if (typedQaData.type === "projects") {
          const projects = await getProjects();
          return {
            type: "predefined",
            response: typedQaData.textResponse,
            data: {
              ...typedQaData,
              data: projects,
            },
            followUpQuestions: getFollowUpQuestions(typedQaData.type),
          };
        }

        return {
          type: "predefined",
          response: typedQaData.textResponse,
          data: typedQaData,
          followUpQuestions: getFollowUpQuestions(typedQaData.type),
        };
      }
    }
  }

  // For custom questions, suggest email contact
  return {
    type: "custom",
    response: `Thank you for your question! This seems like a specific inquiry that isn't covered in my predefined responses. 

I'd love to give you a personalized answer! This website is a portfolio showcase, not an actual AI - but I (Suresh) do read all questions personally.

Would you like to leave your email address so I can get back to you with a detailed response? I typically respond within 24 hours.`,
    requiresEmail: true,
  };
}

// Email collection for custom questions
export function saveCustomQuestion(
  question: string,
  email?: string
): Promise<boolean> {
  // In a real app, this would save to a database or send an email
  // For now, we'll just log it and store in localStorage
  const customQuestions = JSON.parse(
    localStorage.getItem("customQuestions") || "[]"
  );
  const newQuestion = {
    id: Date.now(),
    question,
    email,
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  customQuestions.push(newQuestion);
  localStorage.setItem("customQuestions", JSON.stringify(customQuestions));

  console.log("New custom question saved:", newQuestion);
  return Promise.resolve(true);
}

// Function to get follow-up questions based on the current response type
export function getFollowUpQuestions(responseType: string): string[] {
  return getConfiguredFollowUpQuestions(responseType, 5); // Limit to 5 questions for better UX
}

// Updated suggested questions (initial ones)
export const suggestedQuestions = [
  "What are Suresh's technical skills?",
  "Tell me about Suresh's educational background",
  "What is Suresh's professional experience?",
  "What projects has Suresh worked on?",
  "What research has Suresh done?",
  "Tell me about Suresh's background",
];
