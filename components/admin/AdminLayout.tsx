"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Users,
  BookOpen,
  Briefcase,
  Code,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut?: () => void;
  user?: User;
}

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: Users },
  { id: "personal", label: "Personal Info", icon: Settings },
  { id: "skills", label: "Skills", icon: Code },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FileText },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "intents", label: "Intents", icon: MessageSquare },
  { id: "responses", label: "Responses", icon: MessageSquare },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onSignOut,
  user,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      // Default behavior - reload page to reset auth state
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>

              <nav className="px-3">
                <div className="space-y-1">
                  {adminTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onTabChange(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors
                          ${
                            activeTab === tab.id
                              ? "bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }
                        `}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Mobile user info */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.email || "admin@portfolio.com"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              {/* Prominent mobile logout button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="flex flex-col h-screen">
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>

            <div className="flex-1 pt-6 pb-4 overflow-y-auto">
              <nav className="px-3">
                <div className="space-y-1">
                  {adminTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-all duration-200
                          ${
                            activeTab === tab.id
                              ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            activeTab === tab.id
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Desktop user info */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.email || "admin@portfolio.com"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              {/* Prominent logout button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <div className="flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-b-0 lg:shadow-sm">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold leading-7 text-gray-900 truncate">
                {adminTabs.find((tab) => tab.id === activeTab)?.label ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="ml-4 flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
