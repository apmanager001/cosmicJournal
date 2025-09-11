"use client";
import React, { useState } from "react";
import {
  Bookmark,
  Calendar,
  Edit3,
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToggleBookmark } from "@/comp/utility/tanstack/habitHooks";
import Link from "next/link";
import { JournalEntry } from "@/comp/utility/tanstack/habitTypes";

const DropdownJournal = ({
  entry,
  hasContent,
}: {
  entry: JournalEntry;
  hasContent: boolean;
}) => {
  const toggleBookmarkMutation = useToggleBookmark();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{
    id: string;
    date: string;
  } | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );
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
              className="btn btn-ghost btn-soft rounded-lg"
              title="Edit entry"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveBookmarkClick(entry.id, entry.date);
              }}
              disabled={toggleBookmarkMutation?.isPending || false}
              className="rounded-lg btn btn-error btn-soft"
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
                <h4 className="font-medium mb-2">What I did today:</h4>
                <p className="text-base-content/80 bg-base-200/50 p-3 rounded-lg">
                  {entry.whatIDid}
                </p>
              </div>
            )}

            {entry.whatILearned && (
              <div>
                <h4 className="font-medium mb-2">What I learned today:</h4>
                <p className="text-base-content/80 bg-base-200/50 p-3 rounded-lg">
                  {entry.whatILearned}
                </p>
              </div>
            )}

            {entry.additionalNotes && (
              <div>
                <h4 className="font-medium mb-2">Additional notes:</h4>
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
};

export default DropdownJournal;
