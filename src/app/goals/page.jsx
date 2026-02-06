import React from "react";
import GoalsList from "./GoalsList";
import SearchGoals from "./SearchGoals";
import { Trophy } from "lucide-react";
import Link from "next/link.js";

const Page = () => {
  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <div className="flex-1 customContainer flex justify-center items-center p-6 mb-2 md:mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <div
              className={`border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105`}
            >
              <Trophy strokeWidth={2.5} />
            </div>
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold leading-tight">Goals</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Set and track your goals to stay motivated and achieve your dreams. Create new goals, monitor your progress, and celebrate your
                achievements all in one place!
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="customContainer p-4 w-full min-h-[500px]">
      <SearchGoals />
      <GoalsList />
      </div>
    </div>
  );
};

export default Page;
