// Typing animation component to simulate bot thinking
"use client";

import React from "react";

interface TypingIndicatorProps {
  className?: string;
}

export default function TypingIndicator({
  className = "",
}: TypingIndicatorProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
      <span className="text-gray-500 text-sm ml-2">Bot is thinking...</span>
    </div>
  );
}
