"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import {
  followUpConfig,
  addFollowUpQuestion,
  removeFollowUpQuestion,
  getAllCategories,
} from "@/lib/follow-up-config";

interface AdminPanelProps {
  onUpdate?: () => void;
}

export default function FollowUpQuestionsAdmin({ onUpdate }: AdminPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("skills");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const categories = getAllCategories();
  const currentQuestions = followUpConfig[selectedCategory]?.questions || [];

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      addFollowUpQuestion(
        selectedCategory,
        newQuestion.trim(),
        newAnswer.trim()
      );
      setNewQuestion("");
      setNewAnswer("");
      onUpdate?.();
    }
  };

  const handleRemoveQuestion = (index: number) => {
    removeFollowUpQuestion(selectedCategory, index);
    onUpdate?.();
  };

  const handleEditQuestion = (index: number) => {
    const questionObj = currentQuestions[index];
    setEditingIndex(index);
    setEditingQuestion(questionObj.question);
    setEditingAnswer(questionObj.answer);
  };

  const handleSaveEdit = () => {
    if (
      editingIndex !== null &&
      editingQuestion.trim() &&
      editingAnswer.trim()
    ) {
      followUpConfig[selectedCategory].questions[editingIndex] = {
        question: editingQuestion.trim(),
        answer: editingAnswer.trim(),
        responseType: "text",
      };
      setEditingIndex(null);
      setEditingQuestion("");
      setEditingAnswer("");
      onUpdate?.();
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingQuestion("");
    setEditingAnswer("");
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Configure Follow-up Questions"
      >
        <Edit2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Configure Follow-up Questions
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Category Sidebar */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map(({ category, description, questionCount }) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {category}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {questionCount} questions
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Questions Management */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize mb-2">
                {selectedCategory} Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {followUpConfig[selectedCategory]?.description}
              </p>

              {/* Add New Question and Answer */}
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add a new follow-up question..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write the answer for this question..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim() || !newAnswer.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question & Answer
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentQuestions.map((questionObj, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingQuestion}
                        onChange={(e) => setEditingQuestion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="Question"
                      />
                      <textarea
                        value={editingAnswer}
                        onChange={(e) => setEditingAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="Answer"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-2">
                            Q: {questionObj.question}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 p-3 rounded">
                            A: {questionObj.answer}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(index)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveQuestion(index)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {currentQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No questions configured for this category yet.
                  <br />
                  Add your first question above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              💡 Tip: Questions are randomly shuffled and limited to 5 per
              response for better UX
            </div>
            <div>
              Total Questions:{" "}
              {categories.reduce((sum, cat) => sum + cat.questionCount, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
