"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useBookmarkedJournalEntries } from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import DailyJournal from "../dashboard/comp/dailyJournal";

export default function BookmarksPage() {
  return (
    <ProtectedRoute>
      <BookmarksContent />
    </ProtectedRoute>
  );
}

function BookmarksContent() {
  const {} = useAuth();
  const {} = useSubscription();
  const { data: bookmarkedEntries, isLoading } = useBookmarkedJournalEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <div className="flex-1 customContainer flex justify-center items-center p-6 mb-2 md:mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <div
              className={`border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105`}
            >
              <Bookmark strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">Bookmarks</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Your favorite journal entries and reflections
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary rounded-lg text-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/journal"
                  className="px-4 py-2 bg-secondary rounded-lg text-center"
                >
                  Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bookmarked Entries */}
      {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
        <div className="space-y-3">
          {bookmarkedEntries.map((entry) => {
            const formattedDate = new Date(entry.date).toString(); // Format the date to the required format
            return <DailyJournal key={entry.id} selectedDate={formattedDate} />;
          })}
        </div>
      ) : (
        <div className="customContainer items-center rounded-lg shadow-lg p-12 text-center min-h-[500px]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold  mb-2">
            No bookmarked entries yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start journaling and bookmark your favorite entries to see them here
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary rounded-lg text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/journal"
              className="px-6 py-3 bg-secondary rounded-lg text-center"
            >
              Start Journaling
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
