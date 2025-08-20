"use client";
import React, { useState, useEffect } from "react";
import { JournalEntry } from "../utility/tanstack/habitTypes";
import {
  useSaveJournalEntry,
  useJournalEntry,
  useAllJournalEntries,
} from "../utility/tanstack/habitHooks";
import { useSubscription } from "../utility/tanstack/subscriptionContext";
import { Calendar, Edit3, Save } from "lucide-react";

interface JournalEntryFormProps {
  date?: string;
  className?: string;
  onSave?: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  date = new Date().toISOString().split("T")[0],
  className = "",
  onSave,
}) => {
  const { hasReachedLimit, canPerformAction, upgradeToPro } = useSubscription();
  const { data: allEntries } = useAllJournalEntries();

  const [formData, setFormData] = useState({
    whatIDid: "",
    whatILearned: "",
    additionalNotes: "",
    mood: "",
    bookmarked: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const saveMutation = useSaveJournalEntry();
  const { data: existingEntry, isLoading } = useJournalEntry(date);

  // Load existing entry data
  useEffect(() => {
    if (existingEntry) {
      setFormData({
        whatIDid: existingEntry.whatIDid || "",
        whatILearned: existingEntry.whatILearned || "",
        additionalNotes: existingEntry.additionalNotes || "",
        mood: existingEntry.mood || "",
        bookmarked: existingEntry.bookmarked || false,
      });
    } else {
      setFormData({
        whatIDid: "",
        whatILearned: "",
        additionalNotes: "",
        mood: "",
        bookmarked: false,
      });
    }
  }, [existingEntry]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check subscription limits for new entries
    if (!existingEntry) {
      if (!canPerformAction("canCreateJournalEntries")) {
        alert(
          "You don't have permission to create journal entries. Please upgrade to Pro."
        );
        return;
      }

      if (hasReachedLimit("journalEntries", allEntries?.length || 0)) {
        alert(
          "You've reached your journal entry limit on the free plan. Please upgrade to Pro for unlimited entries."
        );
        upgradeToPro();
        return;
      }
    }

    if (
      !formData.whatIDid.trim() &&
      !formData.whatILearned.trim() &&
      !formData.additionalNotes.trim()
    ) {
      return; // Don't save empty entries
    }

    try {
      await saveMutation.mutateAsync({
        date,
        whatIDid: formData.whatIDid.trim(),
        whatILearned: formData.whatILearned.trim(),
        additionalNotes: formData.additionalNotes.trim(),
      });

      setIsEditing(false);
      onSave?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingEntry) {
      setFormData({
        whatIDid: existingEntry.whatIDid || "",
        whatILearned: existingEntry.whatILearned || "",
        additionalNotes: existingEntry.additionalNotes || "",
      });
    } else {
      setFormData({
        whatIDid: "",
        whatILearned: "",
        additionalNotes: "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasContent =
    formData.whatIDid.trim() ||
    formData.whatILearned.trim() ||
    formData.additionalNotes.trim() ||
    formData.mood.trim();
  const isToday = date === new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isToday ? "Today's Journal" : formatDate(date)}
            </h3>
            <p className="text-sm text-gray-600">
              {isToday ? "Reflect on your day" : "Journal entry for this date"}
            </p>
          </div>
        </div>

        {!isEditing && hasContent && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* What I Did Today */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did I do today?
          </label>
          <textarea
            value={formData.whatIDid}
            onChange={(e) => handleChange("whatIDid", e.target.value)}
            disabled={!isEditing}
            rows={3}
            className={`
              w-full p-3 border rounded-lg resize-none transition-colors
              ${
                isEditing
                  ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-200 bg-gray-50"
              }
            `}
            placeholder="Describe what you accomplished today..."
          />
        </div>

        {/* What I Learned Today */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did I learn today?
          </label>
          <textarea
            value={formData.whatILearned}
            onChange={(e) => handleChange("whatILearned", e.target.value)}
            disabled={!isEditing}
            rows={3}
            className={`
              w-full p-3 border rounded-lg resize-none transition-colors
              ${
                isEditing
                  ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-200 bg-gray-50"
              }
            `}
            placeholder="Share something new you learned..."
          />
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today?
          </label>
          <select
            value={formData.mood}
            onChange={(e) => handleChange("mood", e.target.value)}
            disabled={!isEditing}
            className={`
              w-full p-3 border rounded-lg transition-colors
              ${
                isEditing
                  ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-200 bg-gray-50"
              }
            `}
          >
            <option value="">Select your mood...</option>
            <option value="😊">😊 Happy</option>
            <option value="😌">😌 Peaceful</option>
            <option value="😄">😄 Excited</option>
            <option value="😔">😔 Sad</option>
            <option value="😤">😤 Frustrated</option>
            <option value="😴">😴 Tired</option>
            <option value="🤔">🤔 Thoughtful</option>
            <option value="😎">😎 Confident</option>
            <option value="🥰">🥰 Loved</option>
            <option value="😤">😤 Stressed</option>
            <option value="🤗">🤗 Grateful</option>
            <option value="😇">😇 Blessed</option>
            <option value="🤓">🤓 Nerdy</option>
            <option value="😋">😋 Satisfied</option>
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional notes
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => handleChange("additionalNotes", e.target.value)}
            disabled={!isEditing}
            rows={3}
            className={`
              w-full p-3 border rounded-lg resize-none transition-colors
              ${
                isEditing
                  ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "border-gray-200 bg-gray-50"
              }
            `}
            placeholder="Any other thoughts or reflections..."
          />
        </div>

        {/* Bookmark Toggle */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Bookmark this entry
          </label>
          <button
            type="button"
            onClick={() => {
              // Check bookmark limits before allowing toggle
              if (
                !formData.bookmarked &&
                hasReachedLimit(
                  "bookmarks",
                  allEntries?.filter((e) => e.bookmarked).length || 0
                )
              ) {
                alert(
                  "You've reached your bookmark limit on the free plan. Please upgrade to Pro for unlimited bookmarks."
                );
                upgradeToPro();
                return;
              }
              handleChange("bookmarked", !formData.bookmarked);
            }}
            disabled={!isEditing}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${formData.bookmarked ? "bg-blue-600" : "bg-gray-200"}
              ${isEditing ? "cursor-pointer" : "cursor-not-allowed"}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${formData.bookmarked ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Saving..." : "Save Entry"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* Empty State */}
      {!hasContent && !isEditing && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">No journal entry yet</p>
          <p className="text-sm">Start writing to reflect on your day</p>
        </div>
      )}
    </div>
  );
};

export default JournalEntryForm;
