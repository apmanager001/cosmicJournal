"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { useAllJournalEntries } from "@/comp/utility/tanstack/habitHooks";
import type { JournalEntry } from "@/comp/utility/tanstack/habitTypes";
import JournalEntryForm from "@/comp/journal/JournalEntryForm";
import { useState, useMemo } from "react";
import { Calendar, Edit, Star, CircleCheck } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  return (
    <ProtectedRoute>
      <JournalContent />
    </ProtectedRoute>
  );
}

function JournalContent() {
  const {} = useAuth();
  const {} = useSubscription();
  const { data: allEntries, isLoading, error } = useAllJournalEntries();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar days for the current month
  const generateCalendarDays = (entries: JournalEntry[]) => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const loopDate = new Date(startDate);

    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = loopDate.toISOString().split("T")[0];

      // Check if any entry matches this date (normalize entry dates to YYYY-MM-DD)
      const hasEntry = entries?.some((entry) => {
        if (!entry.date) return false;
        const entryDate = new Date(entry.date);
        const entryDateStr = entryDate.toISOString().split("T")[0];
        const matches = entryDateStr === dateStr;

        return matches;
      });

      days.push({
        date: loopDate.getDate(),
        isCurrentMonth: loopDate.getMonth() === currentMonth,
        hasEntry: hasEntry,
        fullDate: dateStr,
      });

      loopDate.setDate(loopDate.getDate() + 1);
    }

    return days;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Get available moods from entries
  const availableMoods = useMemo(() => {
    if (!allEntries) return [];
    const moods = allEntries
      .map((entry) => entry.mood)
      .filter((mood) => mood && mood.trim() !== "");
    return [...new Set(moods)];
  }, [allEntries]);

  // Filter entries based on selected criteria
  const filteredEntries = useMemo(() => {
    if (!allEntries) return [];
    return allEntries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allEntries]);

  // Utility functions
  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      Happy: "😊",
      Sad: "😢",
      Excited: "🤩",
      Calm: "😌",
      Energetic: "⚡",
      Tired: "😴",
      Focused: "🎯",
      Creative: "🎨",
      Grateful: "🙏",
      Motivated: "💪",
    };
    return moodEmojis[mood] || "😐";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Entries
          </h2>
          <p className="text-gray-600">
            Failed to load journal entries. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Header */}
      <div className="customContainer backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-purple-200/50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold ">Journal</h1>
            <p className="text-gray-400">
              Reflect on your day and track your personal growth
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Limit Banner */}
      {/* <SubscriptionLimitBanner
        resource="journalEntries"
        currentCount={allEntries?.length || 0}
        className="mb-6"
      /> */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar and Stats */}
        <div className="w-full lg:w-96 lg:flex-shrink-0 customContainer backdrop-blur-sm rounded-lg shadow-lg p-2 md:p-6 border border-purple-200/50">
          <div className="flex flex-col gap-6">
            {/* Journal Calendar Title - Its own row */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold ">Journal Calendar</h3>
            </div>

            {/* Quick Stats - Their own row */}
            <div className="flex justify-center lg:justify-start">
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="flex flex-col justify-center text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg lg:text-xl font-bold text-blue-600">
                    {allEntries?.length || 0}
                  </div>
                  <div className="text-xs lg:text-sm text-blue-600">
                    Total Entries
                  </div>
                </div>
                <div className="flex flex-col justify-center text-center bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-lg lg:text-xl font-bold text-purple-600">
                    {allEntries?.filter((entry) => entry.bookmarked).length ||
                      0}
                  </div>
                  <div className="text-xs lg:text-sm text-purple-600">
                    Bookmarked
                  </div>
                </div>
                <div className="flex flex-col justify-center text-center bg-green-50 rounded-lg border border-green-200">
                  <div className="text-lg lg:text-xl font-bold text-green-600">
                    {availableMoods.length}
                  </div>
                  <div className="text-xs lg:text-sm text-green-600">
                    Mood Variety
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            {/* <div className="mt-4">
              <SubscriptionStatusIndicator showUsage={false} />
            </div> */}

            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 btn btn-ghost rounded-lg transition-colors"
                title="Previous Month"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <h4 className="text-base lg:text-lg font-semibold">
                  {formatMonthYear(currentDate)}
                </h4>
                <button
                  onClick={goToCurrentMonth}
                  className="cursor-pointer px-2 lg:px-3 py-1 text-xs lg:text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  title="Go to Current Month"
                >
                  Today
                </button>
              </div>

              <button
                onClick={goToNextMonth}
                className="p-2 btn btn-ghost rounded-lg transition-colors"
                title="Next Month"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Section */}
            <div className="flex justify-center">
              <div className="grid grid-cols-7 gap-1 justify-center max-w-full overflow-x-auto">
                {/* Calendar header */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 p-1 lg:p-2 min-w-[32px] lg:min-w-[40px]"
                    >
                      {day}
                    </div>
                  )
                )}
                {/* Calendar days */}
                {generateCalendarDays(allEntries || []).map((day, index) => {
                  const isToday =
                    day.fullDate === new Date().toISOString().split("T")[0];
                  return (
                    <div
                      key={index}
                      className={`p-1 lg:p-2 text-xs lg:text-sm border rounded transition-colors h-14 w-10 relative ${
                        day.isCurrentMonth
                          ? day.hasEntry
                            ? "bg-green-100 border-green-300 text-green-800 font-medium"
                            : isToday
                            ? "bg-purple-100 border-purple-300 text-purple-800 font-bold"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}
                    >
                      {/* Date in top-left */}
                      <span className="absolute top-1 left-1 text-xs lg:text-sm">
                        {day.date}
                      </span>

                      {/* Check icon in center */}
                      {day.hasEntry && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CircleCheck className="w-3 h-3 lg:w-5 lg:h-5 text-success" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Has Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                <span>No Entry</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Journal Entry Form - Separate section */}
        <div className="flex-1 customContainer">
          <JournalEntryForm />
        </div>
      </div>
      {/* Entries List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="customContainer backdrop-blur-sm rounded-lg shadow-lg p-4 lg:p-6 border border-purple-200/50 border-l-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {entry.mood ? getMoodEmoji(entry.mood) : "📝"}
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold ">
                      {formatDateLong(entry.date)}
                    </h3>
                    {entry.mood && (
                      <p className="text-sm">Mood: {entry.mood}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.bookmarked && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                  <Link
                    href={`/journal/edit/${entry.id}`}
                    className="p-2 transition-colors"
                    title="Edit entry"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm lg:text-base">
                    What I Did Today
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm lg:text-base">
                    {entry.whatIDid}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm lg:text-base">
                    What I Learned Today
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm lg:text-base">
                    {entry.whatILearned}
                  </p>
                </div>

                {entry.additionalNotes && (
                  <div>
                    <h4 className="font-medium  mb-2 text-sm lg:text-base">
                      Additional Notes
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm lg:text-base">
                      {entry.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 lg:py-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
            </div>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
              No Journal Entries Yet
            </h3>
            <p className="text-gray-500 mb-4 lg:mb-6 text-sm lg:text-base px-4">
              Start your journaling journey by writing your first entry above
            </p>
            <button
              onClick={() => {
                // Scroll to the form
                document
                  .getElementById("journal-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm lg:text-base"
            >
              Write Your First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
