"use client";
import React, { useMemo, useState } from "react";
import { NotebookPen, NotebookText } from "lucide-react";
import {
  useUserHabits,
  useTodayJournalEntry,
  useHabitLogs,
  useLogHabitCompletion,
} from "@/comp/utility/tanstack/habitHooks";
import { UserHabit, HabitLog } from "@/comp/utility/tanstack/habitTypes";
import Link from "next/link";
import NotesModal from "@/comp/utility/NotesModal";

interface WeeklyCalendarProps {
  className?: string;
}

// Separate component for each habit row to safely use hooks
function HabitRow({
  habit,
  weekDates,
  isToday,
  isHabitCompletedOnDate,
}: {
  habit: UserHabit;
  weekDates: Date[];
  isToday: (date: Date) => boolean;
  isHabitCompletedOnDate: (
    habit: UserHabit,
    date: Date,
    habitLogs: HabitLog[]
  ) => boolean;
}) {
  const { data: habitLogs } = useHabitLogs(habit.id);
  const logCompletionMutation = useLogHabitCompletion();
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleToggleCompletion = async (date: Date, isCompleted: boolean) => {
    try {
      await logCompletionMutation.mutateAsync({
        habitId: habit.id,
        completed: !isCompleted,
        notes: undefined,
      });
    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
    }
  };

  const handleOpenNotes = (date: Date) => {
    setSelectedDate(date);
    setNotesModalOpen(true);
  };

  const handleCloseNotes = () => {
    setNotesModalOpen(false);
    setSelectedDate(null);
  };

  // Get existing note for a specific date
  const getExistingNote = (date: Date) => {
    if (!habitLogs) return "";

    const targetDateStr = date.toISOString().split("T")[0];

    const log = habitLogs.find((log) => {
      let logDateStr = log.date;

      if (log.date.includes("T")) {
        logDateStr = log.date.split("T")[0];
      } else if (log.date.includes(" ")) {
        logDateStr = log.date.split(" ")[0];
      }

      return logDateStr === targetDateStr;
    });

    return log?.notes || "";
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center space-x-4 p-4 bg-base-300/50 rounded-lg hover:bg-base-300/70 transition-colors">
        <span className="text-3xl flex-shrink-0">{habit.habit.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base-content truncate text-lg">
            {habit.habit.name}
          </h4>
          <p className="text-center md:text-left text-sm text-base-content/70 capitalize">
            {habit.habit.category}
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          {weekDates.map((date) => {
            const isCompleted = isHabitCompletedOnDate(
              habit,
              date,
              habitLogs || []
            );
            const isTodayDate = isToday(date);
            const hasNote = getExistingNote(date).length > 0;

            return (
              <div
                key={date.toISOString()}
                className={`relative flex flex-col items-center ${
                  isTodayDate ? "ring-2 ring-primary/30 rounded-full p-1" : ""
                }`}
              >
                <button
                  onClick={() => handleToggleCompletion(date, isCompleted)}
                  disabled={logCompletionMutation.isPending}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-success hover:bg-success-focus text-success-content shadow-lg"
                        : "bg-base-200 hover:bg-base-300 text-base-content border border-base-content/20"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-110 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                  `}
                  aria-label={`${
                    isCompleted ? "Mark as incomplete" : "Mark as complete"
                  } for ${date.toLocaleDateString()}`}
                >
                  {logCompletionMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </button>

                {/* Day indicator below buttons */}
                <div className="mt-2 text-center">
                  <div className="text-xs font-bold text-base-content/80">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs text-base-content/60">
                    {date.getDate()}
                  </div>
                </div>

                {/* Notes button below completion button */}
                <button
                  onClick={() => handleOpenNotes(date)}
                  disabled={logCompletionMutation.isPending}
                  className={`
                    mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                    ${
                      hasNote
                        ? "bg-info hover:bg-info-focus text-info-content shadow-md"
                        : "bg-base-200 hover:bg-base-300 text-base-content/60 border border-base-content/20"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-110 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-info/50
                  `}
                  aria-label={`${
                    hasNote ? "Edit" : "Add"
                  } notes for ${date.toLocaleDateString()}`}
                >
                  {hasNote ? (
                    // <svg
                    //   className="w-3 h-3"
                    //   fill="currentColor"
                    //   viewBox="0 0 20 20"
                    // >
                    //   <path
                    //     fillRule="evenodd"
                    //     d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    //     clipRule="evenodd"
                    //   />
                    // </svg>
                    <NotebookText className="w-4 h-4" />
                  ) : (
                    <NotebookPen className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes Modal */}
      {selectedDate && (
        <NotesModal
          isOpen={notesModalOpen}
          onClose={handleCloseNotes}
          habit={habit}
          date={selectedDate}
          existingNote={getExistingNote(selectedDate)}
          isCompleted={isHabitCompletedOnDate(
            habit,
            selectedDate,
            habitLogs || []
          )}
        />
      )}
    </>
  );
}

export default function WeeklyCalendar({
  className = "",
}: WeeklyCalendarProps) {
  const { data: userHabits } = useUserHabits();
  const { data: todayJournalEntry } = useTodayJournalEntry();
  const [weekOffset, setWeekOffset] = useState(0);

  // Get user's current timezone
  const userTimezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  // Generate the week's dates based on offset using user's timezone
  const weekDates = useMemo(() => {
    // Create a date object in the user's local timezone
    const now = new Date();
    const localDate = new Date(
      now.toLocaleString("en-US", { timeZone: userTimezone })
    );

    const startOfWeek = new Date(localDate);
    const dayOfWeek = localDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    startOfWeek.setDate(localDate.getDate() - dayOfWeek + weekOffset * 7);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [weekOffset, userTimezone]);

  // Get today's date in YYYY-MM-DD format using user's timezone
  const today = useMemo(() => {
    const now = new Date();
    const localDate = new Date(
      now.toLocaleString("en-US", { timeZone: userTimezone })
    );

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, [userTimezone]);

  // Check if a date is today using user's timezone
  const isToday = (date: Date) => {
    const inputDateLocal = new Date(
      date.toLocaleString("en-US", { timeZone: userTimezone })
    );
    const inputDateStr = inputDateLocal.toISOString().split("T")[0];
    return inputDateStr === today;
  };

  // Get single letter day name
  const getDayLetter = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      timeZone: userTimezone,
      weekday: "short",
    })[0];
  };

  // Get date number
  const getDateNumber = (date: Date) => {
    const localDate = new Date(
      date.toLocaleString("en-US", { timeZone: userTimezone })
    );
    return localDate.getDate();
  };

  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (
    habit: UserHabit,
    date: Date,
    habitLogs: HabitLog[]
  ) => {
    if (!habitLogs || habitLogs.length === 0) return false;

    const targetDateStr = date.toISOString().split("T")[0];

    return habitLogs.some((log) => {
      if (!log.completed) return false;

      // Handle different date formats from PocketBase
      let logDateStr = log.date;

      // If the date includes time, extract just the date part
      if (log.date.includes("T")) {
        logDateStr = log.date.split("T")[0];
      } else if (log.date.includes(" ")) {
        logDateStr = log.date.split(" ")[0];
      }

      return logDateStr === targetDateStr;
    });
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  // Get week display text
  const getWeekDisplayText = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    if (weekOffset === 1) return "Next Week";
    if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
    return `In ${weekOffset} Weeks`;
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 pt-4 md:p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6 mx-4 md:mx-0">
        <div>
          <h2 className="text-xl font-semibold text-base-content">
            {getWeekDisplayText()}
          </h2>
          <p className="text-xs text-base-content/50 mt-1">
            Timezone: {userTimezone}
          </p>
        </div>
        <Link
          href="/habits"
          className="text-primary hover:text-primary-focus text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Week Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="md:p-2 rounded-full hover:bg-base-300 transition-colors"
          aria-label="Previous week"
        >
          <svg
            className="w-5 h-5 text-base-content/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="grid grid-cols-7 md:gap-2 flex-1 md:mx-4">
          {weekDates.map((date) => (
            <div
              key={date.toISOString()}
              className={`text-center p-2 rounded-lg ${
                isToday(date)
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-base-content/70"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-1">
                <span className="text-sm font-bold">{getDayLetter(date)}</span>
              </div>
              <div className="text-sm font-medium">{getDateNumber(date)}</div>
            </div>
          ))}
        </div>

        <button
          onClick={goToNextWeek}
          className="md:p-2 rounded-full hover:bg-base-300 transition-colors"
          aria-label="Next week"
        >
          <svg
            className="w-5 h-5 text-base-content/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Habits Grid */}
      {userHabits && userHabits.length > 0 ? (
        <div className="space-y-3">
          {userHabits.slice(0, 3).map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              weekDates={weekDates}
              isToday={isToday}
              isHabitCompletedOnDate={isHabitCompletedOnDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-base-content/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-base-content/70 mb-2">No habits to track</p>
          <p className="text-sm text-base-content/50 mb-4">
            Create your first habit to start building consistency
          </p>
          <Link href="/habits" className="btn btn-primary">
            Create Habit
          </Link>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-base-300">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {userHabits?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">Active Habits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {todayJournalEntry ? "1" : "0"}
            </div>
            <div className="text-sm text-base-content/70">
              Today&apos;s Entry
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info">
              {userHabits?.reduce(
                (total, habit) =>
                  total + (habit.streakType === "daily" ? 1 : 0),
                0
              ) || 0}
            </div>
            <div className="text-sm text-base-content/70">Daily Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
