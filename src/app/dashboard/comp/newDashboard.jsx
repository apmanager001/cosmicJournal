"use client";

import React from "react";
import Link from "next/link.js";
import { useUserHabits } from "@/comp/utility/tanstack/habitHooks";
import IndividualFillCalendar from "../../habits/comp/individualFillCalendar";
import DashBookmarks from "../comps/dashbookmarks";
import DashGoals from "../comps/dashGoals.jsx";
import DashBucketList from "../comps/dashBucketList";
import DashCreateJournal from "../comps/dashCreateJournal";
import DashJournalCalendar from "../comps/dashJournalCalendar";
import { LayoutDashboard } from "lucide-react";
import Signout from "../../login/comp/signout";

const NewDash = () => {
  const { data: userHabits = [], isLoading: habitsLoading } = useUserHabits();
  if (habitsLoading) {
    return <div>Loading habits...</div>;
  }
  return (
    <div className="container mx-auto md:px-4 md:py-8 ">
      <div className="flex-1 customContainer flex justify-center items-center p-6 mb-2 md:mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <div
              className={`border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105`}
            >
              <LayoutDashboard strokeWidth={2.5} />
            </div>

            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold leading-tight">Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Welcome to your dashboard! Here you can get a quick overview of
                your habits, journal entries, bookmarks, goals, and bucket list
                items. Stay organized and keep track of your progress all in
                one place!
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="btn btn-primary">
              <Link href="/settings">Settings</Link>
            </div>
            <div className="flex gap-4 items-center justify-center flex-wrap">
              <Signout />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 min-w-96">
        <div className="customContainer p-4 w-full lg:col-span-2">
          <div className="flex justify-between mb-2">
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <button className="btn btn-sm btn-primary">
              <Link href="/habits">View All</Link>
            </button>
          </div>
          <div className="inline-flex flex-wrap justify-center items-center gap-2">
            {userHabits.map((habit) => (
              <IndividualFillCalendar
                key={habit.id}
                habitId={habit.id}
                title={habit.habit.name}
              />
            ))}
          </div>
        </div>
        <div className="customContainer p-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold ">Journal Calendar</h2>
          </div>
          <div className="flex justify-center items-center">
            <DashJournalCalendar />
          </div>
        </div>
        <div className="customContainer p-4 lg:col-span-2">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">Today's Journal Entry</h2>
            <button className="btn btn-sm btn-primary">
              <Link href="/journal">View All</Link>
            </button>
          </div>
          <DashCreateJournal />
        </div>
        <div className="customContainer p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Bookmarks</h2>
            <button className="btn btn-sm btn-primary">
              <Link href="/bookmarks">View All</Link>
            </button>
          </div>
          <DashBookmarks />
        </div>
        <div className="customContainer p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Bucket List</h2>
            <button className="btn btn-sm btn-primary">
              <Link href="/bucketlist">View All</Link>
            </button>
          </div>
          <DashBucketList />
        </div>
        <div className="customContainer flex flex-col justify-center p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Goals</h2>
            <button className="btn btn-sm btn-primary">
              <Link href="/goals">View All</Link>
            </button>
          </div>
          <DashGoals />
        </div>
      </div>
    </div>
  );
};

export default NewDash;
