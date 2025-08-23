"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Save, X, BookOpen, ExternalLink, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Research {
  id?: string;
  title: string;
  abstract: string;
  authors: string[];
  publication_date: string;
  publication_venue?: string;
  doi?: string;
  paper_url?: string;
  categories: string[];
  keywords: string[];
  status: "published" | "under_review" | "in_progress" | "submitted";
  featured: boolean;
  sort_order: number;
}

export const ResearchManager: React.FC = () => {
  const supabase = createClient();
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Research | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Research>({
    title: "",
    abstract: "",
    authors: [],
    publication_date: "",
    publication_venue: "",
    doi: "",
    paper_url: "",
    categories: [],
    keywords: [],
    status: "in_progress",
    featured: false,
    sort_order: 0,
  });

  const fetchResearch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("research")
      .select("*")
      .order("publication_date", { ascending: false });

    if (error) {
      console.error("Error fetching research:", error);
    } else {
      setResearch(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        // Update existing research
        const { error } = await supabase
          .from("research")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setEditingItem(null);
      } else {
        // Create new research
        const { error } = await supabase.from("research").insert([formData]);
        if (error) throw error;
        setShowAddForm(false);
      }

      await fetchResearch();
      resetForm();
    } catch (error) {
      console.error("Error saving research:", error);
      alert("Error saving research. Please try again.");
    }
  };

  const handleEdit = (item: Research) => {
    setEditingItem(item);
    setFormData({
      ...item,
      authors: item.authors || [],
      categories: item.categories || [],
      keywords: item.keywords || [],
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research entry?")) return;

    try {
      const { error } = await supabase.from("research").delete().eq("id", id);
      if (error) throw error;
      await fetchResearch();
    } catch (error) {
      console.error("Error deleting research:", error);
      alert("Error deleting research. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      abstract: "",
      authors: [],
      publication_date: "",
      publication_venue: "",
      doi: "",
      paper_url: "",
      categories: [],
      keywords: [],
      status: "in_progress",
      featured: false,
      sort_order: research.length,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: keyof Research, value: string) => {
    const array = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const getStatusBadge = (status: Research["status"]) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      under_review: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      submitted: "bg-purple-100 text-purple-800",
    };
    return styles[status] || styles.in_progress;
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
          <h3 className="text-lg font-medium text-gray-900">Research Publications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your research papers and academic publications.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Research
        </button>
      </div>

      {/* Research List */}
      {research.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No research publications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your research work.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {research.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(item.status)}`}>
                      {item.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Authors:</span> {item.authors.join(", ")}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.publication_date).toLocaleDateString()}
                    </div>
                    {item.publication_venue && (
                      <div>{item.publication_venue}</div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-3">{item.abstract}</p>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.doi && (
                      <span>DOI: {item.doi}</span>
                    )}
                    {item.paper_url && (
                      <a
                        href={item.paper_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Paper
                      </a>
                    )}
                  </div>
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
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Research" : "Add Research"}
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
                  <label className="block text-sm font-medium text-gray-700">
                    Research Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Title of your research paper"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Brief summary of your research..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Authors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.authors.join(", ")}
                    onChange={(e) => handleArrayChange("authors", e.target.value)}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="John Doe, Jane Smith, Bob Wilson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="publication_date"
                    value={formData.publication_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Publication Venue
                  </label>
                  <input
                    type="text"
                    name="publication_venue"
                    value={formData.publication_venue || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Conference/Journal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    value={formData.doi || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="10.1000/182"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paper URL
                  </label>
                  <input
                    type="url"
                    name="paper_url"
                    value={formData.paper_url || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/paper.pdf"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords.join(", ")}
                    onChange={(e) => handleArrayChange("keywords", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="machine learning, artificial intelligence, neural networks"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured research
                    </label>
                  </div>
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
                  {editingItem ? "Update" : "Add"} Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
