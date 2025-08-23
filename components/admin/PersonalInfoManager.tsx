"use client";

import { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, Globe, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PersonalInfo {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
}

export const PersonalInfoManager: React.FC = () => {
  const supabase = createClient();
  const [info, setInfo] = useState<PersonalInfo>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      setLoading(true);
    const { data, error } = await supabase
      .from("personal_info_structured")
      .select("*")
      .single();      if (error && error.code !== "PGRST116") {
        console.error("Error fetching personal info:", error);
      } else if (data) {
        setInfo(data);
      }
      setLoading(false);
    };

    fetchPersonalInfo();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (info.id) {
        // Update existing record
        const { error } = await supabase
          .from("personal_info_structured")
          .update({
            ...info,
            updated_at: new Date().toISOString(),
          })
          .eq("id", info.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("personal_info_structured")
          .insert([info])
          .select()
          .single();

        if (error) throw error;
        setInfo(data);
      }

      alert("Personal information saved successfully!");
    } catch (error) {
      console.error("Error saving personal info:", error);
      alert("Error saving personal information. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Personal Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal details and contact information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                <User className="inline h-4 w-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={info.full_name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={info.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                <Phone className="inline h-4 w-4 mr-1" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={info.phone}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={info.location}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={info.bio}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Social Links
            </h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Globe className="inline h-4 w-4 mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={info.website}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label
                  htmlFor="github_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub
                </label>
                <input
                  type="url"
                  name="github_url"
                  id="github_url"
                  value={info.github_url}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  id="linkedin_url"
                  value={info.linkedin_url}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter_url"
                  id="twitter_url"
                  value={info.twitter_url}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
