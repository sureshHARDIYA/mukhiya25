"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Input, Textarea, Button } from "@/components/ui/form-components";

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
  location?: string;
  sort_order: number;
}

export const EducationManager: React.FC = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Education>({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    sort_order: 0,
  });

  const fetchEducation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/education");
      const data = await response.json();

      if (response.ok) {
        setEducation(data.education || []);
      } else {
        console.error("Error fetching education:", data.error);
      }
    } catch (error) {
      console.error("Error fetching education:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        // Update existing education
        const response = await fetch(
          `/api/admin/education?id=${editingItem.id}`,
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
          setEditingItem(null);
        } else {
          console.error("Error updating education:", data.error);
          alert("Error updating education. Please try again.");
          return;
        }
      } else {
        // Create new education
        const response = await fetch("/api/admin/education", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setShowAddForm(false);
        } else {
          console.error("Error creating education:", data.error);
          alert("Error creating education. Please try again.");
          return;
        }
      }

      await fetchEducation();
      resetForm();
    } catch (error) {
      console.error("Error saving education:", error);
      alert("Error saving education. Please try again.");
    }
  };

  const handleEdit = (item: Education) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const response = await fetch(`/api/admin/education?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        await fetchEducation();
      } else {
        console.error("Error deleting education:", data.error);
        alert("Error deleting education. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Error deleting education. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
      location: "",
      sort_order: education.length,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your educational background and qualifications.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </button>
      </div>

      {/* Education List */}
      {education.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No education entries
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your educational background.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {item.degree} in {item.field_of_study}
                  </h4>
                  <p className="text-indigo-600 font-medium">
                    {item.institution}
                  </p>
                  {item.location && (
                    <p className="text-sm text-gray-500">{item.location}</p>
                  )}
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.start_date} - {item.end_date || "Present"}
                  </div>
                  {item.description && (
                    <p className="mt-3 text-gray-700">{item.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Education" : "Add Education"}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Institution"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    placeholder="University or School Name"
                  />
                </div>

                <div>
                  <Input
                    label="Degree"
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    placeholder="Bachelor's, Master's, PhD, etc."
                  />
                </div>

                <div>
                  <Input
                    label="Field of Study"
                    type="text"
                    name="field_of_study"
                    value={formData.field_of_study}
                    onChange={handleChange}
                    required
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>

                <div>
                  <Input
                    label="Start Date"
                    type="month"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="End Date"
                    type="month"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Input
                    label="Location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Notable achievements, coursework, projects, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="inline-flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? "Update" : "Add"} Education
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
