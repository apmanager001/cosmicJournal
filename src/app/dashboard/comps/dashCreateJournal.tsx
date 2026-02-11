import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Save } from "lucide-react";
import {
  useSaveJournalEntry,
  useJournalEntry,
  useAllJournalEntries,
} from "@/comp/utility/tanstack/habitHooks";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { useAuth } from "@/comp/utility/tanstack/authContext";

type DashCreateJournalProps = {
  selectedDate?: Date | string;
  bookmarked?: boolean;
};

type FormDataState = {
  whatIDid: string;
  whatILearned: string;
  additionalNotes: string;
  mood: string;
  bookmarked: boolean;
};

const DashCreateJournal: React.FC<DashCreateJournalProps> = ({
  selectedDate,
  bookmarked = false,
}) => {
  const { user } = useAuth();
  const { hasReachedLimit, canPerformAction, upgradeToPro } = useSubscription();
  const { data: allEntries } = useAllJournalEntries();
  const [formData, setFormData] = useState<FormDataState>({
    whatIDid: "",
    whatILearned: "",
    additionalNotes: "",
    mood: "",
    bookmarked: bookmarked ?? false,
  });

  const saveMutation = useSaveJournalEntry();

  // Helpers to format the selected date for the journal
  // Use a stable day string (YYYY-MM-DD) for lookups
  const getJournalDay = (date: Date | string | undefined): string => {
    const safeDate = date ? new Date(date) : new Date();
    if (Number.isNaN(safeDate.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return safeDate.toISOString().split("T")[0];
  };

  // Use full ISO string (with time) when saving
  const getJournalDateTime = (date: Date | string | undefined): string => {
    const safeDate = date ? new Date(date) : new Date();
    if (Number.isNaN(safeDate.getTime())) {
      return new Date().toISOString();
    }
    return safeDate.toISOString();
  };

  const journalDay = getJournalDay(selectedDate);
  const journalDateTime = getJournalDateTime(selectedDate);

  const { data: existingEntry, isLoading } = useJournalEntry(journalDay);
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

  const handleChange = (
    field: keyof FormDataState,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check subscription limits for new entries
    if (!existingEntry) {
      if (!canPerformAction("canCreateJournalEntries")) {
        alert(
          "You don't have permission to create journal entries. Please upgrade to Pro.",
        );
        return;
      }

      if (hasReachedLimit("journalEntries", allEntries?.length || 0)) {
        alert(
          "You've reached your journal entry limit on the free plan. Please upgrade to Pro for unlimited entries.",
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
        date: journalDateTime,
        userId: user.id,
        whatIDid: formData.whatIDid.trim(),
        whatILearned: formData.whatILearned.trim(),
        additionalNotes: formData.additionalNotes.trim(),
        mood: formData.mood,
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
  const isToday = journalDay === new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="w-full text-center">
        <span className="loading loading-bars loading-md text-primary"></span>
      </div>
    );
  }

  const today = new Date();
  return (
    <div className="px-6">
      <div className="font-extralight mb-4">{today.toDateString()}</div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* What I Did Today */}
        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="whatIDid"
              className="block text-sm font-medium mb-2"
            >
              What did I do today?
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="block text-sm font-medium">
                  Bookmark:
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formData.bookmarked}
                  onChange={() => {
                    // Check bookmark limits before allowing toggle on
                    if (
                      !formData.bookmarked &&
                      hasReachedLimit(
                        "bookmarks",
                        allEntries?.filter((e: any) => e.bookmarked).length ||
                          0,
                      )
                    ) {
                      alert(
                        "You've reached your bookmark limit on the free plan. Please upgrade to Pro for unlimited bookmarks.",
                      );
                      upgradeToPro();
                      return;
                    }
                    handleChange("bookmarked", !formData.bookmarked);
                  }}
                />
            </div>
          </div>
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
            <option value="happy">😊 Happy</option>
            <option value="peaceful">😌 Peaceful</option>
            <option value="excited">😄 Excited</option>
            <option value="sad">😔 Sad</option>
            <option value="frustrated">😤 Frustrated</option>
            <option value="tired">😴 Tired</option>
            <option value="thoughtful">🤔 Thoughtful</option>
            <option value="confident">😎 Confident</option>
            <option value="loved">🥰 Loved</option>
            <option value="stressed">😤 Stressed</option>
            <option value="grateful">🤗 Grateful</option>
            <option value="blessed">😇 Blessed</option>
            <option value="nerdy">🤓 Nerdy</option>
            <option value="satisfied">😋 Satisfied</option>
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
            onChange={(e) => handleChange("additionalNotes", e.target.value)}
            rows={3}
            className="w-full p-3 textarea textarea-primary rounded-lg resize-none"
            placeholder="Any other thoughts or reflections..."
          />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 md:items-center pt-4">
          <div className="flex gap-3">
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
            <div className="">
              {hasContent && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Entry saved
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DashCreateJournal;
