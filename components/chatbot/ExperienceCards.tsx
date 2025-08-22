// components/chatbot/ExperienceCards.tsx
"use client";

import React from "react";
import { Experience } from "@/lib/portfolio-chatbot";
import { Briefcase, Calendar, Code } from "lucide-react";

interface ExperienceCardsProps {
  experience: Experience[];
}

export default function ExperienceCards({ experience }: ExperienceCardsProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Briefcase className="w-5 h-5 text-purple-600 mr-3" />
        Professional Experience
      </h3>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {exp.title}
                </h4>
                <p className="text-lg text-purple-600 dark:text-purple-400 font-medium">
                  {exp.company}
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                <Calendar className="w-4 h-4 mr-1" />
                {exp.duration}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Achievements:
              </h5>
              <ul className="space-y-1">
                {exp.description.map((desc, descIndex) => (
                  <li
                    key={descIndex}
                    className="text-sm text-gray-600 dark:text-gray-300 flex items-start"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Code className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Technologies Used:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💼 5+ years of professional experience in cutting-edge technologies
        </p>
      </div>
    </div>
  );
}
