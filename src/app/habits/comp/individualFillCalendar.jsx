import Calendar from "react-fill-calendar";
import React, { useState, useMemo } from "react";
import {
  useLogHabitCompletion,
  useHabitLogs,
} from "@/comp/utility/tanstack/habitHooks";
import { CheckCircle, Circle, TrendingUp, Flame } from "lucide-react";

const IndividualFillCalendar = ({ habitId, title, removeButton = true }) => {
  const { data: habitLogs, isLoading: logsLoading } = useHabitLogs(habitId);
  const [notes, setNotes] = useState("");
  const logCompletionMutation = useLogHabitCompletion();

  const habitLogsResult = useHabitLogs(habitId);
  const allLogs = habitLogsResult.data;

  const today = React.useMemo(() => {
    const now = new Date();
    // Use local date to avoid timezone issues
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const completed = habitLogs
    ? habitLogs.map((log) => ({
        day: new Date(log.date).toISOString().split("T")[0],
      }))
    : [];

    const todayLog = React.useMemo(() => {
      if (!allLogs || !today) return [];
      return allLogs.filter((log) => {
        const logDate = log.date.split(" ")[0]; // Remove time part
        return logDate === today;
      });
    }, [allLogs, today]);

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

    const handleToggleCompletion = () => {
      if (isCompletedToday) {
        // Mark as incomplete - update existing log
        logCompletionMutation.mutate({
          habitId: habitId,
          completed: false,
          notes: notes || undefined,
        });
      } else {
        // Mark as complete - create or update log
        logCompletionMutation.mutate({
          habitId: habitId,
          completed: true,
          notes: notes || undefined,
        });
      }
    };
  return (
    <div className="flex items-center mt-2">
      <Calendar
        key={habitId}
        title={title}
        selectedDates={completed}
        hoverborderColor="#FFCCCB"
        mainBorder={false}
      />
      {removeButton && (
        <button
          onClick={handleToggleCompletion}
          disabled={isCompletedToday}
          className={`
            h-32 p-2 rounded-r-full transition-all duration-200 -ml-[4px] z-10
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
      )}
    </div>
    
  );};

export default IndividualFillCalendar;
