'use client'
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../utility/tanstack/authContext";
import ThemeToggle from "../utility/ThemeToggle";
import HeaderLinks from "./headerLinks";
import {
  Rocket,
  CircleUser,
  LogOut,
  Star,
  Moon,
  Heart,
  House,
  LayoutDashboard,
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
  X,
  Menu,
  Trophy,
  PaintBucket,
} from "lucide-react";

const CosmicFooter: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-auto">
      <div className="hidden md:block container mx-auto px-4 py-12">
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
              <li>
                <Link
                  href="/bucketlist"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <PaintBucket className="w-4 h-4 group-hover:text-primary" />
                  BucketList
                </Link>
              </li>
              <li>
                <Link
                  href="/goals"
                  className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition-colors group"
                >
                  <Trophy className="w-4 h-4 group-hover:text-primary" />
                  Goals
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
      <div className="dock md:hidden z-10">
        <Link href="/">
          <House />
          <span className="dock-label">Home</span>
        </Link>

        <Link href="/dashboard">
          <LayoutDashboard />
          <span className="dock-label">Dashboard</span>
        </Link>

        <Link href="/settings">
          <Settings />
          <span className="dock-label">Settings</span>
        </Link>

        <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <Menu />
          <span className="dock-label">Menu</span>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <div className="fixed top-0 right-0 w-80 h-full bg-base-100 shadow-2xl p-6 ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-base-content">Menu</h3>
              <button
                onClick={toggleMobileMenu}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="mb-6">
              <ul className="menu menu-vertical gap-2">
                <HeaderLinks />
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className="space-y-4">
              <ThemeToggle />
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <CircleUser size={20} className="text-base-content" />
                    <span className="text-sm text-base-content">
                      {user.name || user.email || "User"}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                      // router.push("/");
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 p-3 bg-error/10 hover:bg-error/20 rounded-lg w-full text-left transition-colors"
                  >
                    <LogOut size={20} className="text-error" />
                    <span className="text-sm text-error">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={toggleMobileMenu}
                  className="btn btn-primary w-full"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default CosmicFooter;
