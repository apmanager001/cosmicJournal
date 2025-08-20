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
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          description: "Unlimited access to all features",
        };
      case "trial":
        return {
          label: "Pro Trial",
          icon: Zap,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          description: "Trial access to Pro features",
        };
      default:
        return {
          label: "Free Plan",
          icon: User,
          color: "text-gray-600",
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
      className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-3 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className={`w-4 h-4 ${statusInfo.color}`} />
        <span className={`text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-2">{statusInfo.description}</p>

      {showUsage && subscriptionStatus === "free" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Habits:</span>
            <span className="text-gray-800 font-medium">
              {getCurrentLimit("habits")} limit
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Journal entries:</span>
            <span className="text-gray-800 font-medium">
              {getCurrentLimit("journalEntries")} limit
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Bookmarks:</span>
            <span className="text-gray-800 font-medium">
              {getCurrentLimit("bookmarks")} limit
            </span>
          </div>
        </div>
      )}

      {subscriptionStatus === "free" && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <Link
            href="/settings#subscribe"
            className="w-full text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer"
          >
            View Plans →
          </Link>
        </div>
      )}
    </div>
  );
}
