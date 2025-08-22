"use client";

import { Bot, User } from "lucide-react";
import { ChatMessage } from "../types";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${
            message.isUser ? "justify-end" : "justify-start"
          }`}
        >
          {!message.isUser && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}

          <div
            className={`max-w-3xl rounded-2xl px-4 py-3 ${
              message.isUser
                ? "bg-blue-500 text-white ml-12"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
            <p className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {message.isUser && (
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
