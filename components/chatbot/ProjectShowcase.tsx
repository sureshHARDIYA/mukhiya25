// components/chatbot/ProjectShowcase.tsx
"use client";

import React from "react";
import { Project } from "@/lib/portfolio-chatbot";
import { ExternalLink, Github, Code2 } from "lucide-react";

interface ProjectShowcaseProps {
  projects: Project[];
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Code2 className="w-5 h-5 text-orange-600 mr-3" />
        Featured Projects
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                {project.name}
              </h4>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Technologies
              </h5>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.link && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                >
                  <Github className="w-4 h-4 mr-1" />
                  View Project
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🚀 Building innovative solutions that make a real-world impact
        </p>
      </div>
    </div>
  );
}
