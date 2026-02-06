"use client";
import React from "react";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { Crown, AlertCircle, Sparkles } from "lucide-react";

interface SubscriptionLimitBannerProps {
  resource: "habits" | "journalEntries" | "bookmarks";
  currentCount: number;
  className?: string;
}

export default function SubscriptionLimitBanner({
  resource,
  currentCount,
  className = "",
}: SubscriptionLimitBannerProps) {
  const { getCurrentLimit, hasReachedLimit, upgradeToPro, isLoading } =
    useSubscription();

  if (isLoading) {
    return null;
  }

  const limit = getCurrentLimit(resource);
  const isUnlimited = limit === -1;
  const hasReached = hasReachedLimit(resource, currentCount);

  // Don't show banner for pro users or if not near limit
  if (isUnlimited || (!hasReached && currentCount < limit * 0.8)) {
    return null;
  }

  const getResourceLabel = () => {
    switch (resource) {
      case "habits":
        return "habits";
      case "journalEntries":
        return "journal entries";
      case "bookmarks":
        return "bookmarks";
      default:
        return resource;
    }
  };

  const getResourceIcon = () => {
    switch (resource) {
      case "habits":
        return "🎯";
      case "journalEntries":
        return "📝";
      case "bookmarks":
        return "⭐";
      default:
        return "📊";
    }
  };

  if (hasReached) {
    // Show limit reached banner
    return (
      <div
        className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 mb-1">
              {getResourceIcon()}{" "}
              {getResourceLabel().charAt(0).toUpperCase() +
                getResourceLabel().slice(1)}{" "}
              Limit Reached
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              You&apos;ve reached your limit of {limit} {getResourceLabel()} on
              the free plan. Upgrade to Pro for unlimited {getResourceLabel()}{" "}
              and more features!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={upgradeToPro}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </button>
              <button className="px-4 py-2 text-amber-700 text-sm font-medium hover:text-amber-800 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show approaching limit warning
  return (
    <div
      className={`bg-base-200 rounded-lg p-4 customContainer`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium  mb-1">
            {getResourceIcon()} Approaching{" "}
            {getResourceLabel().charAt(0).toUpperCase() +
              getResourceLabel().slice(1)}{" "}
            Limit
          </h3>
          <p className="text-sm text-base-content/60 mb-3">
            You&apos;ve used {currentCount} of {limit} {getResourceLabel()} on
            the free plan. Consider upgrading to Pro for unlimited access!
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={upgradeToPro}
              className="btn btn-primary rounded-xl"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </button>
            <button className="btn btn-secondary rounded-xl">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
