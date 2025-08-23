"use client";

import { useState } from "react";
import { simpleAdminLogin, getAdminCredentials } from "@/lib/simple-auth";

interface SimpleLoginFormProps {
  onLogin: (isAuthenticated: boolean) => void;
}

export const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const credentials = getAdminCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const isAuthenticated = simpleAdminLogin(email, password);

      if (isAuthenticated) {
        onLogin(true);
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the portfolio admin dashboard
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Demo Credentials
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                Use these credentials to access the admin panel
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-blue-600 text-sm underline"
            >
              {showCredentials ? "Hide" : "Show"}
            </button>
          </div>

          {showCredentials && (
            <div className="mt-3 space-y-2">
              <div>
                <span className="text-xs font-medium text-blue-700">
                  Email:
                </span>
                <code className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                  {credentials.email}
                </code>
              </div>
              <div>
                <span className="text-xs font-medium text-blue-700">
                  Password:
                </span>
                <code className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                  {credentials.password}
                </code>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEmail(credentials.email)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Fill Email
                </button>
                <button
                  type="button"
                  onClick={() => setPassword(credentials.password)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Fill Password
                </button>
              </div>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a demo admin interface. In production, use proper
            authentication.
          </p>
        </div>
      </div>
    </div>
  );
};
