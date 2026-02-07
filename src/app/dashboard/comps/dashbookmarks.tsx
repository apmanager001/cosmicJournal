'use client'
import React from 'react'
import { Bookmark } from 'lucide-react';
import { useBookmarkedJournalEntries } from "@/comp/utility/tanstack/habitHooks";
import Link from 'next/link.js';
import { Star } from 'lucide-react';

const DashBookmarks = () => {
  const { data: bookmarkedEntries, isLoading } = useBookmarkedJournalEntries();

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

  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="inline-flex flex-col gap-2 p-3 mb-6">
      {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
        <div className="text-left w-full ">
          <span className="text-base-content/60">Bookmarked Journal Entries</span>
          <div className="mt-3 space-y-3">
            {bookmarkedEntries.slice(0, 5).map((entry) => (
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
        </div>
      ) : (
        <div className="text-center pt-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold  mb-2">
            No bookmarked entries yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start journaling and bookmark your favorite entries to see them here
          </p>
        </div>
      )}
    </div>
  );
}

export default DashBookmarks