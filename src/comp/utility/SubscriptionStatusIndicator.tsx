"use client";
import React from "react";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { Crown, User, Zap } from "lucide-react";
import Link from "next/link";

interface SubscriptionStatusIndicatorProps {
  className?: string;
  showUsage?: boolean;
}

export default function SubscriptionStatusIndicator({
  className = "",
  showUsage = true,
}: SubscriptionStatusIndicatorProps) {
  const { subscriptionStatus, getCurrentLimit, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-3 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (subscriptionStatus) {
      case "pro":
        return {
          label: "Pro Plan",
          icon: Crown,
          color: "",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          description: "Unlimited access to all features",
        };
      case "trial":
        return {
          label: "Pro Trial",
          icon: Zap,
          color: "",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          description: "Trial access to Pro features",
        };
      default:
        return {
          label: "Free Plan",
          icon: User,
          color: "",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          description: "Limited access to features",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <div
      className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-3 customContainer ${className} h-full`}
    >
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{statusInfo.label}</span>
      </div>
      <div className="flex justify-between w-full">
        <p className="text-xs mb-2">{statusInfo.description}</p>
      </div>
      {showUsage && subscriptionStatus === "free" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="">Habits:</span>
            <span className=" font-medium">
              {getCurrentLimit("habits")} limit
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="">Journal entries:</span>
            <span className=" font-medium">
              {getCurrentLimit("journalEntries")} limit
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="">Bookmarks:</span>
            <span className=" font-medium">
              {getCurrentLimit("bookmarks")} limit
            </span>
          </div>
        </div>
      )}
      <div className="divider" />
      {subscriptionStatus === "free" && (
        <Link
          href="/settings#subscribe"
          className="text-xs font-medium text-accent hover:underline"
        >
          View Plans →
        </Link>
      )}
    </div>
  );
}
