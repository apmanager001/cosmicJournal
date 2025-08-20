"use client";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import CosmicTheme from "@/comp/utility/CosmicTheme";
import Link from "next/link";
import { Rocket, Star, Moon, Zap } from "lucide-react";

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <CosmicTheme>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      </CosmicTheme>
    );
  }

  return (
    <CosmicTheme>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Rocket className="w-20 h-20 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cosmic Journal
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Track your habits and journal your journey through the cosmos. Build
            consistency, explore your thoughts, and reach for the stars.
          </p>

          {user ? (
            <div className="space-y-4">
              <p className="text-purple-200 text-lg">
                Welcome back, {user.name || user.email || "Cosmic Explorer"}! 🚀
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
                >
                  <Rocket className="w-5 h-5 inline mr-2" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
              >
                <Star className="w-5 h-5 inline mr-2" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-transparent border-2 border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-colors text-lg font-semibold"
              >
                <Moon className="w-5 h-5 inline mr-2" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-200/20 text-center">
            <div className="w-16 h-16 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Habit Tracking
            </h3>
            <p className="text-purple-200">
              Build consistent habits with streak tracking and daily reminders.
              Watch your progress soar to new heights.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-200/20 text-center">
            <div className="w-16 h-16 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Daily Journaling
            </h3>
            <p className="text-purple-200">
              Reflect on your day, capture insights, and track your personal
              growth through thoughtful journal entries.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-200/20 text-center">
            <div className="w-16 h-16 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Smart Analytics
            </h3>
            <p className="text-purple-200">
              Get insights into your habits and journal patterns with beautiful
              visualizations and progress tracking.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-200/20">
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
    </CosmicTheme>
  );
}
