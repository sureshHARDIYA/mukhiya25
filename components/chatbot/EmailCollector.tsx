// components/chatbot/EmailCollector.tsx
"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

interface EmailCollectorProps {
  question: string;
  onSubmit: (email: string) => void;
  onSkip: () => void;
}

export default function EmailCollector({
  question,
  onSubmit,
  onSkip,
}: EmailCollectorProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setIsValidEmail(true);
    setIsSubmitted(true);
    onSubmit(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!isValidEmail && e.target.value) {
      setIsValidEmail(validateEmail(e.target.value));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            I've received your question and will get back to you at{" "}
            <strong>{email}</strong> within 24 hours.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Your question:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              "{question}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 my-4">
      <div className="text-center mb-6">
        <Mail className="w-8 h-8 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Let's Connect!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          I'd love to give you a personalized answer to your question.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Your question:
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
          "{question}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your.email@example.com"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
              !isValidEmail
                ? "border-red-300 dark:border-red-600"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {!isValidEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Question</span>
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Skip
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💌 I typically respond within 24 hours • Your email won't be shared
        </p>
      </div>
    </div>
  );
}
