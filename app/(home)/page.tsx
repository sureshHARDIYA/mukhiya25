"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Bot, Send, User, MessageSquare, Trash2, X } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

const predefinedPrompts = [
  "Tell me about your academic background",
  "What are your research interests?",
  "What programming languages do you know?",
  "What projects have you worked on?",
  "Tell me about your professional experience",
  "What are your current goals?",
];

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          const historyWithDates = parsed.map((chat: any) => ({
            ...chat,
            lastUpdated: new Date(chat.lastUpdated),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          setChatHistory(historyWithDates);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Create or update chat history
    let chatId = currentChatId;
    if (!chatId) {
      chatId = `chat-${Date.now()}`;
      setCurrentChatId(chatId);
    }

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: "Thanks for your question! I'll help you learn more about Suresh Kumar Mukhiya. This is a placeholder response - we'll implement the AI API soon.",
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);

      // Update chat history
      const chatTitle =
        message.length > 30 ? message.substring(0, 30) + "..." : message;

      const updatedChat: ChatHistory = {
        id: chatId!,
        title: chatTitle,
        messages: finalMessages,
        lastUpdated: new Date(),
      };

      const newHistory = [
        updatedChat,
        ...chatHistory.filter((c) => c.id !== chatId),
      ].slice(0, 5);
      setChatHistory(newHistory);

      if (typeof window !== "undefined") {
        localStorage.setItem("chatHistory", JSON.stringify(newHistory));
      }
    }, 1000);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setMessages([]);
    setCurrentChatId(null);
    setSidebarOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatHistory");
    }
  };

  // Hide sidebar when no chat history
  const shouldShowSidebar = chatHistory.length > 0 || sidebarOpen;

  return (
    <div className="flex h-screen max-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar - only show if there's chat history or explicitly opened */}
      {shouldShowSidebar && (
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:w-64 lg:flex-shrink-0 ${
            chatHistory.length === 0 ? "lg:hidden" : ""
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat History
            </h2>
            <div className="flex items-center gap-2">
              {chatHistory.length > 0 && (
                <button
                  onClick={clearChatHistory}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  title="Clear all chat history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                setMessages([]);
                setCurrentChatId(null);
                setSidebarOpen(false);
              }}
              className="w-full p-3 text-left bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatHistory.length > 0 ? (
              <div className="px-4 pb-4 space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      currentChatId === chat.id
                        ? "bg-blue-100 dark:bg-blue-900/20 border-l-2 border-blue-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      const selectedChat = chatHistory.find(
                        (c) => c.id === chat.id
                      );
                      if (selectedChat) {
                        setMessages(selectedChat.messages);
                        setCurrentChatId(chat.id);
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate pr-6">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {chat.messages.length} messages
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No chat history yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header - only show if there's chat history */}
        {chatHistory.length > 0 && (
          <div className="lg:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              Ask me about Suresh
            </h1>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Area - takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-4xl mx-auto w-full flex flex-col">
              {/* Welcome Screen - shown when no messages */}
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                      Ask me about Suresh
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      I&apos;m here to help you learn about Suresh Kumar
                      Mukhiya&apos;s background, experience, and expertise.
                    </p>
                  </div>

                  {/* Predefined Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {predefinedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt)}
                        className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-xl hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group bg-white dark:bg-gray-800/50"
                      >
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Container */}
              {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-6">
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
                  {/* Invisible element for auto-scrolling */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Fixed Input Section - Always at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSendMessage(inputValue)
                  }
                  placeholder="Ask me anything about Suresh..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Suggested prompts - Always show when there are messages */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {predefinedPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-full hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
