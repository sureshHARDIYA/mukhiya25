"use client";

import { ChatHistory } from "./types";

const CHAT_HISTORY_KEY = "chatHistory";
const MAX_CHAT_HISTORY = 5;

export class ChatStorage {
  static loadChatHistory(): ChatHistory[] {
    if (typeof window === "undefined") return [];

    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!savedHistory) return [];

      const parsed: unknown[] = JSON.parse(savedHistory);
      return parsed.map((chat: unknown) => {
        const chatObj = chat as {
          id: string;
          title: string;
          lastUpdated: string;
          messages: Array<{
            id: number;
            text: string;
            isUser: boolean;
            timestamp: string;
          }>;
        };

        return {
          ...chatObj,
          lastUpdated: new Date(chatObj.lastUpdated),
          messages: chatObj.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        };
      });
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  }

  static saveChatHistory(history: ChatHistory[]): void {
    if (typeof window === "undefined") return;

    try {
      const limitedHistory = history.slice(0, MAX_CHAT_HISTORY);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }

  static clearChatHistory(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  }

  static generateChatTitle(firstMessage: string): string {
    return firstMessage.length > 30
      ? firstMessage.substring(0, 30) + "..."
      : firstMessage;
  }
}
