'use client'
import React from 'react'
import { Bookmark } from 'lucide-react';
import { useBookmarkedJournalEntries } from "@/comp/utility/tanstack/habitHooks";
import DailyJournal from '../comp/dailyJournal.jsx';

const DashBookmarks = () => {
  const { data: bookmarkedEntries, isLoading } =
    useBookmarkedJournalEntries();
  return (
    <div className="inline-flex flex-col gap-2 p-3 mb-6">
      {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
        <div>
          {bookmarkedEntries.map((entry) => {
            const formattedDate = new Date(entry.date).toString(); // Format the date to the required format
            return <DailyJournal key={entry.id} selectedDate={formattedDate} />;
          })}
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