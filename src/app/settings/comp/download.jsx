import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download as DownloadIcon, Info } from "lucide-react";
import {
  useUserHabits,
  useAllJournalEntries,
} from "@/comp/utility/tanstack/habitHooks";
import { habitService } from "@/comp/utility/tanstack/habitService";

function arrayToCSV(items = [], fields = []) {
  const header = fields.join(",");
  const rows = items.map((item) => {
    return fields
      .map((f) => {
        const val = item?.[f] ?? "";
        if (Array.isArray(val))
          return `"${String(val.join(";")).replace(/"/g, '""')}"`;
        const s = String(val).replace(/"/g, '""');
        return `"${s}"`;
      })
      .join(",");
  });
  return [header, ...rows].join("\r\n");
}

function downloadCSV(items, fields, filename) {
  const csv = arrayToCSV(items, fields);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const Download = () => {
  const { data: userHabits, isLoading: habitsLoading } = useUserHabits();
  const {
    data: allEntries,
    isLoading: journalsLoading,
  } = useAllJournalEntries();
  const queryClient = useQueryClient();
  const [habitsDownloading, setHabitsDownloading] = React.useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const handleDownloadHabits = async () => {
    const habitsSource = Array.isArray(userHabits) ? userHabits : [];
    if (!habitsSource.length) return;

    setHabitsDownloading(true);
    try {
      const allLogsByHabit = await Promise.all(
        habitsSource.map(async (habit) => {
          const logs = await queryClient.fetchQuery({
            queryKey: ["habitLogs", habit.id],
            queryFn: () => habitService.getHabitLogs(habit.id),
          });

          return logs.map((log) => ({
            Habit: habit.habit?.name ?? "",
            Date: log.date ?? "",
            Completed: log.completed ? "Yes" : "No",
            Notes: log.notes ?? "",
            "Created On": log.created ?? "",
            "Updated On": log.updated ?? "",
          }));
        }),
      );

      const flatLogs = allLogsByHabit.flat();
      if (!flatLogs.length) return;

      const fields = [
        "Habit",
        "Date",
        "Completed",
        "Notes",
        "Created On",
        "Updated On",
      ];

      downloadCSV(flatLogs, fields, `habit-logs-${today}.csv`);
    } finally {
      setHabitsDownloading(false);
    }
  };

  const handleDownloadJournals = async () => {
    const source = Array.isArray(allEntries) ? allEntries : [];

    const journalsToExport = source.map(
      ({ collectionId, collectionName, id, userId, ...rest }) => ({
        Date: rest.date ?? "",
        Mood: rest.mood ?? "",
        "What I Did": rest.whatIDid ?? "",
        "What I Learned": rest.whatILearned ?? "",
        "Additional Notes": rest.additionalNotes ?? "",
        Bookmarked: rest.bookmarked ?? false,
        "Created On": rest.created_on ?? "",
        "Updated On": rest.updated_on ?? "",
      }),
    );

    const fields = [
      "Date",
      "Mood",
      "What I Did",
      "What I Learned",
      "Additional Notes",
      "Bookmarked",
      "Created On",
      "Updated On",
    ];

    downloadCSV(journalsToExport, fields, `journals-${today}.csv`);
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <DownloadIcon className="w-6 h-6 mr-3" />
        <h2 className="text-xl font-semibold">Download</h2>
        <div className="ml-2 text-sm text-base-content/60 tooltip tooltip-right" data-tip="Download your habit logs and journal entries as CSV files.">
            <Info className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div>
            <h3 className="font-medium">All Habit Data</h3>
          </div>
          <button
            className="btn btn-soft btn-primary"
            onClick={handleDownloadHabits}
            disabled={
              habitsLoading ||
              habitsDownloading ||
              !userHabits ||
              userHabits.length === 0
            }
          >
            {habitsDownloading || habitsLoading ? "Loading…" : "Download"}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div>
            <h3 className="font-medium">All Journal Entries</h3>
          </div>
          <button
            className="btn btn-soft btn-primary"
            onClick={handleDownloadJournals}
            disabled={journalsLoading || !allEntries || allEntries.length === 0}
          >
            {journalsLoading ? "Loading…" : "Download"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Download;
