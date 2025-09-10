"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import {
  useBookmarkedJournalEntries,
  useToggleBookmark,
} from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import {
  Bookmark,
  Calendar,
  Edit3,
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{
    id: string;
    date: string;
  } | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );

  const handleRemoveBookmarkClick = (entryId: string, entryDate: string) => {
    setEntryToDelete({ id: entryId, date: entryDate });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmRemoveBookmark = () => {
    if (entryToDelete) {
      toggleBookmarkMutation.mutate({
        entryId: entryToDelete.id,
        bookmarked: false,
      });
      setIsDeleteModalOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEntryToDelete(null);
  };

  const toggleEntryExpansion = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      weekday: date.toLocaleDateString("en-US", {
        weekday: "long",
      }),
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
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
              const isExpanded = expandedEntries.has(entry.id);
              const hasContent =
                entry.whatIDid?.trim() ||
                entry.whatILearned?.trim() ||
                entry.additionalNotes?.trim();

              return (
                <div
                  key={entry.id}
                  className="bg-base-300/50 rounded-lg hover:bg-base-300/70 transition-colors"
                >
                  {/* Header - Clickable to toggle dropdown */}
                  <div
                    className="flex flex-row items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleEntryExpansion(entry.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex flex-col">
                          <h4 className="font-semibold text-base-content">
                            {formatDate(entry.date).weekday}
                          </h4>
                          <p className="text-sm text-base-content/70">
                            {formatDate(entry.date).date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-base-content/60">
                            {entry.mood ? `${entry.mood} • ` : ""}Journal Entry
                          </p>
                          {/* Entry status indicator */}
                          {hasContent ? (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <span className="text-xs text-success font-medium">
                                Entry saved
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-base-content/30 rounded-full"></div>
                              <span className="text-xs text-base-content/50">
                                No content
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons and chevron */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/journal/${entry.date}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit entry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBookmarkClick(entry.id, entry.date);
                          }}
                          disabled={toggleBookmarkMutation.isPending}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Chevron Icon */}
                      <div className="text-base-content/60 transition-transform duration-200 ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Content */}
                  {isExpanded && (
                    <div className="border-t border-base-content/10 p-6">
                      {/* Entry Content */}
                      <div className="space-y-4">
                        {entry.whatIDid && (
                          <div>
                            <h4 className="font-medium mb-2">
                              What I did today:
                            </h4>
                            <p className="text-base-content/80 bg-base-200/50 p-3 rounded-lg">
                              {entry.whatIDid}
                            </p>
                          </div>
                        )}

                        {entry.whatILearned && (
                          <div>
                            <h4 className="font-medium mb-2">
                              What I learned today:
                            </h4>
                            <p className="text-base-content/80 bg-base-200/50 p-3 rounded-lg">
                              {entry.whatILearned}
                            </p>
                          </div>
                        )}

                        {entry.additionalNotes && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Additional notes:
                            </h4>
                            <p className="text-base-content/80 bg-base-200/50 p-3 rounded-lg">
                              {entry.additionalNotes}
                            </p>
                          </div>
                        )}

                        {entry.mood && (
                          <div>
                            <h4 className="font-medium mb-2">Mood:</h4>
                            <div className="flex items-center gap-2 bg-base-200/50 p-3 rounded-lg">
                              <span className="text-2xl">{entry.mood}</span>
                              <span className="text-sm text-base-content/60">
                                How I was feeling
                              </span>
                            </div>
                          </div>
                        )}

                        {!hasContent && !entry.mood && (
                          <div className="text-center py-4">
                            <p className="text-base-content/50 text-sm">
                              No content available for this entry
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Entry Footer */}
                      <div className="mt-6 pt-4 border-t border-base-content/10 flex items-center justify-between text-sm text-base-content/60">
                        <span>Entry from {formatDate(entry.date).date}</span>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Bookmarked</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

      {/* Remove Bookmark Confirmation Modal */}
      <div className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Remove Bookmark</h3>
              <p className="text-sm text-gray-500">
                {entryToDelete &&
                  `${formatDate(entryToDelete.date).weekday}, ${
                    formatDate(entryToDelete.date).date
                  }`}
              </p>
            </div>
          </div>

          <p className="mb-6">
            Are you sure you want to remove this entry from your bookmarks? The
            journal entry will remain in your journal but will no longer appear
            in your bookmarked entries.
          </p>

          <div className="modal-action">
            <button
              onClick={handleCancelDelete}
              className="btn btn-outline"
              disabled={toggleBookmarkMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemoveBookmark}
              className="btn btn-error"
              disabled={toggleBookmarkMutation.isPending}
            >
              {toggleBookmarkMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Removing...
                </>
              ) : (
                "Remove Bookmark"
              )}
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={handleCancelDelete}></div>
      </div>
    </div>
  );
}
