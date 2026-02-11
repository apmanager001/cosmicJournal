import React from 'react'
import Link from "next/link.js";
import { Calendar, Star } from "lucide-react";
import DashJournalCalendar from '../../dashboard/comps/dashJournalCalendar';
import { useAllJournalEntries } from "@/comp/utility/tanstack/habitHooks";

const JournalSidebar = () => {
  const { data: allEntries, isLoading, error } = useAllJournalEntries();
  const { useMemo } = React;


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
    const filteredEntries = useMemo(() => {
        if (!allEntries) return [];
        return allEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      }, [allEntries]);

    const formatDateLong = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };


    if (isLoading) {
      return (
        <div className="customContainer mx-auto px-4 py-8 min-w-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading journal entries...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="customContainer mx-auto px-4 py-8 min-w-90">
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
    <div className="w-full md:max-w-96 lg:flex-shrink-0 customContainer flex flex-col items-center p-6">
      <DashJournalCalendar />
      <div className="mt-6 text-left w-full">
        <span className="text-base-content/60">Last 5 Journals</span>
        {filteredEntries.length > 0 ? (
          <div className="mt-3 space-y-3">
            {filteredEntries.slice(0, 5).map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {entry.mood ? getMoodEmoji(entry.mood) : "📝"}
                    </div>
                    <div>
                      <p className="font-medium text-sm lg:text-base">
                        {formatDateLong(entry.date)}
                      </p>
                      {entry.whatIDid && (
                        <p className="text-xs lg:text-sm text-base-content/70 truncate max-w-65">
                          {entry.whatIDid}
                        </p>
                      )}
                    </div>
                  </div>
                  {entry.bookmarked && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="customContainer text-center py-8 lg:py-12 backdrop-blur-sm md:mt-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
            </div>
            <h3 className="text-base lg:text-lg font-medium mb-2">
              No Journal Entries Yet
            </h3>
            <p className="text-gray-500 mb-4 lg:mb-6 text-sm lg:text-base px-4">
              Start your journaling journey by writing your first entry
              above
            </p>
            <button className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm lg:text-base">
              Write Your First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalSidebar