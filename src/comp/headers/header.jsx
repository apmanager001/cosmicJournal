"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUser, Star, Rocket, Moon } from "lucide-react";
import HeaderLinks from "./headerLinks";
import { useAuth } from "../utility/tanstack/authContext";

const Header = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="hidden md:navbar bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20">
        <div className="navbar-start">
          <Image
            src="/icon.png"
            height={100}
            width={100}
            alt="Logo Icon"
            className="w-auto h-auto"
            priority
          />
          <Link
            href="/"
            className="btn btn-ghost text-xl text-white hover:bg-purple-600/20"
          >
            <Rocket className="w-6 h-6 mr-2 text-purple-400" />
            Cosmic Journal
          </Link>
        </div>
        <div className="navbar-center hidden md:block">
          <ul className="menu menu-horizontal px-1">
            <HeaderLinks />
          </ul>
        </div>
        <div className="navbar-end hidden lg:flex justify-end">
          <div className="flex justify-center items-center gap-4 mr-2">
            <div className="animate-pulse bg-purple-300/20 h-8 w-20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:navbar bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 relative overflow-hidden">
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

      <div className="navbar-start relative z-10">
        <Image
          src="/icon.png"
          height={50}
          width={50}
          alt="Logo Icon"
          className="w-auto h-auto"
          priority
        />
        <Link
          href="/"
          className="btn btn-ghost text-xl text-white hover:bg-purple-600/20 transition-all duration-300 rounded-full"
        >
          Cosmic Journal
        </Link>
      </div>
      {/* <div className="navbar-center hidden md:block">
        <ul className="menu menu-horizontal px-1">
          <HeaderLinks />
        </ul>
      </div> */}

      <div className="navbar-end hidden lg:flex justify-end relative z-10">
        {user ? (
          <div className="flex items-center gap-4 mr-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-200">
                Welcome, {user.name || user.email || "User"}
              </span>
              <Link
                href="/dashboard"
                data-name="profile"
                aria-label="This link will take you to your profile"
                className="hover:bg-purple-600/20 p-2 rounded-lg transition-all duration-300"
              >
                <CircleUser size={32} className="text-purple-300" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 mr-2">
            <Link
              href="/login"
              className="btn btn-ghost text-white hover:bg-purple-600/20 transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
