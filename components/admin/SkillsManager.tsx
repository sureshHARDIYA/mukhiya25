"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import type { Skill } from "@/lib/supabase-auth";
import { Input, Button } from "@/components/ui/form-components";

interface SkillFormData {
  category_name: string;
  skill_name: string;
  skill_level: number;
  color: string;
  sort_order: number;
}

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<SkillFormData>({
    category_name: "",
    skill_name: "",
    skill_level: 5,
    color: "#3B82F6",
    sort_order: 0,
  });

  const categories = Array.from(
    new Set(skills.map((skill) => skill.category_name))
  );

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/skills");
      const data = await response.json();

      if (response.ok) {
        setSkills(data.skills || []);
      } else {
        console.error("Error fetching skills:", data.error);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        // Update existing skill
        const response = await fetch(
          `/api/admin/skills?id=${editingSkill.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setEditingSkill(null);
          fetchSkills();
        } else {
          console.error("Error updating skill:", data.error);
        }
      } else {
        // Create new skill
        const response = await fetch("/api/admin/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setShowAddForm(false);
          fetchSkills();
        } else {
          console.error("Error creating skill:", data.error);
        }
      }

      // Reset form
      setFormData({
        category_name: "",
        skill_name: "",
        skill_level: 5,
        color: "#3B82F6",
        sort_order: 0,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      category_name: skill.category_name,
      skill_name: skill.skill_name,
      skill_level: skill.skill_level,
      color: skill.color,
      sort_order: skill.sort_order,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        fetchSkills();
      } else {
        console.error("Error deleting skill:", data.error);
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSkill(null);
    setFormData({
      category_name: "",
      skill_name: "",
      skill_level: 5,
      color: "#3B82F6",
      sort_order: 0,
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Skills Management</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium mb-4">
            {editingSkill ? "Edit Skill" : "Add New Skill"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) =>
                    setFormData({ ...formData, category_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  list="categories"
                  required
                />
                <datalist id="categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.skill_name}
                  onChange={(e) =>
                    setFormData({ ...formData, skill_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.skill_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skill_level: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2 inline" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {editingSkill ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills by Category */}
      {categories.map((category) => (
        <div
          key={category}
          className="bg-white border border-gray-200 rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">{category}</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills
                .filter((skill) => skill.category_name === category)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">
                        {skill.skill_name}
                      </h5>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                      <span className="text-sm text-gray-600">
                        Level {skill.skill_level}/10
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: skill.color,
                          width: `${(skill.skill_level / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
