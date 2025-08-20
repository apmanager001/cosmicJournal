"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useAuth } from "@/comp/utility/tanstack/authContext";

import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import {
  useUserHabits,
  useTodayJournalEntry,
} from "@/comp/utility/tanstack/habitHooks";
import HabitCard from "@/comp/habits/HabitCard";
import JournalEntryForm from "@/comp/journal/JournalEntryForm";
import CosmicTheme from "@/comp/utility/CosmicTheme";
import SubscriptionStatusIndicator from "@/comp/utility/SubscriptionStatusIndicator";
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
  const { data: userHabits, isLoading: habitsLoading } = useUserHabits();
  const { data: todayJournalEntry } = useTodayJournalEntry();

  return (
    <CosmicTheme variant="light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-purple-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || user?.email || "User"}!
              </p>
            </div>
            <div className="flex gap-4">
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
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
                <p className="text-sm font-medium text-gray-600">
                  Journal Entries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayJournalEntry ? "1" : "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
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
                <p className="text-sm font-medium text-gray-600">
                  Active Habits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userHabits?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
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
                <p className="text-sm font-medium text-gray-600">
                  Total Streaks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userHabits?.reduce(
                    (total, habit) =>
                      total + (habit.streakType === "daily" ? 1 : 0),
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Subscription Status */}
          <SubscriptionStatusIndicator />
        </div>

        
        <div className="flex gap-4">
        {/* Quick Actions */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-purple-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-rows-4 gap-4">
            <Link
              href="/journal"
              className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-colors text-left"
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
                  <p className="font-medium text-gray-900">Journal</p>
                  <p className="text-sm text-gray-600">
                    View all entries and write new ones
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/habits"
              className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50/50 transition-colors text-left"
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
                  <p className="font-medium text-gray-900">Habits</p>
                  <p className="text-sm text-gray-600">
                    Track, manage, and analyze habits
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/bookmarks"
              className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-colors text-left"
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
                  <p className="font-medium text-gray-900">
                    Bookmarked Entries
                  </p>
                  <p className="text-sm text-gray-600">
                    View your favorite journal entries
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/settings"
              className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50/50 transition-colors text-left"
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
                  <p className="font-medium text-gray-900">Settings</p>
                  <p className="text-sm text-gray-600">
                    Manage notifications and subscription
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Today's Journal */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-8 border border-purple-200/50">
          <JournalEntryForm />
        </div>
        </div>

        {/* Active Habits */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-purple-200/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Habits
            </h2>
            <Link
              href="/habits"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Manage Habits →
            </Link>
          </div>

          {habitsLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : userHabits && userHabits.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {userHabits.slice(0, 2).map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <p className="text-gray-500 mb-2">No habits set up yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Start tracking your daily habits to build consistency
              </p>
              <Link
                href="/habits"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Habit
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">
              Complete habits and journal entries to see your progress
            </p>
          </div>
        </div>
      </div>
    </CosmicTheme>
  );
}
