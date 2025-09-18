import React from "react";
import GoalsList from "./GoalsList";
import SearchGoals from "./SearchGoals";

const Page = () => {
  return (
    <div className="px-4 md:px-40 lg:px-60 py-4 space-y-8">
      <SearchGoals />
      <GoalsList />
    </div>
  );
};

export default Page;
