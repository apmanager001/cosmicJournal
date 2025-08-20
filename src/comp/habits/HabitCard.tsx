"use client";
import React, { useState, useMemo, useEffect } from "react";
import { UserHabit, HabitStreak } from "../utility/tanstack/habitTypes";
import {
  useLogHabitCompletion,
  useHabitStreak,
  useHabitLogs,
} from "../utility/tanstack/habitHooks";
import { CheckCircle, Circle, TrendingUp, Flame } from "lucide-react";

interface HabitCardProps {
  habit: UserHabit;
  className?: string;
}

export default function HabitCard({
  habit,
  className = "",
}: {
  habit: UserHabit;
  className?: string;
}) {
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const logCompletionMutation = useLogHabitCompletion();

  // Use useMemo with stable dependency to prevent query key changes
  const today = React.useMemo(() => {
    const now = new Date();
    // Use local date to avoid timezone issues
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []); // Empty dependency array - only calculate once per component mount

  // Get all habit logs for this habit (no date filtering to avoid query key changes)
  const {
    data: allLogs,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useHabitLogs(habit.id);

  // Filter today's log from all logs
  const todayLog = React.useMemo(() => {
    if (!allLogs || !today) return [];
    return allLogs.filter((log) => {
      const logDate = log.date.split(" ")[0]; // Remove time part
      return logDate === today;
    });
  }, [allLogs, today]);

  // If there's an error, try to refetch
  React.useEffect(() => {
    if (logsError && !todayLog && !logsLoading && !logsError.isAbort) {
      // Only retry if there's an error, no data, not loading, and not auto-cancelled
      const timer = setTimeout(() => {
        refetchLogs();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [logsError, todayLog, logsLoading, refetchLogs]);
  const { data: streakData } = useHabitStreak(habit.id);

  // Utility function to normalize dates for comparison
  const normalizeDate = (dateString: string) => {
    return dateString.split(" ")[0]; // Remove time part, keep only YYYY-MM-DD
  };

  const isCompletedToday = useMemo(() => {
    // Check if we have a log for today and it's marked as completed
    if (!todayLog || todayLog.length === 0) {
      return false;
    }

    // PocketBase stores dates as "2025-08-18 00:00:00", so we need to normalize for comparison
    const todayNormalized = today; // Already in YYYY-MM-DD format
    const logDate = todayLog[0]?.date;

    // Check if the log date starts with today's date (ignoring time)
    const isToday = logDate && logDate.startsWith(todayNormalized);
    const completed = isToday && todayLog[0]?.completed;

    return completed || false;
  }, [todayLog, today]);

  // Initialize notes with today's existing notes if available
  React.useEffect(() => {
    if (todayLog && todayLog.length > 0 && todayLog[0]?.notes) {
      setNotes(todayLog[0].notes);
    }
  }, [todayLog]);

  const handleToggleCompletion = () => {
    if (isCompletedToday) {
      // Mark as incomplete - update existing log
      logCompletionMutation.mutate({
        habitId: habit.id,
        completed: false,
        notes: notes || undefined,
      });
    } else {
      // Mark as complete - create or update log
      logCompletionMutation.mutate({
        habitId: habit.id,
        completed: true,
        notes: notes || undefined,
      });
    }
  };

  const handleSaveNotes = () => {
    // Preserve the current completion status when saving notes
    const currentCompletionStatus = isCompletedToday;
    logCompletionMutation.mutate({
      habitId: habit.id,
      completed: currentCompletionStatus,
      notes: notes.trim() || undefined,
    });
    setShowNotes(false);
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 7) return <Flame className="w-4 h-4 text-orange-500" />;
    if (streak >= 3) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-orange-600";
    if (streak >= 3) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Habit Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {habit.habit.icon || "🎯"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {habit.habit.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {habit.personalDescription}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span
              className={`px-2 py-1 rounded-full ${
                habit.streakType === "daily"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {habit.streakType === "daily"
                ? "Daily"
                : `${habit.weeklyGoal || 5}/7 days`}
            </span>
          </div>
        </div>

        {/* Completion Button */}
        <button
          onClick={handleToggleCompletion}
          disabled={isCompletedToday}
          className={`
            p-3 rounded-full transition-all duration-200 hover:scale-105
            ${
              isCompletedToday
                ? "bg-green-100 text-green-600 hover:bg-green-200 disabled:cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
            }
            disabled:opacity-50 
          `}
        >
          {isCompletedToday ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6 cursor-pointer" />
          )}
        </button>
      </div>

      {/* Loading State - Skeleton */}
      {logsLoading && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="space-y-3">
            {/* Streak skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Information */}
      {!logsLoading && streakData && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStreakIcon(streakData.currentStreak)}
              <span
                className={`font-semibold ${getStreakColor(
                  streakData.currentStreak
                )}`}
              >
                {streakData.currentStreak} day
                {streakData.currentStreak !== 1 ? "s" : ""} streak
              </span>
            </div>
            <div className="text-right text-sm text-gray-600 flex flex-col gap-2">
              <div className="badge badge-primary">
                Best: {streakData.longestStreak} days
              </div>
              <div className="badge badge-secondary">
                Total: {streakData.totalCompletions} times
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State - Only show when not loading and there's an error */}
      {logsError && !logsLoading && !allLogs && !logsError.isAbort && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="text-sm text-red-700">
              Error loading habit data
            </span>
            <button
              onClick={() => refetchLogs()}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="border-t border-gray-100 pt-4">
        {/* Loading skeleton for notes */}
        {logsLoading && (
          <div className="space-y-3">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        )}

        {/* Show existing notes if they exist */}
        {!logsLoading &&
          todayLog &&
          todayLog.length > 0 &&
          todayLog[0]?.notes &&
          !showNotes && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Today&apos;s Notes:
                </span>
                <button
                  onClick={() => setShowNotes(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-blue-700">{todayLog[0].notes}</p>
            </div>
          )}

        {/* Notes button and form - only show when not loading */}
        {!logsLoading && (
          <>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-sm text-blue-600 hover:text-blue-700 mb-2 cursor-pointer"
            >
              {showNotes
                ? "Hide"
                : todayLog && todayLog.length > 0 && todayLog[0]?.notes
                ? "Edit"
                : "Add"}{" "}
              notes for today
            </button>

            {showNotes && (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about your progress..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    {isCompletedToday ? "Update notes" : "Save with notes"}
                  </button>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading State */}
      {logCompletionMutation.isPending && (
        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
