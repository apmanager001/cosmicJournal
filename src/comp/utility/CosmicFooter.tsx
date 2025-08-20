import React from "react";
import Link from "next/link";
import { Rocket, Star, Moon, Heart, Github, Twitter, Mail } from "lucide-react";

const CosmicFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-t border-purple-500/20 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        <div
          className="absolute top-8 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-12 left-2/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-6 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Rocket className="w-8 h-8 mr-3 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Cosmic Journal</h3>
            </div>
            <p className="text-purple-200 mb-4 max-w-md">
              Track your habits and journal your journey through the cosmos.
              Build consistency, explore your thoughts, and reach for the stars.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/habits"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Habits
                </Link>
              </li>
              <li>
                <Link
                  href="/bookmarks"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-500/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-purple-200 mb-4 md:mb-0">
              <Moon className="w-4 h-4 mr-2" />
              <span>© 2024 Cosmic Journal. All rights reserved.</span>
            </div>
            <div className="flex items-center text-purple-200">
              <span className="mr-2">Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="ml-2">for cosmic explorers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CosmicFooter;



