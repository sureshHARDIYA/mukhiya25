// components/chatbot/SkillsChart.tsx
"use client";

import React from "react";
import { SkillCategory } from "@/lib/portfolio-chatbot";

interface SkillsChartProps {
  skills: SkillCategory[];
}

export default function SkillsChart({ skills }: SkillsChartProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
        Technical Skills Overview
      </h3>

      <div className="space-y-6">
        {skills.map((category) => (
          <div
            key={category.name}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {category.name}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.skills.map((skill) => (
                <div key={skill.name} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.level}/10
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.level * 10}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Skill levels are based on years of experience and project
          complexity
        </p>
      </div>
    </div>
  );
}
