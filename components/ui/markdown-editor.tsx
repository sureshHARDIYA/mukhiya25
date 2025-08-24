"use client";

import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  height?: number;
  preview?: "live" | "edit" | "preview";
  hideToolbar?: boolean;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Enter your response text with markdown formatting...",
  height = 200,
  preview = "live",
  hideToolbar = false,
  className = "",
}: MarkdownEditorProps) {
  return (
    <div className={`markdown-editor-container ${className}`}>
      {!hideToolbar && (
        <div className="mb-2 text-sm text-muted-foreground">{placeholder}</div>
      )}
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview={preview}
        hideToolbar={hideToolbar}
      />
      <style jsx global>{`
        .markdown-editor-container .w-md-editor {
          background-color: var(--background);
          border: 1px solid hsl(var(--border));
          border-radius: 0.375rem;
        }

        .markdown-editor-container .w-md-editor.w-md-editor-focus {
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        .markdown-editor-container .w-md-editor-text-pre,
        .markdown-editor-container .w-md-editor-text-input,
        .markdown-editor-container .w-md-editor-text {
          color: #1f2937 !important;
          font-size: 14px;
          line-height: 1.5;
          background-color: var(--background) !important;
        }

        .markdown-editor-container .w-md-editor-preview {
          background-color: var(--muted);
          color: #1f2937;
          border-left: 1px solid hsl(var(--border));
        }

        .markdown-editor-container .w-md-editor-preview h1,
        .markdown-editor-container .w-md-editor-preview h2,
        .markdown-editor-container .w-md-editor-preview h3,
        .markdown-editor-container .w-md-editor-preview h4,
        .markdown-editor-container .w-md-editor-preview h5,
        .markdown-editor-container .w-md-editor-preview h6 {
          color: #111827 !important;
          font-weight: 600;
        }

        .markdown-editor-container .w-md-editor-preview p,
        .markdown-editor-container .w-md-editor-preview li {
          color: #1f2937 !important;
        }

        .markdown-editor-container .w-md-editor-preview strong {
          color: #111827 !important;
          font-weight: 600;
        }

        .markdown-editor-container .w-md-editor-preview a {
          color: #3b82f6 !important;
          text-decoration: underline;
        }

        .markdown-editor-container .w-md-editor-preview blockquote {
          border-left: 4px solid #3b82f6;
          background-color: hsl(var(--muted));
          color: #1e40af !important;
          padding: 0.75rem 1rem;
          margin: 1rem 0;
        }

        .markdown-editor-container .w-md-editor-preview code {
          background-color: #f3f4f6;
          color: #dc2626 !important;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .markdown-editor-container .w-md-editor-preview pre {
          background-color: #1f2937;
          color: #f9fafb !important;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }

        .markdown-editor-container .w-md-editor-preview pre code {
          background-color: transparent;
          color: #f9fafb !important;
          padding: 0;
        }

        .markdown-editor-container .w-md-editor-toolbar {
          background-color: hsl(var(--muted));
          border-bottom: 1px solid hsl(var(--border));
          border-radius: 0.375rem 0.375rem 0 0;
        }

        .markdown-editor-container .w-md-editor-toolbar ul > li button {
          color: #374151;
        }

        .markdown-editor-container .w-md-editor-toolbar ul > li button:hover {
          background-color: hsl(var(--accent));
          color: #111827;
        } /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .markdown-editor-container .w-md-editor {
            background-color: #1f2937;
            border-color: #374151;
          }

          .markdown-editor-container .w-md-editor-text-pre,
          .markdown-editor-container .w-md-editor-text-input,
          .markdown-editor-container .w-md-editor-text {
            color: #f9fafb !important;
            background-color: #1f2937 !important;
          }

          .markdown-editor-container .w-md-editor-preview {
            background-color: #111827;
            color: #f9fafb;
            border-left-color: #374151;
          }

          .markdown-editor-container .w-md-editor-preview h1,
          .markdown-editor-container .w-md-editor-preview h2,
          .markdown-editor-container .w-md-editor-preview h3,
          .markdown-editor-container .w-md-editor-preview h4,
          .markdown-editor-container .w-md-editor-preview h5,
          .markdown-editor-container .w-md-editor-preview h6 {
            color: #ffffff !important;
          }

          .markdown-editor-container .w-md-editor-preview p,
          .markdown-editor-container .w-md-editor-preview li {
            color: #d1d5db !important;
          }

          .markdown-editor-container .w-md-editor-toolbar {
            background-color: #374151;
            border-bottom-color: #4b5563;
          }

          .markdown-editor-container .w-md-editor-toolbar ul > li button {
            color: #d1d5db;
          }

          .markdown-editor-container .w-md-editor-toolbar ul > li button:hover {
            background-color: #4b5563;
            color: #ffffff;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .markdown-editor-container .w-md-editor {
            height: auto !important;
            min-height: 150px;
          }

          .markdown-editor-container .w-md-editor-toolbar {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

export default MarkdownEditor;
