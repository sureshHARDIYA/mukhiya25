"use client";

import { useState, useEffect } from "react";
import { Textarea, Button } from "@/components/ui/form-components";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { MessageSquare, Plus, Edit, Trash2, Tag, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Intent {
  id: number;
  name: string;
  description: string;
}

interface Response {
  id: number;
  intent_id: number;
  trigger_patterns: string[];
  response_text: string;
  response_type: string;
  response_data: Record<string, unknown> | null;
  follow_up_questions: string[];
  created_at: string;
  intents: Intent;
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingResponse, setEditingResponse] = useState<Response | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    intent_id: "",
    trigger_patterns: "",
    response_text: "",
    response_type: "text",
    follow_up_questions: "",
  });

  // Fetch responses and intents from API
  const fetchData = async () => {
    try {
      const [responsesRes, intentsRes] = await Promise.all([
        fetch("/api/admin/responses"),
        fetch("/api/admin/intents"),
      ]);

      if (responsesRes.ok) {
        const responsesData = await responsesRes.json();
        setResponses(responsesData.responses || []);
      }

      if (intentsRes.ok) {
        const intentsData = await intentsRes.json();
        setIntents(intentsData.intents || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: {
        id?: number;
        intent_id: number;
        trigger_patterns: string[];
        response_text: string;
        response_type: string;
        follow_up_questions: string[];
      } = {
        ...formData,
        intent_id: parseInt(formData.intent_id),
        trigger_patterns: formData.trigger_patterns
          .split("\n")
          .filter((p) => p.trim()),
        follow_up_questions: formData.follow_up_questions
          .split("\n")
          .filter((q) => q.trim()),
      };

      // For editing, include the ID in the payload
      if (editingResponse) {
        payload.id = editingResponse.id;
      }

      const url = "/api/admin/responses";
      const method = editingResponse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchData();
        setShowForm(false);
        setEditingResponse(null);
        setFormData({
          intent_id: "",
          trigger_patterns: "",
          response_text: "",
          response_type: "text",
          follow_up_questions: "",
        });
      } else {
        console.error("Failed to save response");
      }
    } catch (error) {
      console.error("Error saving response:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      const response = await fetch(`/api/admin/responses?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      } else {
        console.error("Failed to delete response");
      }
    } catch (error) {
      console.error("Error deleting response:", error);
    }
  };

  // Handle edit
  const handleEdit = (response: Response) => {
    setEditingResponse(response);
    setFormData({
      intent_id: response.intent_id.toString(),
      trigger_patterns: response.trigger_patterns.join("\n"),
      response_text: response.response_text,
      response_type: response.response_type,
      follow_up_questions: response.follow_up_questions.join("\n"),
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Responses Manager
          </h1>
          <p className="text-gray-600">
            Manage chatbot responses, trigger patterns, and follow-up questions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingResponse(null);
            setFormData({
              intent_id: "",
              trigger_patterns: "",
              response_text: "",
              response_type: "text",
              follow_up_questions: "",
            });
            setShowForm(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Response</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingResponse ? "Edit Response" : "Add New Response"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intent
              </label>
              <select
                value={formData.intent_id}
                onChange={(e) =>
                  setFormData({ ...formData, intent_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select an intent</option>
                {intents.map((intent) => (
                  <option key={intent.id} value={intent.id}>
                    {intent.name} - {intent.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Type
              </label>
              <select
                value={formData.response_type}
                onChange={(e) =>
                  setFormData({ ...formData, response_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="text">Text</option>
                <option value="skills">Skills</option>
                <option value="education">Education</option>
                <option value="experience">Experience</option>
                <option value="projects">Projects</option>
                <option value="research">Research</option>
                <option value="overview">Overview</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Text
              </label>
              <MarkdownEditor
                value={formData.response_text}
                onChange={(value) =>
                  setFormData({ ...formData, response_text: value || "" })
                }
                placeholder="Enter the response text with markdown formatting..."
                height={300}
                preview="live"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Patterns (one per line)
              </label>
              <Textarea
                value={formData.trigger_patterns}
                onChange={(e) =>
                  setFormData({ ...formData, trigger_patterns: e.target.value })
                }
                placeholder="Enter trigger patterns, one per line..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Questions (one per line)
              </label>
              <Textarea
                value={formData.follow_up_questions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    follow_up_questions: e.target.value,
                  })
                }
                placeholder="Enter follow-up questions, one per line..."
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingResponse ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingResponse(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Responses List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Existing Responses
          </h2>
        </div>
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No responses found
            </h3>
            <p className="text-sm text-gray-500">
              Create your first response to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {responses.map((response) => (
              <div key={response.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {response.intents.name}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {response.response_type}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          Response Text
                        </h3>
                        <button
                          onClick={() =>
                            setExpandedResponse(
                              expandedResponse === response.id
                                ? null
                                : response.id
                            )
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={12} />
                          {expandedResponse === response.id
                            ? "Collapse"
                            : "Preview"}
                        </button>
                      </div>

                      {expandedResponse === response.id ? (
                        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="markdown-content">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-xl font-bold text-gray-900 mb-3">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-base font-medium text-gray-800 mb-2">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="text-gray-700 mb-2 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-gray-900">
                                    {children}
                                  </strong>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children}
                                  </a>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside mb-2 text-gray-700">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside mb-2 text-gray-700">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="text-gray-700 mb-1">
                                    {children}
                                  </li>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-3 italic text-blue-800 my-2">
                                    {children}
                                  </blockquote>
                                ),
                                code: ({ children }) => (
                                  <code className="bg-gray-200 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                ),
                                pre: ({ children }) => (
                                  <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                                    {children}
                                  </pre>
                                ),
                              }}
                            >
                              {response.response_text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">
                          {response.response_text.substring(0, 100)}
                          {response.response_text.length > 100 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    {response.trigger_patterns.length > 0 && (
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Triggers:</strong>{" "}
                        {response.trigger_patterns.join(", ")}
                      </p>
                    )}
                    {response.follow_up_questions.length > 0 && (
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Follow-ups:</strong>{" "}
                        {response.follow_up_questions.slice(0, 2).join(", ")}
                        {response.follow_up_questions.length > 2 ? "..." : ""}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Created:{" "}
                      {new Date(response.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(response)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit response"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(response.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete response"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
