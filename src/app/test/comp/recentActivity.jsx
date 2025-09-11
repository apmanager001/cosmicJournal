"use client";
import React, { useMemo } from "react";
import {
  useUserHabits,
  useTodayJournalEntry,
  useHabitLogs,
} from "@/comp/utility/tanstack/habitHooks";
import { UserHabit, HabitLog } from "@/comp/utility/tanstack/habitTypes";
import Link from "next/link";

const RecentActivity = () => {
  const { data: userHabits } = useUserHabits();
  const { data: todayJournalEntry } = useTodayJournalEntry();

  // Get recent activity using useMemo
  const recentActivities = useMemo(() => {
    if (!userHabits || userHabits.length === 0) return [];

    const allLogs = [];

    // For now, let's show the active habits as recent activity
    // since we can't easily fetch all habit logs here without hooks in loops
    userHabits.slice(0, 5).forEach((habit) => {
      allLogs.push({
        id: "habit-" + habit.id,
        date: new Date().toISOString(),
        type: "habit",
        habitName: habit.habit.name,
        habitIcon: habit.habit.icon,
        habitCategory: habit.habit.category,
        completed: false, // We'll need to get actual completion status
        notes: "",
      });
    });

    // Add journal entries if they exist
    if (todayJournalEntry) {
      allLogs.push({
        id: "journal-" + Date.now(),
        date: new Date().toISOString(),
        type: "journal",
        habitName: "Journal Entry",
        habitIcon: "📝",
        habitCategory: "Reflection",
        completed: true,
        notes: "",
      });
    }

    // Sort by date (most recent first) and take top 10
    return allLogs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [userHabits, todayJournalEntry]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActivityIcon = (activity) => {
    if (activity.type === "journal") {
      return "📝";
    }

    if (activity.completed) {
      return "✅";
    }

    return "⏸️";
  };

  const getActivityText = (activity) => {
    if (activity.type === "journal") {
      return "Completed journal entry";
    }

    if (activity.completed) {
      return `Completed ${activity.habitName}`;
    }

    return `Active habit: ${activity.habitName}`;
  };

  if (recentActivities.length === 0) {
    return (
      <div className= "customContainer p-6" >
        <h2 className="text-xl font-semibold text-base-content mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-base-content/40 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-base-content/70">No recent activity</p>
          <p className="text-sm text-base-content/50">
            Complete habits and journal entries to see your progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="customContainer p-6 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-base-content">
          Recent Activity
        </h2>
        <Link
          href="/habits"
          className="text-primary hover:text-primary-focus text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <div
            key={`${activity.type}-${activity.id || index}`}
            className="flex items-center gap-3 p-3 bg-base-100/50 rounded-lg hover:bg-base-100/70 transition-colors"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">{getActivityIcon(activity)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {getActivityText(activity)}
              </p>
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <span className="capitalize">{activity.habitCategory}</span>
                {activity.notes && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-32">{activity.notes}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 text-xs text-base-content/50">
              {formatDate(activity.date)}
            </div>
          </div>
        ))}
      </div>

      {recentActivities.length === 10 && (
        <div className="mt-4 text-center">
          <Link
            href="/habits"
            className="text-primary hover:text-primary-focus text-sm font-medium"
          >
            View more activity →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
