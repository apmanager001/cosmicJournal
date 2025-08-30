"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import {
  useBookmarkedJournalEntries,
  useToggleBookmark,
} from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { Bookmark, Calendar, Edit3, Heart } from "lucide-react";
import SubscriptionLimitBanner from "@/comp/utility/SubscriptionLimitBanner";
import SubscriptionStatusIndicator from "@/comp/utility/SubscriptionStatusIndicator";
import Link from "next/link";

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
  const toggleBookmarkMutation = useToggleBookmark();

  const handleUnbookmark = (entryId: string) => {
    toggleBookmarkMutation.mutate({ entryId, bookmarked: false });
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
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="customContainer rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold ">
                  Bookmarked Entries
                </h1>
                <p className="text-gray-400">
                  Your favorite journal entries and reflections
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/journal"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Journal
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Limit Banner */}
        <SubscriptionLimitBanner
          resource="bookmarks"
          currentCount={bookmarkedEntries?.length || 0}
          className="mb-6"
        />

        {/* Subscription Status */}
        <div className="mb-6">
          <SubscriptionStatusIndicator />
        </div>

        {/* Bookmarked Entries */}
        {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedEntries.map((entry) => (
              <div key={entry.id} className="customContainer rounded-lg shadow-lg p-6">
                {/* Entry Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {formatDate(entry.date)}
                      </h3>
                      {entry.mood && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl">{entry.mood}</span>
                          <span className="text-sm text-gray-400">Mood</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUnbookmark(entry.id)}
                      disabled={toggleBookmarkMutation.isPending}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                    <Link
                      href={`/journal/${entry.date}`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit entry"
                    >
                      <Edit3 className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Entry Content */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      What I did today:
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {entry.whatIDid}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      What I learned today:
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {entry.whatILearned}
                    </p>
                  </div>

                  {entry.additionalNotes && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Additional notes:
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {entry.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Entry Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>Entry from {formatDate(entry.date)}</span>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Bookmarked</span>
                  </div>
                </div>
              </div>
            ))}
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/journal"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
