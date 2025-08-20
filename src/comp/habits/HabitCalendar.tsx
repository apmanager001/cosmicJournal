"use client";
import React, { useState, useMemo, useCallback } from "react";
import { HabitLog } from "../utility/tanstack/habitTypes";

interface HabitCalendarProps {
  habitLogs: HabitLog[];
  className?: string;
}

interface CalendarState {
  currentMonth: number;
  currentYear: number;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habitLogs,
  className = "",
}) => {
  const [calendarState, setCalendarState] = useState<CalendarState>(() => {
    const now = new Date();
    return {
      currentMonth: now.getMonth() - 1, // Start with previous month
      currentYear: now.getFullYear(),
    };
  });

  // Generate calendar data for 2 months
  const generateCalendarData = useCallback(() => {
    const calendar: { date: string; completed: boolean; intensity: number }[] =
      [];

    // Calculate start and end dates for the 2-month period
    const startDate = new Date(
      calendarState.currentYear,
      calendarState.currentMonth,
      1
    );
    const endDate = new Date(
      calendarState.currentYear,
      calendarState.currentMonth + 2,
      0
    ); // Last day of the second month

    // Create a map of completed dates for quick lookup
    const completedDates = new Map<string, boolean>();
    habitLogs.forEach((log) => {
      if (log.completed) {
        // Normalize the date to YYYY-MM-DD format to match calendar dates
        let normalizedDate = log.date;

        // If the date includes time, extract just the date part
        // Handle both ISO format (T) and space-separated format
        if (log.date.includes("T")) {
          normalizedDate = log.date.split("T")[0];
        } else if (log.date.includes(" ")) {
          normalizedDate = log.date.split(" ")[0];
        }

        // If the date is in a different format, try to parse and reformat
        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
          try {
            const dateObj = new Date(log.date);
            if (!isNaN(dateObj.getTime())) {
              normalizedDate = dateObj.toISOString().split("T")[0];
            }
          } catch {
            console.warn("Could not parse date:", log.date);
          }
        }

        completedDates.set(normalizedDate, true);
      }
    });

    // Generate all dates for the 2-month period
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const completed = completedDates.has(dateStr);

      // Calculate intensity based on completion (for future enhancement)
      const intensity = completed ? 1 : 0;

      calendar.push({
        date: dateStr,
        completed,
        intensity,
      });
    }

    return calendar;
  }, [calendarState, habitLogs]);

  // Group calendar data by weeks
  const groupByWeeks = useCallback(
    (calendar: { date: string; completed: boolean; intensity: number }[]) => {
      const weeks: { date: string; completed: boolean; intensity: number }[][] =
        [];
      let currentWeek: {
        date: string;
        completed: boolean;
        intensity: number;
      }[] = [];

      calendar.forEach((day, index) => {
        // Start new week on Sundays (day 0)
        if (index % 7 === 0 && currentWeek.length > 0) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        currentWeek.push(day);
      });

      // Add the last week if it has days
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      return weeks;
    },
    []
  );

  // Get month labels for the 2-month period
  const getMonthLabels = useCallback(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const labels: { month: string; offset: number }[] = [];

    // Get the first month label
    const firstMonth = months[calendarState.currentMonth];
    labels.push({ month: firstMonth, offset: 0 });

    // Get the second month label
    const secondMonthIndex = (calendarState.currentMonth + 1) % 12;
    const secondMonth = months[secondMonthIndex];

    // Calculate offset for second month based on actual week structure
    const firstMonthStart = new Date(
      calendarState.currentYear,
      calendarState.currentMonth,
      1
    );

    // Find the first day of the week for the first month
    const firstDayOfWeek = firstMonthStart.getDay();

    // Calculate how many weeks the first month takes up
    const firstMonthEnd = new Date(
      calendarState.currentYear,
      calendarState.currentMonth + 1,
      0
    );

    // Calculate total weeks: partial week at start + full weeks + partial week at end
    const daysInFirstMonth = firstMonthEnd.getDate();
    const totalWeeks = Math.ceil((daysInFirstMonth + firstDayOfWeek) / 7);

    // The offset should be the number of week columns, not just weeks
    // Each week column represents 7 days, so we need to account for the actual column position
    const offset = totalWeeks;

    labels.push({ month: secondMonth, offset: offset });

    return labels;
  }, [calendarState]);

  // Navigation functions
  const goToPreviousPeriod = () => {
    setCalendarState((prev) => {
      let newMonth = prev.currentMonth - 2;
      let newYear = prev.currentYear;

      if (newMonth < 0) {
        newMonth += 12;
        newYear -= 1;
      }

      return { currentMonth: newMonth, currentYear: newYear };
    });
  };

  const goToNextPeriod = () => {
    setCalendarState((prev) => {
      let newMonth = prev.currentMonth + 2;
      let newYear = prev.currentYear;

      if (newMonth >= 12) {
        newMonth -= 12;
        newYear += 1;
      }

      return { currentMonth: newMonth, currentYear: newYear };
    });
  };

  // Memoize calendar data to avoid unnecessary recalculations
  const calendar = useMemo(
    () => generateCalendarData(),
    [generateCalendarData]
  );
  const weeks = useMemo(() => groupByWeeks(calendar), [groupByWeeks, calendar]);
  const monthLabels = useMemo(() => getMonthLabels(), [getMonthLabels]);

  // Get color based on completion
  const getDayColor = (completed: boolean, intensity: number) => {
    if (!completed) return "bg-gray-100";

    // Different shades based on intensity (for future enhancement)
    if (intensity === 1) return "bg-green-500";
    if (intensity === 2) return "bg-green-600";
    if (intensity === 3) return "bg-green-700";
    if (intensity === 4) return "bg-green-800";

    return "bg-green-500";
  };

  // Get tooltip text
  const getTooltipText = (date: string, completed: boolean) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `${formattedDate}: ${completed ? "Completed" : "Not completed"}`;
  };

  return (
    <div
      className={`${className} flex flex-col items-center bg-white rounded-xl shadow-lg border border-gray-100 p-6`}
    >
      {/* Navigation and Month Display */}
      <div className="flex items-center justify-between mb-6 gap-4 w-full">
        <button
          onClick={goToPreviousPeriod}
          className="px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          ← Previous
        </button>

        <div className="text-sm font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
          {monthLabels.map((label, index) => (
            <span key={index}>
              {label.month} {calendarState.currentYear}
              {index < monthLabels.length - 1 ? " - " : ""}
            </span>
          ))}
        </div>

        <button
          onClick={goToNextPeriod}
          className="px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Next →
        </button>
      </div>

      {/* Month labels - horizontal at top */}
      <div className="flex mb-4 text-xs text-gray-600 overflow-x-auto relative">
        {monthLabels.map((label, index) => {
          // Calculate the actual position based on week columns
          // Each week column is 14px wide (w-3 + mr-1)
          const weekColumnWidth = 14;
          const position = label.offset * weekColumnWidth;

          // Add left margin to account for the day labels (Sun, Mon, Tue, etc.)
          // The day labels take up space on the left side of the calendar
          const dayLabelsWidth = 40; // Approximate width of day labels + margin
          const adjustedPosition = position + dayLabelsWidth;

          return (
            <div
              key={index}
              className="text-center flex-shrink-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 rounded-md border border-blue-200 text-blue-800 font-medium shadow-sm"
              style={{
                marginLeft: `${adjustedPosition}px`,
                minWidth: `${weekColumnWidth}px`,
              }}
            >
              {label.month}
            </div>
          );
        })}
      </div>

      {/* Calendar grid - horizontal */}
      <div className="flex">
        {/* Day labels - vertical on left */}
        <div className="flex flex-col mr-3 text-xs text-gray-500 font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-3 mb-1 flex items-center justify-end pr-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar squares - horizontal scrolling */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex" style={{ minWidth: "max-content" }}>
            {weeks.map((week, weekIndex) => {
              return (
                <div
                  key={weekIndex}
                  className="flex flex-col mr-1"
                  style={{
                    minWidth: "14px", // Ensure consistent width
                  }}
                >
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                           w-3 h-3 mb-1 rounded-md border-2 transition-all duration-200
                           hover:scale-125 hover:shadow-md cursor-pointer
                           ${
                             day.completed
                               ? "border-green-300 shadow-sm"
                               : "border-gray-200 hover:border-gray-300"
                           }
                           ${getDayColor(day.completed, day.intensity)}
                         `}
                      title={getTooltipText(day.date, day.completed)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-6 text-xs text-gray-600">
        <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 rounded-md border-2 border-gray-300"></div>
              <span className="font-medium">Not completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-md border-2 border-green-300 shadow-sm"></div>
              <span className="font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
