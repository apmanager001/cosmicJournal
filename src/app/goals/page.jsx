import React from "react";
import GoalsList from "./GoalsList";
import SearchGoals from "./SearchGoals";
import { Trophy } from "lucide-react";
import Link from "next/link.js";
import PageHeaderCard from "@/comp/headers/PageHeaderCard";

const Page = () => {
  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <PageHeaderCard
        icon={<Trophy strokeWidth={2.5} />}
        title="Goals"
        description="Set and track your goals to stay motivated and achieve your dreams. Create new goals, monitor your progress, and celebrate your achievements all in one place!"
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </>
        }
      />
      <div className="customContainer p-4 w-full min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4">Your Goals</h2>
          <SearchGoals />
        </div>
        <GoalsList />
      </div>
    </div>
  );
};

export default Page;
