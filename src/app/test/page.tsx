"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import RecentActivity from "./comp/recentActivity";
import {
  useUserHabits,
  useTodayJournalEntry,
} from "@/comp/utility/tanstack/habitHooks";
import JournalEntryForm from "@/comp/journal/JournalEntryForm";
import SubscriptionStatusIndicator from "@/comp/utility/SubscriptionStatusIndicator";
import WeeklyCalendar from "./comp/WeeklyCalendar";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const { data: userHabits } = useUserHabits();
  const { data: todayJournalEntry } = useTodayJournalEntry();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`customContainer p-6 mb-8`}>
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Dashboard
              </h1>
              <p className="text-primary">
                Welcome back, {user?.name || user?.email || "User"}!
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Link
                href="/"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Home
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <WeeklyCalendar className="mb-8" />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className={`customContainer p-6`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  Journal Entries
                </p>
                <p className="text-2xl font-bold text-base-content">
                  {todayJournalEntry ? "1" : "0"}
                </p>
              </div>
            </div>
          </div>

          <div className={`customContainer p-6 `}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  Active Habits
                </p>
                <p className="text-2xl font-bold text-base-content">
                  {userHabits?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className={`customContainer p-6`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  Active Habits
                </p>
                <p className="text-2xl font-bold text-base-content">
                  {userHabits?.filter((habit) => habit.isActive).length || 0}
                </p>
              </div>
            </div>
          </div>
          <SubscriptionStatusIndicator />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Quick Actions */}
          <div className={`flex-1 customContainer p-6 mb-8 hidden md:block`}>
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Quick Actions
            </h2>
            <div className="grid md:grid-rows-4 gap-4">
              <Link
                href="/journal"
                className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/20 transition-colors text-left"
              >
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-purple-400 mr-3"
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
                  <div>
                    <p className="font-medium">Journal</p>
                    <p className="text-sm text-gray-400">
                      View all entries and write new ones
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/habits"
                className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50/20 transition-colors text-left"
              >
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-green-400 mr-3"
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
                  <div>
                    <p className="font-medium">Habits</p>
                    <p className="text-sm text-gray-400">
                      Track, manage, and analyze habits
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/bookmarks"
                className="p-4 border-2 border-dashed border-info rounded-lg hover:border-purple-400 hover:bg-purple-50/20 transition-colors text-left"
              >
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-purple-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Bookmarked Entries</p>
                    <p className="text-sm text-gray-400">
                      View your favorite journal entries
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/settings"
                className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50/20 transition-colors text-left"
              >
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-orange-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-gray-400">
                      Manage notifications and subscription
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Journal */}
          <div className={`flex-1 mb-8 customContainer`}>
            <JournalEntryForm />
          </div>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}
