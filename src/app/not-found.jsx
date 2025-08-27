"use client";
import Link from "next/link";
import { Rocket, Star, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-300/30">
                <span className="text-6xl font-bold text-white">404</span>
              </div>
              {/* Orbiting stars */}
              <div className="absolute -top-4 -left-4 w-6 h-6 bg-yellow-300 rounded-full animate-pulse"></div>
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-blue-300 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute -bottom-2 -left-2 w-5 h-5 bg-purple-300 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Page Lost in{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Space
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Looks like this page has ventured into the unknown reaches of the
            cosmos. Don't worry, even the best astronauts get lost sometimes!
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold inline-flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-transparent border-2 border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-colors text-lg font-semibold inline-flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-200/20 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/journal"
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-purple-200">Journal</span>
              </Link>

              <Link
                href="/habits"
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <div className="w-8 h-8 bg-green-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Rocket className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm text-green-200">Habits</span>
              </Link>

              <Link
                href="/bookmarks"
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-purple-200">Bookmarks</span>
              </Link>

              <Link
                href="/settings"
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <div className="w-8 h-8 bg-orange-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm text-orange-200">Settings</span>
              </Link>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-12 text-center">
            <p className="text-purple-300 text-sm">
              🚀 Remember: In space, no one can hear you 404... but you can
              always navigate back to safety!
            </p>
          </div>
        </div>
      </div>
  );
}
