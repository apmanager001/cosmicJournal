import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, BookOpen, Calendar, Save } from "lucide-react";
import {
  useSaveJournalEntry,
  useJournalEntry,
  useAllJournalEntries,
} from "@/comp/utility/tanstack/habitHooks";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { useAuth } from "@/comp/utility/tanstack/authContext";

const DailyJournal = ({ selectedDate, bookmarked=false }) => {
  // Ensure selectedDate is a Date object at the start
  if (!(selectedDate instanceof Date)) {
    selectedDate = new Date(selectedDate);
  }

  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { hasReachedLimit, canPerformAction, upgradeToPro } = useSubscription();
  const { data: allEntries } = useAllJournalEntries();
  const [formData, setFormData] = useState({
    whatIDid: "",
    whatILearned: "",
    additionalNotes: "",
    mood: "",
    bookmarked: false,
  });

  const saveMutation = useSaveJournalEntry();

  // Format the selected date for the journal form
  const formatDateForJournal = (date) => {
    if (!date) return new Date().toISOString().split("T")[0];
    if (!(date instanceof Date)) date = new Date(date); // Ensure 'date' is a Date object
    return date.toISOString().split("T")[0];
  };

  const journalDate = formatDateForJournal(selectedDate);
  const { data: existingEntry, isLoading } = useJournalEntry(journalDate);
  // Load existing entry data when existingEntry changes
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
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
      if (!user) {
        alert("User not authenticated");
        return;
      }

      await saveMutation.mutateAsync({
        date: journalDate,
        userId: user.id,
        whatIDid: formData.whatIDid.trim(),
        whatILearned: formData.whatILearned.trim(),
        additionalNotes: formData.additionalNotes.trim(),
        bookmarked: formData.bookmarked,
      });
    } catch {
      // Error handling is done in the mutation
    }
  };

  const handleCancel = () => {
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
  };

  const formatDate = (dateStr) => {
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
  const isToday = journalDate === new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="bg-base-300/50 rounded-lg">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="space-y-3">
              <div className="h-14 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-300/50 rounded-lg hover:bg-base-300/70 transition-colors mx-4 md:mx-0">
      {/* Header - Clickable to toggle dropdown */}
      <div
        className="flex flex-row items-center justify-between p-4 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-base-content">Daily Journal</h4>
            <div className="flex items-center gap-2">
              <p className="text-xs text-base-content/60">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                  : "Today's reflection"}
              </p>
              {/* Journal entry status indicator */}
              {existingEntry ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success font-medium">
                    Entry saved
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-base-content/30 rounded-full"></div>
                  <span className="text-xs text-base-content/50">No entry</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chevron Icon */}
        <div className="text-base-content/60 transition-transform duration-200">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="border-t border-base-content/10 p-6">
          <div>
            <p>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isToday
                    ? "Today's Journal"
                    : selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    : formatDate(journalDate)}
                </h3>
                <p className="text-sm">
                  {isToday
                    ? "Reflect on your day"
                    : "Journal entry for this date"}
                </p>
              </div>
            </div>
            {hasContent && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Entry saved
              </div>
            )}
            {/* Bookmark Toggle */}
            <div className="flex flex-col items-center justify-between gap-2">
              <label htmlFor="bookmark" className="block text-sm font-medium">
                Bookmark this entry
              </label>
              <button
                id="bookmark"
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
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${formData.bookmarked ? "bg-blue-600" : "bg-gray-200"}
                    cursor-pointer
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
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* What I Did Today */}
            <div>
              <label
                htmlFor="whatIDid"
                className="block text-sm font-medium mb-2"
              >
                What did I do today?
              </label>
              <textarea
                id="whatIDid"
                value={formData.whatIDid}
                onChange={(e) => handleChange("whatIDid", e.target.value)}
                rows={3}
                className="w-full p-3 textarea textarea-primary rounded-lg resize-none"
                placeholder="Describe what you accomplished today..."
              />
            </div>

            {/* What I Learned Today */}
            <div>
              <label
                htmlFor="whatILearned"
                className="block text-sm font-medium mb-2"
              >
                What did I learn today?
              </label>
              <textarea
                id="whatILearned"
                value={formData.whatILearned}
                onChange={(e) => handleChange("whatILearned", e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg resize-none textarea textarea-primary"
                placeholder="Share something new you learned..."
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label htmlFor="mood" className="block text-sm font-medium mb-2">
                How are you feeling today?
              </label>
              <select
                id="mood"
                value={formData.mood}
                onChange={(e) => handleChange("mood", e.target.value)}
                className="w-full select select-primary rounded-lg"
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
              <label
                htmlFor="additionalNotes"
                className="block text-sm font-medium mb-2"
              >
                Additional notes
              </label>
              <textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleChange("additionalNotes", e.target.value)
                }
                rows={3}
                className="w-full p-3 textarea textarea-primary rounded-lg resize-none"
                placeholder="Any other thoughts or reflections..."
              />
            </div>
                <div className='divider'></div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 btn btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Saving..." : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg btn btn-error btn-soft"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyJournal;
