"use client";

import { MessageSquare, Trash2, X, MoreVertical } from "lucide-react";
import { ChatHistory } from "../types";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onNewChat: () => void;
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClearHistory: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  chatHistory,
  currentChatId,
  onNewChat,
  onLoadChat,
  onDeleteChat,
  onClearHistory,
}: SidebarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    if (showClearConfirm) {
      onClearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          chatHistory.length === 0 ? "lg:hidden" : ""
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chat History
          </h2>
          <div className="flex items-center gap-2">
            {chatHistory.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowClearConfirm(!showClearConfirm)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showClearConfirm && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 min-w-48 z-10">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 px-2">
                      Clear all chat history?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearHistory}
                        className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-sm rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={onNewChat}
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
                  onClick={() => onLoadChat(chat.id)}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate pr-6">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {chat.messages.length} messages
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
