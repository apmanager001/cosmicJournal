import React, { useMemo } from "react";
import DayCell from "./dayCell";

// API:
// - selectedDates: array of strings in 'YYYY-MM-DD' format that should be filled
//   e.g. ['2026-02-01', '2026-02-10']
// Renders a strip of empty squares for 3 months:
// previous month, current month, next month.
const Calendar = ({ selectedDates = [], title = "Habit Calendar" }) => {
  const today = new Date();

  // Helper to format a date as YYYY-MM-DD so it matches selectedDates
  const formatDateKey = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Example set of selected days (today and the two previous days)
  const exampleSelectedDates = [
    formatDateKey(today),
    formatDateKey(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    ),
    formatDateKey(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    ),
  ];

  // Build an array of all days for 3 months: previous, current, next.
  const days = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11

    // From first day of previous month
    const startDate = new Date(year, month - 1, 1);
    // To last day of next month (0th day of month+2)
    const endDate = new Date(year, month + 2, 0);

    const result = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const key = formatDateKey(cursor);
      const isSelected = (
        selectedDates.length ? selectedDates : exampleSelectedDates
      ).includes(key);

      result.push({
        key,
        isSelected,
        // keep a Date copy in case you want to use it later
        dateObj: new Date(cursor),
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }, [selectedDates, today]);

  // Split days into rows of up to 15 cells each
  const rows = [];
  const chunkSize = 15;
  for (let i = 0; i < days.length; i += chunkSize) {
    rows.push(days.slice(i, i + chunkSize));
  }

  return (
    <div className="inline-flex flex-col gap-2 p-3 rounded-xl border border-gray-600 shadow-sm">
      <div className="flex justify-between">
        <strong className="text-sm text-gray-600">{title}</strong>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-4 h-4">
            <div
              className="absolute inset-0 rounded-md rainbow-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, #ff0000 0deg, #ff4000 20deg, #ff8000 40deg, #ffbf00 60deg, #ffff00 80deg, #bfff00 100deg, #80ff00 120deg, #40ff00 140deg, #00ff00 160deg, #00ff40 180deg, #00ff80 200deg, #00ffbf 220deg, #00ffff 240deg, #00bfff 260deg, #0080ff 280deg, #0040ff 300deg, #0000ff 320deg, #4000ff 340deg, #8000ff 360deg)",
                padding: "2px",
                boxShadow:
                  "0 0 8px rgba(255,0,255,0.35), 0 0 14px rgba(0,255,255,0.25)",
                borderRadius: "0.5rem",
              }}
            />
            <div className="relative flex items-center justify-center w-4 h-4 rounded-md p-[2px]">
              <button
                type="button"
                className={`
                    flex items-center justify-center
                    rounded-md border-2 transition-colors 
                    duration-150 w-full h-full border-transparent bg-gray-400
                    `}
              ></button>
            </div>
          </div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`
                flex items-center justify-center
                w-4 h-4 rounded-md border-2 transition-colors duration-150
               bg-emerald-500 border-emerald-600
            `}
          ></button>
          <span>Completed</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((day) => {
              const formatted = day.dateObj.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <DayCell
                  key={day.key}
                  isSelected={day.isSelected}
                  day={formatted}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
