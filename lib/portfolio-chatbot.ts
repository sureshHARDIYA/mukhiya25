// lib/chatbot-service.ts - Portfolio Chatbot System
import {
  getFollowUpQuestions as getConfiguredFollowUpQuestions,
  getFollowUpAnswer,
} from "./follow-up-config";

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
}

export interface ResearchPaper {
  title: string;
  journal: string;
  year: string;
  authors: string[];
  link?: string;
}

// Comprehensive portfolio data
export const portfolioData = {
  skills: [
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: 9, color: "#61DAFB" },
        { name: "Next.js", level: 9, color: "#000000" },
        { name: "TypeScript", level: 8, color: "#3178C6" },
        { name: "Vue.js", level: 7, color: "#4FC08D" },
        { name: "Tailwind CSS", level: 9, color: "#06B6D4" },
        { name: "Angular", level: 6, color: "#DD0031" },
      ],
    },
    {
      name: "Backend Development",
      skills: [
        { name: "Node.js", level: 9, color: "#339933" },
        { name: "Python", level: 8, color: "#3776AB" },
        { name: "Django", level: 8, color: "#092E20" },
        { name: "FastAPI", level: 7, color: "#009688" },
        { name: "Express.js", level: 9, color: "#000000" },
        { name: "Spring Boot", level: 6, color: "#6DB33F" },
      ],
    },
    {
      name: "Database & Cloud",
      skills: [
        { name: "PostgreSQL", level: 8, color: "#336791" },
        { name: "MongoDB", level: 7, color: "#47A248" },
        { name: "AWS", level: 8, color: "#FF9900" },
        { name: "Docker", level: 8, color: "#2496ED" },
        { name: "Kubernetes", level: 6, color: "#326CE5" },
        { name: "Redis", level: 7, color: "#DC382D" },
      ],
    },
    {
      name: "AI & Machine Learning",
      skills: [
        { name: "TensorFlow", level: 7, color: "#FF6F00" },
        { name: "PyTorch", level: 6, color: "#EE4C2C" },
        { name: "scikit-learn", level: 8, color: "#F7931E" },
        { name: "OpenAI APIs", level: 8, color: "#412991" },
        { name: "Hugging Face", level: 7, color: "#FFD21E" },
      ],
    },
  ] as SkillCategory[],

  education: [
    {
      degree: "PhD in Computer Science",
      institution: "University Name",
      year: "2023",
      description:
        "Specialization in Digital Health Solutions and AI applications in Healthcare. Research focus on software engineering methodologies for health technology.",
      status: "completed",
    },
    {
      degree: "Master of Science in Software Engineering",
      institution: "University Name",
      year: "2019",
      description:
        "Advanced studies in software architecture, distributed systems, and modern development methodologies.",
      status: "completed",
    },
    {
      degree: "Bachelor of Engineering in Computer Science",
      institution: "University Name",
      year: "2017",
      description:
        "Foundation in computer science principles, programming, and software development.",
      status: "completed",
    },
  ] as Education[],

  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Company",
      duration: "2022 - Present",
      description: [
        "Led development of scalable web applications serving 100K+ users",
        "Architected microservices infrastructure reducing response time by 40%",
        "Mentored junior developers and established coding best practices",
        "Collaborated with cross-functional teams to deliver high-quality products",
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    },
    {
      title: "Full Stack Developer",
      company: "Healthcare Startup",
      duration: "2020 - 2022",
      description: [
        "Developed AI-powered healthcare solutions improving patient outcomes",
        "Built real-time data processing systems handling medical records",
        "Implemented secure authentication and data encryption protocols",
        "Created responsive web applications with modern UI/UX practices",
      ],
      technologies: ["Python", "Django", "React", "PostgreSQL", "TensorFlow"],
    },
    {
      title: "Research Assistant",
      company: "University Research Lab",
      duration: "2018 - 2020",
      description: [
        "Conducted research on digital health technologies and AI applications",
        "Published papers in peer-reviewed international conferences",
        "Developed prototypes for healthcare technology solutions",
        "Collaborated with medical professionals on technology integration",
      ],
      technologies: ["Python", "Machine Learning", "Data Analysis", "Research"],
    },
  ] as Experience[],

  projects: [
    {
      name: "AI-Powered Healthcare Dashboard",
      description:
        "Real-time healthcare analytics platform with predictive insights for patient care optimization.",
      technologies: ["React", "Python", "TensorFlow", "PostgreSQL", "AWS"],
      link: "https://github.com/suresh/healthcare-dashboard",
    },
    {
      name: "Portfolio Website with AI Chatbot",
      description:
        "Modern portfolio website featuring an intelligent chatbot for visitor interaction and lead generation.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      link: "https://sureshmukhiya.com",
    },
    {
      name: "Open Source Development Tools",
      description:
        "Collection of developer productivity tools and libraries used by the open source community.",
      technologies: ["Node.js", "TypeScript", "CLI Tools", "NPM"],
      link: "https://github.com/suresh/dev-tools",
    },
  ] as Project[],

  research: [
    {
      title: "AI Applications in Digital Health: A Comprehensive Survey",
      journal: "Journal of Medical Internet Research",
      year: "2023",
      authors: ["Suresh Kumar Mukhiya", "Co-Author Name"],
      link: "https://doi.org/example",
    },
    {
      title: "Software Engineering Methodologies for Healthcare Technology",
      journal: "IEEE Software",
      year: "2022",
      authors: ["Suresh Kumar Mukhiya", "Research Team"],
      link: "https://doi.org/example",
    },
  ] as ResearchPaper[],

  contact: {
    email: "suresh@example.com",
    linkedin: "https://linkedin.com/in/sureshmukhiya",
    github: "https://github.com/sureshmukhiya",
    website: "https://sureshmukhiya.com",
  },
};

// Predefined Q&A system
export const predefinedQA = {
  "What are Suresh's technical skills?": {
    type: "skills",
    data: portfolioData.skills,
    textResponse:
      "Here are my technical skills across different domains. I'm passionate about full-stack development with particular expertise in React, Node.js, and AI technologies.",
  },
  "Tell me about Suresh's educational background": {
    type: "education",
    data: portfolioData.education,
    textResponse:
      "I hold a PhD in Computer Science with specialization in Digital Health Solutions. My academic journey has been focused on bridging technology and healthcare.",
  },
  "What is Suresh's professional experience?": {
    type: "experience",
    data: portfolioData.experience,
    textResponse:
      "I have over 5 years of professional experience as a Senior Software Engineer, with a strong background in healthcare technology and full-stack development.",
  },
  "What projects has Suresh worked on?": {
    type: "projects",
    data: portfolioData.projects,
    textResponse:
      "I've worked on various exciting projects ranging from AI-powered healthcare solutions to open-source development tools. Each project showcases different aspects of my technical expertise.",
  },
  "What research has Suresh done?": {
    type: "research",
    data: portfolioData.research,
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
        "💼 5+ years as Senior Software Engineer",
        "🔬 Published researcher in digital health",
        "🚀 Full-stack development expert",
        "🤖 AI and machine learning enthusiast",
      ],
    },
    textResponse:
      "I'm a technology professional who bridges the gap between academic research and practical software development, with a special focus on healthcare technology and AI applications.",
  },
};

// Enhanced response generation
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
  // Check for exact match with predefined questions
  const exactMatch = predefinedQA[query as keyof typeof predefinedQA];
  if (exactMatch) {
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
          value.type === category ||
          (category === "background" && value.type === "overview")
      );

      if (matchingQA) {
        const [, qaData] = matchingQA;
        return {
          type: "predefined",
          response: qaData.textResponse,
          data: qaData,
          followUpQuestions: getFollowUpQuestions(qaData.type),
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
export const suggestedQuestions = Object.keys(predefinedQA);
