"use client";
import React, { useState, useEffect } from "react";
import { useLogHabitCompletion } from "@/comp/utility/tanstack/habitHooks";
import { UserHabit } from "@/comp/utility/tanstack/habitTypes";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: UserHabit;
  date: Date;
  existingNote?: string;
  isCompleted: boolean;
}

export default function NotesModal({
  isOpen,
  onClose,
  habit,
  date,
  existingNote = "",
  isCompleted,
}: NotesModalProps) {
  const [note, setNote] = useState(existingNote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logCompletionMutation = useLogHabitCompletion();

  // Reset note when modal opens/closes or habit/date changes
  useEffect(() => {
    if (isOpen) {
      setNote(existingNote);
    }
  }, [isOpen, existingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await logCompletionMutation.mutateAsync({
        habitId: habit.id,
        completed: isCompleted,
        notes: note.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md modalContainer p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{habit.habit.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-base-content">Add Notes</h3>
            <p className="text-sm text-base-content/70">
              {habit.habit.name} - {formatDate(date)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="notes" className="label">
              <span className="label-text font-medium">Notes for this day</span>
            </label>
            <textarea
              id="notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your notes, thoughts, or observations..."
              className="textarea textarea-bordered border-primary w-full h-24 resize-none text-base-content"
              disabled={isSubmitting}
            />
            <div className="label">
              <span className="label-text-alt ">
                {note.length}/500 characters
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Note"
              )}
            </button>
          </div>
        </form>

        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}
