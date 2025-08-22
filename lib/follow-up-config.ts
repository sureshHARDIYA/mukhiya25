// Follow-up Questions Configuration Helper
// This file makes it easy to manage and customize follow-up questions for different response types

// Follow-up Questions Configuration Helper with Answer Mapping
// This file makes it easy to manage follow-up questions AND their answers

export interface FollowUpQuestion {
  question: string;
  answer: string;
  responseType?:
    | "text"
    | "skills"
    | "education"
    | "experience"
    | "projects"
    | "research"
    | "overview";
  data?: unknown; // For rich responses
}

export interface FollowUpConfig {
  [key: string]: {
    questions: FollowUpQuestion[];
    description: string;
  };
}

export const followUpConfig: FollowUpConfig = {
  skills: {
    description: "Questions about technical skills and expertise",
    questions: [
      {
        question: "Which programming language are you most proficient in?",
        answer:
          "I'm most proficient in TypeScript and JavaScript. I've been working with them for over 5 years and use them daily for both frontend and backend development. I particularly love TypeScript's type safety and how it scales with large applications.",
        responseType: "text",
      },
      {
        question: "How many years of experience do you have with React?",
        answer:
          "I have 4+ years of experience with React, starting from class components to modern hooks and server components. I've built everything from small SPAs to large-scale applications with complex state management using Redux and Zustand.",
        responseType: "text",
      },
      {
        question: "What's your favorite technology to work with?",
        answer:
          "My favorite technology stack is Next.js with TypeScript and Tailwind CSS. This combination gives me the perfect balance of developer experience, performance, and design flexibility. The App Router in Next.js 13+ has been a game-changer for building modern web applications.",
        responseType: "text",
      },
      {
        question: "Do you have experience with cloud platforms?",
        answer:
          "Yes, I have extensive experience with AWS and some experience with Vercel and Netlify. I've deployed applications using EC2, Lambda functions, S3 for storage, and RDS for databases. I also love Vercel for its seamless Next.js deployment experience.",
        responseType: "text",
      },
      {
        question: "What's your preferred development environment?",
        answer:
          "I use VS Code as my primary editor with extensions like Prettier, ESLint, and GitLens. For terminal work, I prefer zsh with oh-my-zsh. I'm comfortable working on both macOS and Linux environments, and I use Git for version control with GitHub.",
        responseType: "text",
      },
      {
        question: "Have you worked with any AI/ML technologies?",
        answer:
          "Yes, I've worked with TensorFlow and Python for machine learning projects, particularly in healthcare data analysis. I've also integrated OpenAI's APIs and Hugging Face models into web applications for natural language processing tasks.",
        responseType: "text",
      },
      {
        question: "What testing frameworks do you use?",
        answer:
          "I use Jest and React Testing Library for unit and integration testing, Cypress for end-to-end testing, and Playwright for cross-browser testing. I believe in test-driven development and aim for good test coverage in all my projects.",
        responseType: "text",
      },
      {
        question: "How do you stay updated with new technologies?",
        answer:
          "I follow tech blogs, participate in developer communities on Twitter and Reddit, attend virtual conferences, and regularly read documentation. I also contribute to open-source projects and build side projects to experiment with new technologies.",
        responseType: "text",
      },
    ],
  },

  education: {
    description: "Questions about academic background and achievements",
    questions: [
      {
        question: "Tell me more about your PhD research",
        answer:
          "My PhD research focuses on AI applications in digital health, specifically on developing software engineering methodologies for healthcare technology. I'm exploring how machine learning can improve patient care while ensuring software reliability and security in clinical environments.",
        responseType: "text",
      },
      {
        question: "What was your master's thesis about?",
        answer:
          "My master's thesis was on 'Software Engineering Methodologies for Healthcare Systems'. I researched how to apply agile development practices specifically to healthcare software, considering regulatory requirements and patient safety concerns.",
        responseType: "text",
      },
      {
        question: "Which university did you attend?",
        answer:
          "I completed my PhD and Master's in Computer Science at a leading technical university, where I had the opportunity to work with renowned professors in software engineering and digital health research.",
        responseType: "text",
      },
      {
        question: "What academic achievements are you most proud of?",
        answer:
          "I'm most proud of publishing research papers in peer-reviewed journals and presenting at international conferences. I've also received academic excellence awards and had the opportunity to collaborate with healthcare professionals on real-world projects.",
        responseType: "text",
      },
      {
        question: "Do you have any teaching experience?",
        answer:
          "Yes, I've served as a teaching assistant for software engineering courses and have mentored undergraduate students in their thesis projects. I enjoy sharing knowledge and helping the next generation of developers learn best practices.",
        responseType: "text",
      },
      {
        question: "What was your graduation score?",
        answer:
          "I graduated with distinction, maintaining a high GPA throughout my academic journey. I was particularly strong in software engineering, algorithms, and research methodology courses.",
        responseType: "text",
      },
      {
        question:
          "Did you participate in any research projects during studies?",
        answer:
          "Yes, I participated in several research projects including healthcare technology innovation labs, open-source software development studies, and interdisciplinary projects with medical schools to understand real-world healthcare challenges.",
        responseType: "text",
      },
      {
        question: "What inspired you to pursue higher education?",
        answer:
          "I wanted to bridge the gap between academic research and practical software development, especially in healthcare. Higher education gave me the opportunity to conduct rigorous research while solving real-world problems through technology.",
        responseType: "text",
      },
    ],
  },

  experience: {
    description: "Questions about professional work experience",
    questions: [
      {
        question: "What was your most challenging project at work?",
        answer:
          "My most challenging project was developing a real-time healthcare analytics platform that needed to process patient data while maintaining HIPAA compliance. The technical challenges included handling large datasets, ensuring data security, and creating an intuitive interface for medical professionals.",
        responseType: "text",
      },
      {
        question:
          "How do you approach problem-solving in software development?",
        answer:
          "I start by thoroughly understanding the problem, breaking it down into smaller components, and researching existing solutions. I believe in prototyping quickly, testing early, and iterating based on feedback. I also value collaboration and often discuss solutions with team members.",
        responseType: "text",
      },
      {
        question: "What leadership responsibilities have you had?",
        answer:
          "As a Senior Software Engineer, I've led development teams of 3-5 developers, mentored junior developers, conducted code reviews, and was responsible for technical decision-making. I've also led cross-functional projects with designers and product managers.",
        responseType: "text",
      },
      {
        question: "Which company did you enjoy working at the most?",
        answer:
          "I've most enjoyed working at companies that focus on healthcare technology because I'm passionate about using technology to improve people's lives. The combination of technical challenges and meaningful impact makes the work particularly rewarding.",
        responseType: "text",
      },
      {
        question: "What technologies did you work with at your previous job?",
        answer:
          "In my recent roles, I've worked with React, Node.js, TypeScript, PostgreSQL, AWS services, Docker, and various testing frameworks. I've also worked with healthcare-specific technologies and standards like HL7 FHIR for health data interoperability.",
        responseType: "text",
      },
      {
        question: "How do you handle tight deadlines?",
        answer:
          "I prioritize tasks based on impact, communicate early about potential risks, and focus on delivering MVP functionality first. I believe in transparent communication with stakeholders about what's achievable within the timeline while maintaining code quality.",
        responseType: "text",
      },
      {
        question: "What's your experience with remote work?",
        answer:
          "I've successfully worked remotely for several years and have developed strong skills in asynchronous communication, time management, and virtual collaboration. I'm comfortable with remote-first workflows and tools like Slack, Zoom, and collaborative coding platforms.",
        responseType: "text",
      },
      {
        question: "Tell me about a time you mentored junior developers",
        answer:
          "I've mentored several junior developers by conducting regular 1:1s, providing detailed code reviews, and creating learning paths tailored to their goals. I enjoy helping them understand not just how to code, but how to think like a software engineer and make good technical decisions.",
        responseType: "text",
      },
    ],
  },

  projects: {
    description: "Questions about personal and professional projects",
    questions: [
      {
        question: "Which project are you most proud of?",
        answer:
          "I'm most proud of the AI-Powered Healthcare Dashboard because it combines my technical skills with my passion for healthcare technology. The project involved complex data visualization, real-time analytics, and had a direct positive impact on patient care efficiency.",
        responseType: "text",
      },
      {
        question: "What was the biggest technical challenge you faced?",
        answer:
          "The biggest challenge was implementing real-time data processing for a healthcare dashboard while ensuring data privacy and security. I had to design a system that could handle thousands of concurrent users while maintaining sub-second response times and HIPAA compliance.",
        responseType: "text",
      },
      {
        question: "Do you have any open source contributions?",
        answer:
          "Yes, I actively contribute to open-source projects, particularly in the React and TypeScript ecosystems. I've contributed bug fixes, new features, and documentation improvements. I also maintain a few small libraries related to healthcare data processing.",
        responseType: "text",
      },
      {
        question: "How do you choose technologies for new projects?",
        answer:
          "I consider factors like project requirements, team expertise, scalability needs, and long-term maintenance. I prefer mature, well-documented technologies with strong community support. I also consider the learning curve and whether the technology aligns with the project's goals.",
        responseType: "text",
      },
      {
        question: "What's your development workflow like?",
        answer:
          "I follow Git flow with feature branches, write tests before implementing features, use continuous integration, and conduct thorough code reviews. I believe in small, frequent commits with descriptive messages and maintaining comprehensive documentation.",
        responseType: "text",
      },
      {
        question: "Have you built any mobile applications?",
        answer:
          "Yes, I've built React Native applications and have experience with responsive web design that works seamlessly on mobile devices. I understand the unique challenges of mobile development including performance optimization and touch-first user interfaces.",
        responseType: "text",
      },
      {
        question: "What's the most complex system you've architected?",
        answer:
          "I architected a microservices-based healthcare platform that integrated with multiple hospital systems, handled real-time data streams, and supported thousands of concurrent users. The system required careful consideration of data consistency, security, and fault tolerance.",
        responseType: "text",
      },
      {
        question: "Do you have experience with DevOps and deployment?",
        answer:
          "Yes, I have experience with CI/CD pipelines using GitHub Actions, Docker containerization, AWS deployment, and infrastructure as code. I understand the importance of automated testing, staging environments, and zero-downtime deployments.",
        responseType: "text",
      },
    ],
  },

  research: {
    description: "Questions about academic research and publications",
    questions: [
      {
        question: "What inspired you to research digital health?",
        answer:
          "I was inspired by the potential to improve healthcare outcomes through technology. During my studies, I saw how software engineering principles could address real challenges in healthcare, from improving patient safety to making healthcare more accessible and efficient.",
        responseType: "text",
      },
      {
        question: "How many papers have you published?",
        answer:
          "I've published several papers in peer-reviewed journals and conferences, focusing on AI applications in digital health and software engineering methodologies for healthcare systems. Each publication represents months of rigorous research and collaboration.",
        responseType: "text",
      },
      {
        question: "Are you currently working on any research?",
        answer:
          "Yes, I'm currently researching how large language models can be safely and effectively integrated into healthcare software while maintaining privacy and ensuring clinical accuracy. I'm also exploring user experience design for healthcare professionals.",
        responseType: "text",
      },
      {
        question: "What's the impact of your research work?",
        answer:
          "My research has contributed to better understanding of how software engineering practices can be adapted for healthcare environments. Some of my work has been cited by other researchers and has influenced the development of healthcare technology standards.",
        responseType: "text",
      },
      {
        question: "Do you collaborate with other researchers?",
        answer:
          "Yes, I actively collaborate with researchers from computer science, medicine, and healthcare administration. Interdisciplinary collaboration is essential for creating technology solutions that truly meet healthcare needs and can be successfully adopted in clinical settings.",
        responseType: "text",
      },
      {
        question: "What research methodology do you prefer?",
        answer:
          "I prefer mixed-methods research that combines quantitative analysis with qualitative insights from healthcare professionals. This approach helps ensure that technical solutions are both statistically sound and practically useful in real-world healthcare settings.",
        responseType: "text",
      },
      {
        question: "Have you presented at any conferences?",
        answer:
          "Yes, I've presented at several international conferences on software engineering and digital health. Conference presentations are a great way to share research findings, get feedback from the community, and stay current with the latest developments in the field.",
        responseType: "text",
      },
      {
        question: "How do you balance research with practical development?",
        answer:
          "I believe research and practical development inform each other. My industry experience helps me identify relevant research questions, while my research background helps me make better technical decisions in development projects. Both perspectives make me a more effective technology professional.",
        responseType: "text",
      },
    ],
  },

  overview: {
    description: "Questions about personal background and career journey",
    questions: [
      {
        question: "What are your career goals?",
        answer:
          "My goal is to continue bridging the gap between cutting-edge technology and practical healthcare solutions. I want to lead teams that create software that genuinely improves people's lives, whether through better healthcare delivery or more accessible technology.",
        responseType: "text",
      },
      {
        question: "What motivates you in your work?",
        answer:
          "I'm motivated by the opportunity to use technology to solve meaningful problems. Whether it's improving healthcare outcomes, making software more accessible, or mentoring the next generation of developers, I find purpose in work that has a positive impact on people's lives.",
        responseType: "text",
      },
      {
        question: "How do you balance research and development?",
        answer:
          "I see research and development as complementary activities. Research helps me stay at the forefront of technology trends and think critically about problems, while practical development keeps me grounded in real-world constraints and user needs. Both make me more effective.",
        responseType: "text",
      },
      {
        question: "What's your approach to continuous learning?",
        answer:
          "I believe in learning through multiple channels: reading technical literature, building side projects, contributing to open source, attending conferences, and engaging with the developer community. I also learn a lot from mentoring others and explaining complex concepts.",
        responseType: "text",
      },
      {
        question: "What advice would you give to aspiring developers?",
        answer:
          "Focus on understanding fundamentals rather than just following tutorials. Build projects that solve real problems, contribute to open source, and don't be afraid to ask questions. Most importantly, remember that software development is as much about communication and problem-solving as it is about coding.",
        responseType: "text",
      },
      {
        question: "What's your work-life balance like?",
        answer:
          "I maintain a healthy work-life balance by setting clear boundaries, prioritizing efficiently, and making time for hobbies and relationships. I believe that rest and diverse experiences actually make me more creative and effective in my professional work.",
        responseType: "text",
      },
      {
        question: "How did you get started in tech?",
        answer:
          "I started programming during my undergraduate studies and was immediately fascinated by the power of code to solve complex problems. My interest in healthcare technology developed when I saw how software could make a real difference in people's lives beyond just business applications.",
        responseType: "text",
      },
      {
        question: "What are you passionate about outside of work?",
        answer:
          "Outside of work, I enjoy reading about technology trends, contributing to open-source projects, and occasionally writing technical blog posts. I also value time with family and friends, and I find that diverse interests help me bring fresh perspectives to my professional work.",
        responseType: "text",
      },
    ],
  },
};

// Helper function to get follow-up questions for a specific category
export function getFollowUpQuestions(
  category: string,
  count?: number
): string[] {
  const config = followUpConfig[category];
  if (!config) return [];

  const questions = config.questions.map((q) => q.question);
  if (count && count < questions.length) {
    // Return a random subset of questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  return questions;
}

// Helper function to get the answer for a specific question
export function getFollowUpAnswer(question: string): FollowUpQuestion | null {
  for (const category of Object.values(followUpConfig)) {
    const foundQuestion = category.questions.find(
      (q) => q.question === question
    );
    if (foundQuestion) {
      return foundQuestion;
    }
  }
  return null;
}

// Helper function to add custom follow-up questions
export function addFollowUpQuestion(
  category: string,
  questionText: string,
  answer: string = "This is a custom question that needs an answer."
): void {
  const newQuestion: FollowUpQuestion = {
    question: questionText,
    answer: answer,
    responseType: "text",
  };

  if (followUpConfig[category]) {
    followUpConfig[category].questions.push(newQuestion);
  } else {
    followUpConfig[category] = {
      description: `Custom questions for ${category}`,
      questions: [newQuestion],
    };
  }
}

// Helper function to remove a follow-up question
export function removeFollowUpQuestion(
  category: string,
  questionIndex: number
): void {
  if (
    followUpConfig[category] &&
    followUpConfig[category].questions[questionIndex]
  ) {
    followUpConfig[category].questions.splice(questionIndex, 1);
  }
}

// Helper function to update question answer
export function updateFollowUpAnswer(
  category: string,
  questionIndex: number,
  newAnswer: string
): void {
  if (
    followUpConfig[category] &&
    followUpConfig[category].questions[questionIndex]
  ) {
    followUpConfig[category].questions[questionIndex].answer = newAnswer;
  }
}

// Helper function to get all categories with their descriptions
export function getAllCategories(): Array<{
  category: string;
  description: string;
  questionCount: number;
}> {
  return Object.entries(followUpConfig).map(([category, config]) => ({
    category,
    description: config.description,
    questionCount: config.questions.length,
  }));
}

// Export default configuration for easy import
export default followUpConfig;
