"use client";
import React, { useMemo, useState } from "react";
import { NotebookPen, NotebookText } from "lucide-react";
import {
  useUserHabits,
  useHabitLogs,
  useLogHabitCompletion,
  useJournalEntry,
} from "@/comp/utility/tanstack/habitHooks";
import { UserHabit, HabitLog } from "@/comp/utility/tanstack/habitTypes";
import Link from "next/link";
import NotesModal from "./NotesModal";
import RainbowRing from "./RainbowRing";
import DailyJournal from "./dailyJournal";
import ButtonComp from "./buttonComp";

interface WeeklyCalendarProps {
  className?: string;
}

// Helper function to get single letter day name
const getDayLetter = (date: Date, userTimezone: string) => {
  return date.toLocaleDateString("en-US", {
    timeZone: userTimezone,
    weekday: "short",
  })[0];
};

// Component to check if there's a journal entry for a specific date
function JournalEntryIndicator({
  date,
  userTimezone,
}: {
  date: Date;
  userTimezone: string;
}) {
  const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const { data: journalEntry } = useJournalEntry(dateString);

  if (!journalEntry) {
    return (
      <span className="text-sm font-bold">
        {getDayLetter(date, userTimezone)}
      </span>
    );
  }

  return (
    <RainbowRing size="sm" animated={true} className="w-6 h-6">
      <span className="text-sm font-bold">
        {getDayLetter(date, userTimezone)}
      </span>
    </RainbowRing>
  );
}

// Separate component for each habit row to safely use hooks
function HabitRow({
  habit,
  selectedDate,
  isToday,
  isHabitCompletedOnDate,
}: {
  habit: UserHabit;
  selectedDate: Date;
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
  const [notesDate, setNotesDate] = useState<Date | null>(null);

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
    setNotesDate(date);
    setNotesModalOpen(true);
  };

  const handleCloseNotes = () => {
    setNotesModalOpen(false);
    setNotesDate(null);
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
      <div className="flex flex-row items-center gap-4 p-4 bg-base-300/50 rounded-lg hover:bg-base-300/70 transition-colors">
        <span className="text-3xl flex-shrink-0">{habit.habit.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base-content truncate text-lg">
              {habit.habit.name}
            </h4>
            {/* Notes button - positioned next to habit name */}
            <button
              onClick={() => handleOpenNotes(selectedDate)}
              disabled={logCompletionMutation.isPending}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${
                  getExistingNote(selectedDate).length > 0
                    ? "bg-info/20 hover:bg-info/30 text-info"
                    : "bg-base-200/50 hover:bg-base-300/50 text-base-content/40"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-info/50
              `}
              aria-label={`${
                getExistingNote(selectedDate).length > 0 ? "Edit" : "Add"
              } notes for ${selectedDate.toLocaleDateString()}`}
            >
              {getExistingNote(selectedDate).length > 0 ? (
                <NotebookText className="w-3 h-3 cursor-pointer" />
              ) : (
                <NotebookPen className="w-3 h-3 cursor-pointer" />
              )}
            </button>
          </div>
          <p className="badge badge-primary badge-soft text-center md:text-left text-sm text-base-content/70 capitalize">
            {habit.habit.category}
          </p>
        </div>
        <div className="flex items-center justify-center md:justify-start">
          {(() => {
            const date = selectedDate;
            const isCompleted = isHabitCompletedOnDate(
              habit,
              date,
              habitLogs || []
            );
            const isTodayDate = isToday(date);
            const dayContent = (
              <>
                <button
                  onClick={() => handleToggleCompletion(date, isCompleted)}
                  disabled={logCompletionMutation.isPending}
                  className={`
                    cursor-pointer m-1 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 z-50
                    ${
                      isCompleted
                        ? "bg-success hover:bg-success-focus text-success-content shadow-lg "
                        : "bg-base-200 hover:bg-base-300 text-base-content border border-base-content/20 cursor-pointer"
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
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : isCompleted ? (
                    <svg
                      className="w-6 h-6"
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
                      className="w-6 h-6"
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

                {/* Day info next to button */}
                {/* <div className="ml-4 text-left flex-1">
                  <div className="text-sm font-bold text-base-content">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-base-content/60">
                    {isTodayDate ? "Today" : ""}
                  </div>
                </div> */}
              </>
            );

            return (
              <div className="relative flex items-center w-full">
                {isTodayDate ? (
                  <RainbowRing size="md" animated={true}>
                    {dayContent}
                  </RainbowRing>
                ) : (
                  dayContent
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Notes Modal */}
      {notesDate && (
        <NotesModal
          isOpen={notesModalOpen}
          onClose={handleCloseNotes}
          habit={habit}
          date={notesDate}
          existingNote={getExistingNote(notesDate)}
          isCompleted={isHabitCompletedOnDate(
            habit,
            notesDate,
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
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    // Use Intl.DateTimeFormat for more reliable timezone handling
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: userTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(now);
  }, [userTimezone]);

  // Check if a date is today using user's timezone
  const isToday = (date: Date) => {
    // Use Intl.DateTimeFormat for more reliable timezone handling
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: userTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const inputDateStr = formatter.format(date);
    return inputDateStr === today;
  };

  // Get date number
  const getDateNumber = (date: Date) => {
    // Use Intl.DateTimeFormat for more reliable timezone handling
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: userTimezone,
      day: "numeric",
    });
    return parseInt(formatter.format(date));
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
    setSelectedDate(null); // Reset selection when changing weeks
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
    setSelectedDate(null); // Reset selection when changing weeks
  };

  // Get week display text
  const getWeekDisplayText = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    if (weekOffset === 1) return "Next Week";
    if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
    return `In ${weekOffset} Weeks`;
  };

  // Handle day selection
  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle going to today
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  // Get the currently selected date (defaults to today if none selected)
  const currentSelectedDate =
    selectedDate || weekDates.find(isToday) || weekDates[0];

  // If selectedDate is set and it's not in the current week, we need to adjust the week offset
  React.useEffect(() => {
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString();
      const isInCurrentWeek = weekDates.some(
        (date) => date.toDateString() === selectedDateStr
      );

      if (!isInCurrentWeek) {
        // Calculate which week the selected date belongs to
        const today = new Date();
        const selectedWeekStart = new Date(selectedDate);
        const todayWeekStart = new Date(today);

        // Get start of week for both dates
        const selectedDayOfWeek = selectedDate.getDay();
        const todayDayOfWeek = today.getDay();

        selectedWeekStart.setDate(selectedDate.getDate() - selectedDayOfWeek);
        todayWeekStart.setDate(today.getDate() - todayDayOfWeek);

        // Calculate the difference in weeks
        const timeDiff = selectedWeekStart.getTime() - todayWeekStart.getTime();
        const weeksDiff = Math.round(timeDiff / (7 * 24 * 60 * 60 * 1000));

        setWeekOffset(weeksDiff);
      }
    }
  }, [selectedDate, weekDates]);

  return (
    // <div
    //   className={`bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 pt-4 md:p-6 ${className}`}
    // >
    <div className={`customContainer pt-4 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-1 mx-2 md:mx-0 gap-4">
        <div>
          <h2 className="text-center text-xl font-semibold text-base-content">
            {getWeekDisplayText()}
          </h2>
        </div>
        <div className="bg-base-300/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-base-content">
            {currentSelectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-base-content/70">
            {currentSelectedDate.toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mx-2 mb-1">
        <p className="text-xs text-base-content/50">Timezone: {userTimezone}</p>
        <button
          onClick={goToToday}
          className="btn btn-sm btn-neutral rounded-full cursor-pointer text-base-content/70"
        >
          Today
        </button>
      </div>

      {/* Week Header with Navigation */}
      <div className="flex items-center justify-between mb-4 bg-base-300/50 md:rounded-lg p-2">
        <button
          onClick={goToPreviousWeek}
          className="md:p-2 rounded-full hover:bg-base-300 transition-colors cursor-pointer"
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
          {weekDates.map((date) => {
            const isSelected =
              currentSelectedDate &&
              currentSelectedDate.toDateString() === date.toDateString();
            const isTodayDate = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDaySelect(date)}
                className={`cursor-pointer text-center p-2 rounded-lg transition-all duration-200 hover:bg-base-300/50 ${
                  isSelected
                    ? "bg-primary text-primary-content font-semibold shadow-md"
                    : isTodayDate
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                    isSelected
                      ? "bg-primary-content/20"
                      : "bg-white/10 backdrop-blur-md"
                  }`}
                >
                  <JournalEntryIndicator
                    date={date}
                    userTimezone={userTimezone}
                  />
                </div>
                <div className="text-sm font-medium">{getDateNumber(date)}</div>
              </button>
            );
          })}
        </div>

        <button
          onClick={goToNextWeek}
          className="md:p-2 rounded-full hover:bg-base-300 transition-colors cursor-pointer"
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
      <ButtonComp />
      <div className="mb-3">
        <DailyJournal selectedDate={currentSelectedDate} />
      </div>
      {/* Habits Grid */}
      {userHabits && userHabits.length > 0 ? (
        <div className="space-y-3">
          {userHabits.slice(0, 3).map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              selectedDate={currentSelectedDate}
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
    </div>
  );
}
