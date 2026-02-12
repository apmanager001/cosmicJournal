"use client";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import Link from "next/link";
import {
  Rocket,
  Star,
  Moon,
  Zap,
  PaintBucket,
  Trophy,
  LayoutDashboard,
} from "lucide-react";
import Signout from "./login/comp/signout";
// import Calendar from  "@/comp/habits/habitcalendar/calendar";

const FEATURES = [
  {
    title: "Habit Tracking",
    description:
      "Build consistent habits with streaks, reminders and a simple calendar view.",
    icon: Rocket,
  },
  {
    title: "Daily Journaling",
    description:
      "Capture daily reflections and insights with guided prompts and free-form entries.",
    icon: Star,
  },
  {
    title: "Bucket List",
    description:
      "Dream big and track your life's bucket list with progress indicators and inspiration.",
    icon: PaintBucket,
  },
  {
    title: "Goals",
    description:
      "Set and track your goals with milestones, deadlines and progress tracking.",
    icon: Trophy,
  },
  {
    title: "Dashboard",
    description:
      "Your command center for quick insights to keep you motivated and on track.",
    icon: LayoutDashboard,
  },
  {
    title: "Smart Analytics",
    description:
      "Visualize progress, trends and streaks to help you stay motivated.",
    icon: Zap,
  },
];

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Rocket className="w-20 h-20 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Cosmic Journal
          </span>
        </h1>
        <p className="text-xl text-base-content mb-8 max-w-3xl mx-auto">
          Track your habits and journal your journey through the cosmos. Build
          consistency, explore your thoughts, and reach for the stars.
        </p>

        {user ? (
          <div className="space-y-4">
            <p className="text-base-content/60 text-lg">
              Welcome back, {user.name || user.email || "Cosmic Explorer"}! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard" className="btn btn-primary ">
                <Rocket className="w-5 h-5 inline mr-2" />
                Go to Dashboard
              </Link>
              <Signout />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn btn-lg btn-primary ">
              <Star className="w-5 h-5 inline mr-2" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn btn-lg btn-secondary btn-outline"
            >
              <Moon className="w-5 h-5 inline mr-2" />
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="customContainer p-6 text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-base-content/60">{f.description}</p>
            </div>
          );
        })}
      </div>

      {/* Dashboard Showcase */}
      <div className="grid md:grid-cols-2 gap-8 items-center customContainer mb-16 p-10">
        <div className="flex justify-center">
          <img
            src="/dashboard.png"
            alt="Dashboard preview"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p className="text-base-content mb-4">
            The Dashboard brings your most important data together: today's
            habits, journal prompts, quick stats, and recent activity — all in
            one place so you can quickly see progress and jump into the next
            task.
          </p>
          <ul className="list-disc list-inside space-y-2 text-base-content/60">
            <li>
              Quick insight cards for streaks, completion rate, and upcoming
              tasks.
            </li>
            <li>Compact habit calendar and today's journal entry preview.</li>
            <li>
              One-click actions to add entries, mark habits complete, or
              navigate to deeper reports.
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Habit Section Showcase */}
      <div className="grid md:grid-cols-2 gap-8 items-center customContainer mb-16 p-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Habits — Build Consistency
          </h2>
          <p className="text-base-content mb-4">
            The Habits section helps you create repeatable routines and track
            completion with a compact calendar view, streaks, and quick logging
            actions. Mark days complete, review your progress, and keep your
            streaks alive.
          </p>
          <ul className="list-disc list-inside space-y-2 text-base-content/60">
            <li>Daily habit calendar with easy fill/unfill interactions.</li>
            <li>Streak and completion summaries to keep you motivated.</li>
            <li>
              Quick add and one-tap completion directly from the dashboard.
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/habit.png"
            alt="Habits preview"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="text-center customContainer p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Cosmic Journey?
          </h2>
          <p className="text-purple-200 mb-6 text-lg">
            Join thousands of cosmic explorers who are building better habits
            and documenting their journey through life.
          </p>
          <Link
            href="/register"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-lg font-semibold"
          >
            <Rocket className="w-5 h-5 inline mr-2" />
            Launch Your Journey
          </Link>
        </div>
      )}
    </div>
  );
}
