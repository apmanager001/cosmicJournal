"use client";
import React, { useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToggleBookmark } from "@/comp/utility/tanstack/habitHooks";
import { JournalEntry } from "@/comp/utility/tanstack/habitTypes";

const DropdownJournal = ({
  entry,
}: {
  entry: JournalEntry;
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

  //  const handleRemoveBookmarkClick = (entryId: string, entryDate: string) => {
  //    setEntryToDelete({ id: entryId, date: entryDate });
  //    setIsDeleteModalOpen(true);
  //  };

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
       return newSet; // Ensure the updated Set<string> is returned
     });
   };
  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {formatDate(entry.date).weekday}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(entry.date).date}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              toggleBookmarkMutation.mutate({
                entryId: entry.id,
                bookmarked: !entry.bookmarked,
              })
            }
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
          >
            {entry.bookmarked ? (
              <Bookmark className="w-5 h-5 text-blue-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => toggleEntryExpansion(entry.id)}
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
          >
            {expandedEntries.has(entry.id) ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {expandedEntries.has(entry.id) && (
        <div className="mt-2">
          <div className="p-4 text-sm text-gray-700 bg-gray-50 rounded-md">
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

            {!entry.mood && (
              <div className="text-center py-4">
                <p className="text-base-content/50 text-sm">
                  No content available for this entry
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {isDeleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Delete Bookmark
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this bookmark?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveBookmark}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownJournal;
