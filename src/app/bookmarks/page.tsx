"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import {
  useBookmarkedJournalEntries,
} from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import {
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import DropdownJournal from "../journal/comp/dropdownJournal";

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
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="customContainer rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="md:text-3xl text-xl font-bold ">
                  Bookmarked Entries
                </h1>
                <p className="text-xs md:text-md text-gray-400">
                  Your favorite journal entries and reflections
                </p>
              </div>
            </div>
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

        {/* Subscription Limit Banner */}
        {/* <SubscriptionLimitBanner
          resource="bookmarks"
          currentCount={bookmarkedEntries?.length || 0}
          className="mb-6"
        /> */}

        {/* Subscription Status */}
        {/* <div className="mb-6">
          <SubscriptionStatusIndicator />
        </div> */}

        {/* Bookmarked Entries */}
        {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
          <div className="space-y-3">
            {bookmarkedEntries.map((entry) => {
              const hasContent =
                entry.whatIDid?.trim() ||
                entry.whatILearned?.trim() ||
                entry.additionalNotes?.trim();

              return (
                <DropdownJournal key={entry.id} entry={entry} hasContent={hasContent} />
              );
            })}  
          </div>
        ) : (
          <div className="customContainer rounded-lg shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold  mb-2">
              No bookmarked entries yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start journaling and bookmark your favorite entries to see them
              here
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
    </div>
  );
}
