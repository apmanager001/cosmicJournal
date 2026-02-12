"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import DashCreateJournal from "../dashboard/comps/dashCreateJournal";
import JournalSidebar from "./comp/journalSidebar";
import { Notebook } from "lucide-react";
import Link from "next/link";
import PageHeaderCard from "@/comp/headers/PageHeaderCard";

export default function JournalPage() {
  return (
    <ProtectedRoute>
      <JournalContent />
    </ProtectedRoute>
  );
}

function JournalContent() {
  const {} = useAuth();
  const {} = useSubscription();

  return (
    <div className="container mx-auto px-0 py-0 md:px-4 md:py-8 flex flex-col md:gap-4">
      <PageHeaderCard
        icon={<Notebook strokeWidth={2.5} />}
        title="Journal"
        description="Reflect on your day and track your personal growth"
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </>
        }
      />
      <div className="flex flex-col lg:flex-row md:gap-6 mb-16">
        <JournalSidebar />
        {/* New Journal Entry Form - Separate section */}
        <div className="flex-1 customContainer p-6">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">Today's Journal Entry</h2>
          </div>
          <DashCreateJournal />
        </div>
      </div>
    </div>
  );
}
