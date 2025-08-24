"use client";

import { useState, useEffect } from "react";
import { Input, Textarea, Button } from "@/components/ui/form-components";
import { MessageSquare, Plus, Edit, Trash2 } from "lucide-react";

interface Intent {
  id: number;
  name: string;
  description: string;
  confidence_threshold: number;
  created_at: string;
}

export default function IntentsPage() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIntent, setEditingIntent] = useState<Intent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    confidence_threshold: 0.6,
  });

  // Fetch intents from API
  const fetchIntents = async () => {
    try {
      const response = await fetch("/api/admin/intents");
      if (response.ok) {
        const data = await response.json();
        setIntents(data.intents || []);
      } else {
        console.error("Failed to fetch intents");
      }
    } catch (error) {
      console.error("Error fetching intents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingIntent
        ? `/api/admin/intents?id=${editingIntent.id}`
        : "/api/admin/intents";
      const method = editingIntent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchIntents();
        setShowForm(false);
        setEditingIntent(null);
        setFormData({ name: "", description: "", confidence_threshold: 0.6 });
      } else {
        console.error("Failed to save intent");
      }
    } catch (error) {
      console.error("Error saving intent:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this intent?")) return;

    try {
      const response = await fetch(`/api/admin/intents?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchIntents();
      } else {
        console.error("Failed to delete intent");
      }
    } catch (error) {
      console.error("Error deleting intent:", error);
    }
  };

  // Handle edit
  const handleEdit = (intent: Intent) => {
    setEditingIntent(intent);
    setFormData({
      name: intent.name,
      description: intent.description,
      confidence_threshold: intent.confidence_threshold,
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
          <h1 className="text-2xl font-bold text-gray-900">Intents Manager</h1>
          <p className="text-gray-600">
            Manage chatbot intents and their confidence thresholds
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingIntent(null);
            setFormData({
              name: "",
              description: "",
              confidence_threshold: 0.6,
            });
            setShowForm(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Intent</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingIntent ? "Edit Intent" : "Add New Intent"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intent Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., SKILLS_INQUIRY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what this intent captures..."
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidence Threshold (0.0 - 1.0)
              </label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.confidence_threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confidence_threshold: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingIntent ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingIntent(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Intents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Existing Intents
          </h2>
        </div>
        {intents.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No intents found
            </h3>
            <p className="text-sm text-gray-500">
              Create your first intent to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {intents.map((intent) => (
              <div key={intent.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {intent.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {intent.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Confidence Threshold: {intent.confidence_threshold} |
                      Created:{" "}
                      {new Date(intent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(intent)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit intent"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(intent.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete intent"
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
