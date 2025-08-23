// components/chatbot/ProjectShowcase.tsx
"use client";

import React from "react";
import { Project } from "@/lib/portfolio-chatbot";
import {
  ExternalLink,
  Github,
  Code2,
  Star,
  GitFork,
  Calendar,
} from "lucide-react";
import { getTechColor, formatDate } from "@/lib/github-service";

interface ProjectShowcaseProps {
  projects: Project[];
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Code2 className="w-5 h-5 text-orange-600 mr-3" />
        Featured Projects{" "}
        {projects.length > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            ({projects.length})
          </span>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                  {project.name}
                </h4>
                <div className="flex gap-1">
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-500 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      title="Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* GitHub Stats */}
              {(project.stars !== undefined || project.forks !== undefined) && (
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  {project.stars !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{project.stars}</span>
                    </div>
                  )}
                  {project.forks !== undefined && (
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{project.forks}</span>
                    </div>
                  )}
                  {project.lastUpdated && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(project.lastUpdated)}</span>
                    </div>
                  )}
                </div>
              )}

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
                      className="inline-block px-2 py-1 text-xs rounded-full text-white font-medium"
                      style={{
                        backgroundColor: getTechColor(tech),
                        color:
                          getTechColor(tech) === "#F7DF1E" ||
                          getTechColor(tech) === "#FFCA28"
                            ? "#000"
                            : "#fff",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Language */}
              {project.language && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getTechColor(project.language),
                    }}
                  ></div>
                  <span>{project.language}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Loading projects from GitHub...</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🚀 Building innovative solutions that make a real-world impact
        </p>
      </div>
    </div>
  );
}
