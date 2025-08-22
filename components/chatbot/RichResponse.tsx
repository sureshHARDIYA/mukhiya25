// components/chatbot/RichResponse.tsx
"use client";

import React from "react";
import {
  SkillCategory,
  Education,
  Experience,
  Project,
  ResearchPaper,
} from "@/lib/portfolio-chatbot";
import SkillsChart from "./SkillsChart";
import EducationTimeline from "./EducationTimeline";
import ExperienceCards from "./ExperienceCards";
import ProjectShowcase from "./ProjectShowcase";
import { User, Award, BookOpen } from "lucide-react";

interface RichResponseProps {
  responseData: {
    type: string;
    data:
      | SkillCategory[]
      | Education[]
      | Experience[]
      | Project[]
      | ResearchPaper[]
      | { summary: string; highlights: string[] };
    textResponse: string;
  };
}

export default function RichResponse({ responseData }: RichResponseProps) {
  const { type, data, textResponse } = responseData;

  const renderOverview = (data: { summary: string; highlights: string[] }) => (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <User className="w-5 h-5 text-indigo-600 mr-3" />
        About Suresh Kumar Mukhiya
      </h3>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {data.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-indigo-500">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🌟 Bridging the gap between research and practical applications
        </p>
      </div>
    </div>
  );

  const renderResearch = (papers: ResearchPaper[]) => (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <BookOpen className="w-5 h-5 text-teal-600 mr-3" />
        Research Publications
      </h3>

      <div className="space-y-4">
        {papers.map((paper, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {paper.title}
            </h4>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <p className="text-teal-600 dark:text-teal-400 font-medium">
                {paper.journal}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {paper.year}
              </span>
            </div>

            <div className="flex items-center mb-3">
              <Award className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Authors: {paper.authors.join(", ")}
              </span>
            </div>

            {paper.link && (
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                📄 View Publication
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📚 Contributing to the advancement of digital health and AI research
        </p>
      </div>
    </div>
  );

  // Render the appropriate component based on type
  switch (type) {
    case "skills":
      return <SkillsChart skills={data as SkillCategory[]} />;

    case "education":
      return <EducationTimeline education={data as Education[]} />;

    case "experience":
      return <ExperienceCards experience={data as Experience[]} />;

    case "projects":
      return <ProjectShowcase projects={data as Project[]} />;

    case "research":
      return renderResearch(data as ResearchPaper[]);

    case "overview":
      return renderOverview(data as { summary: string; highlights: string[] });

    default:
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 my-4">
          <p className="text-gray-700 dark:text-gray-300">{textResponse}</p>
        </div>
      );
  }
}
