"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUser, Star, Rocket, Menu, X, LogOut } from "lucide-react";
import HeaderLinks from "./headerLinks";
import { useAuth } from "../utility/tanstack/authContext";
import ThemeToggle from "../utility/ThemeToggle";

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <header className="navbar bg-base-100 border-b border-base-300 shadow-sm">
        <div className="navbar-start">
          <div className="w-10 h-10 bg-base-300 rounded-lg animate-pulse"></div>
          <div className="w-32 h-6 bg-base-300 rounded animate-pulse ml-3"></div>
        </div>
        <div className="navbar-end">
          <div className="w-20 h-8 bg-base-300 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="hidden md:navbar bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
      {/* Desktop Header */}
      <div className="navbar-start">
        <div className="flex items-center gap-3">
          <Image
            src="/icon.png"
            height={40}
            width={40}
            alt="Logo Icon"
            className="w-auto h-auto"
            priority
          />
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold text-base-content hover:bg-base-200"
          >
            Cosmic Journal
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:block">
        <ul className="menu menu-horizontal gap-2">
          <HeaderLinks />
        </ul>
      </div>

      {/* Desktop Right Section */}
      <div className="navbar-end hidden lg:flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-base-content/70">
              Welcome, {user.name || user.email || "User"}
            </span>
            <Link
              href="/dashboard"
              className="btn btn-ghost btn-circle hover:bg-base-200"
              aria-label="Go to dashboard"
            >
              <CircleUser size={24} className="text-base-content" />
            </Link>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">
            <Star className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="navbar-end lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-base-content" />
          ) : (
            <Menu size={24} className="text-base-content" />
          )}
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
                      router.push("/");
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
    </header>
  );
};

export default Header;
