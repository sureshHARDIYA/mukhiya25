// components/chatbot/EducationTimeline.tsx
"use client";

import React from "react";
import { Education } from "@/lib/portfolio-chatbot";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({
  education,
}: EducationTimelineProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <GraduationCap className="w-5 h-5 text-green-600 mr-3" />
        Educational Journey
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-300 dark:bg-green-600"></div>

        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full ${
                    edu.status === "completed"
                      ? "bg-green-500"
                      : "bg-blue-500 animate-pulse"
                  }`}
                ></div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {edu.degree}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                    <Calendar className="w-4 h-4 mr-1" />
                    {edu.year}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {edu.institution}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {edu.description}
                </p>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      edu.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {edu.status === "completed"
                      ? "✓ Completed"
                      : "📚 In Progress"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🎓 Academic excellence with focus on practical applications
        </p>
      </div>
    </div>
  );
}
