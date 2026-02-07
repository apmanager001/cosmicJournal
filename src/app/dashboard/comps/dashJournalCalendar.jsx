"use client";
import React, { useState } from "react";
import Calendar from "react-fill-calendar";
import { useAllJournalEntries } from "@/comp/utility/tanstack/habitHooks";

const DashJournalCalendar = () => {
  const { data: allEntries, isLoading, error } = useAllJournalEntries();
  const [currentDate] = useState(new Date());

  const generateCalendarDays = (entries = []) => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const loopDate = new Date(startDate);

    const toLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = toLocalDateString(loopDate);

      // Find the entry (if any) that matches this date (normalize entry dates to YYYY-MM-DD)
      const matchingEntry = entries?.find((entry) => {
        if (!entry.date) return false;
        const entryDate = new Date(entry.date);
        const entryDateStr = toLocalDateString(entryDate);
        return entryDateStr === dateStr;
      });

      const hasEntry = !!matchingEntry;

      days.push({
        date: loopDate.getDate(),
        isCurrentMonth: loopDate.getMonth() === currentMonth,
        hasEntry: hasEntry,
        entryId: matchingEntry?.id,
        fullDate: dateStr,
      });

      loopDate.setDate(loopDate.getDate() + 1);
    }

    return days;
  };

  if (isLoading) {
    return (
      <span className="loading loading-bars loading-md text-primary"></span>
    );
  }

  if (error) {
    return <div>Failed to load journal entries.</div>;
  }

  const calendarDays = generateCalendarDays(allEntries || []);

  // react-fill-calendar expects: [{ day: 'YYYY-MM-DD', href?: string }, ...]
  const selectedDates = calendarDays
    .filter((day) => day.hasEntry)
    .map((day) =>
      day.entryId
        ? { day: day.fullDate, href: `/journal/${day.entryId}` }
        : { day: day.fullDate },
    );
  return (
    <div>
      <Calendar title="Journal Entries" selectedDates={selectedDates} />
    </div>
  );
};

export default DashJournalCalendar;
