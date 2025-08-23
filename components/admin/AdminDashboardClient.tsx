"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/logout/actions";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { PersonalInfoManager } from "@/components/admin/PersonalInfoManager";
import { EducationManager } from "@/components/admin/EducationManager";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { ResearchManager } from "@/components/admin/ResearchManager";

interface AdminDashboardClientProps {
  user: User;
}

const AdminDashboard = ({ user }: { user: User }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Welcome back, {user.email}!
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your portfolio content, chatbot responses, and analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">5</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Skill Categories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Frontend, Backend, Database, AI/ML, Cloud
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">4</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Featured Projects
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Active portfolio showcases
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">8</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chatbot Intents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Configured response patterns
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntentsManager = () => <div>Intents Manager - Coming Soon</div>;

const ResponsesManager = () => <div>Responses Manager - Coming Soon</div>;

export function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSignOut = async () => {
    await logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard user={user} />;
      case "personal":
        return <PersonalInfoManager />;
      case "skills":
        return <SkillsManager />;
      case "education":
        return <EducationManager />;
      case "experience":
        return <ExperienceManager />;
      case "projects":
        return <ProjectsManager />;
      case "research":
        return <ResearchManager />;
      case "intents":
        return <IntentsManager />;
      case "responses":
        return <ResponsesManager />;
      default:
        return <AdminDashboard user={user} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSignOut={handleSignOut}
      user={user}
    >
      {renderContent()}
    </AdminLayout>
  );
}
