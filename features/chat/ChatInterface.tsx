"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { ChatMessage, ChatHistory } from "./types";
import { ChatStorage } from "./storage";
import { Sidebar } from "./components/Sidebar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";

const predefinedPrompts = [
  "Tell me about your academic background",
  "What are your research interests?",
  "What programming languages do you know?",
  "What projects have you worked on?",
  "Tell me about your professional experience",
  "What are your current goals?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const history = ChatStorage.loadChatHistory();
    setChatHistory(history);
  }, []);

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter((c) => c.id !== chatId);
    ChatStorage.saveChatHistory(updatedHistory);
    setChatHistory(updatedHistory);

    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const clearChatHistory = () => {
    ChatStorage.clearChatHistory();
    setChatHistory([]);
    startNewChat();
  };

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

    // Create or update chat history
    let chatId = currentChatId;
    if (!chatId) {
      chatId = `chat-${Date.now()}`;
      setCurrentChatId(chatId);
    }

    // Simulate bot response (we'll implement API later)
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
      const existingChatIndex = chatHistory.findIndex((c) => c.id === chatId);
      const chatTitle =
        messages.length === 0
          ? ChatStorage.generateChatTitle(message)
          : existingChatIndex >= 0
          ? chatHistory[existingChatIndex].title
          : ChatStorage.generateChatTitle(message);

      const updatedChat: ChatHistory = {
        id: chatId!,
        title: chatTitle,
        messages: finalMessages,
        lastUpdated: new Date(),
      };

      let newHistory: ChatHistory[];
      if (existingChatIndex >= 0) {
        newHistory = [...chatHistory];
        newHistory[existingChatIndex] = updatedChat;
      } else {
        newHistory = [updatedChat, ...chatHistory].slice(0, 5); // Keep only last 5 chats
      }

      ChatStorage.saveChatHistory(newHistory);
      setChatHistory(newHistory);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Hide sidebar when no chat history and not explicitly opened
  const shouldShowSidebar = chatHistory.length > 0 || sidebarOpen;

  return (
    <div className="flex h-full max-h-screen bg-white dark:bg-gray-900">
      {/* Only render sidebar if there's chat history or it's explicitly opened */}
      {shouldShowSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onNewChat={startNewChat}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
          onClearHistory={clearChatHistory}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - only show hamburger if there's chat history */}
        {chatHistory.length > 0 && (
          <div className="lg:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            <WelcomeScreen
              predefinedPrompts={predefinedPrompts}
              onPromptClick={handlePromptClick}
            />
          ) : (
            <MessageList messages={messages} />
          )}

          <ChatInput
            onSendMessage={handleSendMessage}
            predefinedPrompts={predefinedPrompts}
            onPromptClick={handlePromptClick}
            hasMessages={messages.length > 0}
          />
        </div>
      </main>
    </div>
  );
}
