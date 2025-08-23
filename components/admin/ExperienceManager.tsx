"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Experience {
  id?: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_current: boolean;
  sort_order: number;
}

export const ExperienceManager: React.FC = () => {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Experience>({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: null,
    description: "",
    is_current: false,
    sort_order: 0,
  });

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching experiences:", error);
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date,
      };

      if (editingItem) {
        // Update existing experience
        const { error } = await supabase
          .from("experience")
          .update({
            ...submitData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setEditingItem(null);
      } else {
        // Create new experience
        const { error } = await supabase
          .from("experience")
          .insert([submitData]);
        if (error) throw error;
        setShowAddForm(false);
      }

      await fetchExperiences();
      resetForm();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Error saving experience. Please try again.");
    }
  };

  const handleEdit = (item: Experience) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?"))
      return;

    try {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
      await fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Error deleting experience. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: null,
      description: "",
      is_current: false,
      sort_order: experiences.length,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
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
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your professional work experience and career history.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No work experience
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your work experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {item.position}
                  </h4>
                  <p className="text-indigo-600 font-medium">{item.company}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(item.start_date)} -{" "}
                      {item.is_current
                        ? "Present"
                        : formatDate(item.end_date || "")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location}
                    </div>
                    {item.is_current && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Current Position
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div className="mt-3">
                      <p className="text-gray-700 whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
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
                  {editingItem ? "Edit Experience" : "Add Experience"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position/Job Title
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_current"
                      id="is_current"
                      checked={formData.is_current}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="is_current"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      This is my current position
                    </label>
                  </div>
                </div>

                {!formData.is_current && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="month"
                      name="end_date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Describe your responsibilities, achievements, and key contributions..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? "Update" : "Add"} Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
