"use client";

import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  predefinedPrompts: string[];
  onPromptClick: (prompt: string) => void;
  hasMessages: boolean;
}

export function ChatInput({
  onSendMessage,
  predefinedPrompts,
  onPromptClick,
  hasMessages,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Suresh..."
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[50px] max-h-32"
            style={{
              height: "auto",
              minHeight: "50px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested prompts when messages exist */}
        {hasMessages && (
          <div className="flex flex-wrap gap-2 mt-3">
            {predefinedPrompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(prompt)}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-full hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
