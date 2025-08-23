// lib/intent-detector.ts
import nlp from "compromise";
import keywordExtractor from "keyword-extractor";

export interface IntentResult {
  intent: string;
  confidence: number;
  entities: {
    people: string[];
    places: string[];
    topics: string[];
  };
  keywords: string[];
  originalQuery: string;
}

export interface IntentPattern {
  name: string;
  keywords: string[];
  phrases: string[];
  nlpChecks: ((doc: { has: (pattern: string) => boolean }) => boolean)[];
  weight: number;
}

// Define intent patterns for portfolio chatbot
const INTENT_PATTERNS: IntentPattern[] = [
  {
    name: "SKILLS_INQUIRY",
    keywords: [
      "skill",
      "technology",
      "tech",
      "programming",
      "language",
      "framework",
      "tool",
      "expertise",
      "proficient",
      "know",
      "use",
    ],
    phrases: [
      "what technologies",
      "programming languages",
      "technical skills",
      "what can you do",
      "tech stack",
    ],
    nlpChecks: [
      (doc) => doc.has("skill") || doc.has("technology"),
      (doc) => doc.has("#Skill") || doc.has("#Technology"),
      (doc) => doc.has("(what|which) #Person (know|use|good)"),
    ],
    weight: 1.2,
  },
  {
    name: "EXPERIENCE_INQUIRY",
    keywords: [
      "experience",
      "work",
      "job",
      "career",
      "professional",
      "company",
      "role",
      "position",
      "employment",
      "background",
    ],
    phrases: [
      "work experience",
      "professional background",
      "job history",
      "where worked",
      "career path",
    ],
    nlpChecks: [
      (doc) => doc.has("experience") || doc.has("work"),
      (doc) => doc.has("#Person #Verb #Work"),
      (doc) => doc.has("(where|what) #Person (work|worked|job)"),
    ],
    weight: 1.2,
  },
  {
    name: "EDUCATION_INQUIRY",
    keywords: [
      "education",
      "degree",
      "phd",
      "university",
      "college",
      "academic",
      "study",
      "qualification",
      "school",
      "graduate",
    ],
    phrases: [
      "educational background",
      "academic qualification",
      "university degree",
      "phd research",
    ],
    nlpChecks: [
      (doc) => doc.has("education") || doc.has("degree") || doc.has("phd"),
      (doc) => doc.has("#Education") || doc.has("#University"),
      (doc) => doc.has("(where|what) #Person (study|studied|graduate)"),
    ],
    weight: 1.1,
  },
  {
    name: "PROJECT_INQUIRY",
    keywords: [
      "project",
      "built",
      "created",
      "developed",
      "portfolio",
      "github",
      "repo",
      "application",
      "website",
      "app",
    ],
    phrases: [
      "projects worked on",
      "things built",
      "portfolio projects",
      "github projects",
      "what built",
    ],
    nlpChecks: [
      (doc) => doc.has("project") || doc.has("built") || doc.has("created"),
      (doc) => doc.has("#Person #Verb #Create"),
      (doc) => doc.has("(what|show) #Person (built|made|created|developed)"),
    ],
    weight: 1.2,
  },
  {
    name: "RESEARCH_INQUIRY",
    keywords: [
      "research",
      "paper",
      "publication",
      "academic",
      "study",
      "findings",
      "thesis",
      "dissertation",
      "conference",
    ],
    phrases: [
      "research work",
      "published papers",
      "academic research",
      "research findings",
    ],
    nlpChecks: [
      (doc) =>
        doc.has("research") || doc.has("paper") || doc.has("publication"),
      (doc) => doc.has("#Research") || doc.has("#Academic"),
      (doc) => doc.has("(what|show) #Person (research|published|wrote)"),
    ],
    weight: 1.1,
  },
  {
    name: "CONTACT_INQUIRY",
    keywords: [
      "contact",
      "email",
      "reach",
      "connect",
      "hire",
      "availability",
      "get in touch",
      "message",
    ],
    phrases: [
      "how to contact",
      "get in touch",
      "hire you",
      "email address",
      "contact information",
    ],
    nlpChecks: [
      (doc) => doc.has("contact") || doc.has("email") || doc.has("hire"),
      (doc) => doc.has("(how|can) #Person (contact|reach|hire)"),
      (doc) => doc.has("get in touch"),
    ],
    weight: 1.0,
  },
  {
    name: "OVERVIEW_INQUIRY",
    keywords: [
      "about",
      "who",
      "background",
      "introduction",
      "biography",
      "profile",
      "overview",
      "summary",
    ],
    phrases: [
      "tell me about",
      "who are you",
      "about yourself",
      "background information",
      "brief overview",
    ],
    nlpChecks: [
      (doc) => doc.has("about") || doc.has("who"),
      (doc) => doc.has("(tell|who|what) #Person"),
      (doc) => doc.has("about (you|yourself|suresh)"),
    ],
    weight: 0.8,
  },
];

export function analyzeIntent(query: string): IntentResult {
  const queryLower = query.toLowerCase();
  const doc = nlp(query);

  // Extract entities using compromise.js
  const people = doc.people().out("array");
  const places = doc.places().out("array");
  const topics = doc.topics().out("array");

  // Extract keywords using keyword-extractor
  const keywords = keywordExtractor.extract(query, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  let bestIntent = "GENERAL_INQUIRY";
  let maxScore = 0;
  const intentScores: { [key: string]: number } = {};

  // Calculate scores for each intent pattern
  for (const pattern of INTENT_PATTERNS) {
    let score = 0;

    // Keyword matching
    const keywordMatches = pattern.keywords.filter((keyword) =>
      queryLower.includes(keyword)
    ).length;
    score += (keywordMatches / pattern.keywords.length) * 0.4;

    // Phrase matching
    const phraseMatches = pattern.phrases.filter((phrase) =>
      queryLower.includes(phrase.toLowerCase())
    ).length;
    score += (phraseMatches / pattern.phrases.length) * 0.3;

    // NLP checks
    const nlpMatches = pattern.nlpChecks.filter((check) => {
      try {
        return check(doc);
      } catch {
        return false;
      }
    }).length;
    score += (nlpMatches / pattern.nlpChecks.length) * 0.3;

    // Apply weight
    score *= pattern.weight;

    intentScores[pattern.name] = score;

    if (score > maxScore) {
      maxScore = score;
      bestIntent = pattern.name;
    }
  }

  // If no strong match found, keep as general inquiry
  if (maxScore < 0.3) {
    bestIntent = "GENERAL_INQUIRY";
    maxScore = 0.5; // Default confidence for general inquiries
  }

  console.log("Intent Analysis:", {
    query,
    scores: intentScores,
    bestIntent,
    confidence: maxScore,
  });

  return {
    intent: bestIntent,
    confidence: maxScore,
    entities: { people, places, topics },
    keywords,
    originalQuery: query,
  };
}

// Helper function to get intent suggestions based on current intent
export function getIntentSuggestions(currentIntent: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    SKILLS_INQUIRY: [
      "What projects has Suresh worked on?",
      "Tell me about Suresh's experience",
      "What is Suresh's educational background?",
    ],
    EXPERIENCE_INQUIRY: [
      "What are Suresh's technical skills?",
      "What projects has Suresh built?",
      "What research has Suresh done?",
    ],
    EDUCATION_INQUIRY: [
      "What is Suresh's professional experience?",
      "What research has Suresh published?",
      "What are Suresh's technical skills?",
    ],
    PROJECT_INQUIRY: [
      "What technologies does Suresh use?",
      "Tell me about Suresh's work experience",
      "How can I contact Suresh?",
    ],
    RESEARCH_INQUIRY: [
      "What is Suresh's educational background?",
      "What projects has Suresh worked on?",
      "What are Suresh's technical skills?",
    ],
    CONTACT_INQUIRY: [
      "Tell me about Suresh's background",
      "What projects has Suresh built?",
      "What are Suresh's technical skills?",
    ],
    OVERVIEW_INQUIRY: [
      "What are Suresh's technical skills?",
      "What is Suresh's professional experience?",
      "What projects has Suresh worked on?",
    ],
    GENERAL_INQUIRY: [
      "Tell me about Suresh's background",
      "What are Suresh's technical skills?",
      "What projects has Suresh worked on?",
    ],
  };

  return suggestions[currentIntent] || suggestions["GENERAL_INQUIRY"];
}
