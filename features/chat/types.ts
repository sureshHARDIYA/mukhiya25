export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  data?: Record<string, unknown>;
  followUpQuestions?: string[];
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

export interface PredefinedPrompt {
  id: string;
  text: string;
  category?: string;
}
