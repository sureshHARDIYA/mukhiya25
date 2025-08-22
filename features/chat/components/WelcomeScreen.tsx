"use client";

import { Bot } from "lucide-react";

interface WelcomeScreenProps {
  predefinedPrompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function WelcomeScreen({
  predefinedPrompts,
  onPromptClick,
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Ask me about Suresh
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          I&apos;m here to help you learn about Suresh Kumar Mukhiya&apos;s
          background, experience, and expertise.
        </p>
      </div>

      {/* Predefined Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {predefinedPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group bg-white dark:bg-gray-800/50"
          >
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
