import React from "react";
import Link from "next/link";
import {
  Rocket,
  Moon,
  Heart,
  Github,
  Twitter,
  Mail,
  Home,
  BookOpen,
  Target,
  Bookmark,
  Settings,
  HelpCircle,
  Phone,
  Shield,
} from "lucide-react";

const CosmicFooter: React.FC = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Rocket className="w-8 h-8 mr-3 text-primary" />
              <h3 className="text-2xl font-bold text-base-content">
                Cosmic Journal
              </h3>
            </div>
            <p className="text-base-content/70 mb-6 max-w-md">
              Track your habits and journal your journey through the cosmos.
              Build consistency, explore your thoughts, and reach for the stars.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-base-content mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Home className="w-4 h-4 group-hover:text-primary" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <BookOpen className="w-4 h-4 group-hover:text-primary" />
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/habits"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Target className="w-4 h-4 group-hover:text-primary" />
                  Habits
                </Link>
              </li>
              <li>
                <Link
                  href="/bookmarks"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Bookmark className="w-4 h-4 group-hover:text-primary" />
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-base-content mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Settings className="w-4 h-4 group-hover:text-primary" />
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <HelpCircle className="w-4 h-4 group-hover:text-primary" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Phone className="w-4 h-4 group-hover:text-primary" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Shield className="w-4 h-4 group-hover:text-primary" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <BookOpen className="w-4 h-4 group-hover:text-primary" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-base-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-base-content/70">
              <Moon className="w-4 h-4 mr-2" />
              <span>© 2024 Cosmic Journal. All rights reserved.</span>
            </div>
            <div className="flex items-center text-base-content/70">
              <span className="mr-2">Made with</span>
              <Heart className="w-4 h-4 text-error animate-pulse" />
              <span className="ml-2">for cosmic explorers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CosmicFooter;
