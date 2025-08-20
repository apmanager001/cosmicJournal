"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { stripeService } from "./stripeService";
import {
  SUBSCRIPTION_CONFIG,
  canPerformAction,
  getCurrentLimit,
  hasReachedLimit,
} from "@/config/subscription";

export type SubscriptionStatus = "free" | "pro" | "trial" | "loading";

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  isLoading: boolean;
  currentSubscription: any | null;
  canPerformAction: (
    action: keyof typeof import("@/config/subscription").FEATURES.FREE
  ) => boolean;
  getCurrentLimit: (
    resource: "habits" | "journalEntries" | "bookmarks"
  ) => number;
  hasReachedLimit: (
    resource: "habits" | "journalEntries" | "bookmarks",
    currentCount: number
  ) => boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>("loading");
  const [currentSubscription, setCurrentSubscription] = useState<any | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    if (!isAuthenticated) {
      setSubscriptionStatus("free");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const subscription = await stripeService.getCurrentSubscription();

      if (subscription && subscription.status === "active") {
        setSubscriptionStatus("pro");
        setCurrentSubscription(subscription);
      } else if (subscription && subscription.status === "trialing") {
        setSubscriptionStatus("trial");
        setCurrentSubscription(subscription);
      } else if (subscription && subscription.status === "free") {
        setSubscriptionStatus("free");
        setCurrentSubscription(null);
      } else {
        // Default to free for mock responses
        setSubscriptionStatus("free");
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      // Default to free tier on error
      setSubscriptionStatus("free");
      setCurrentSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh subscription status
  const refreshSubscription = async () => {
    await checkSubscriptionStatus();
  };

  // Upgrade to pro
  const upgradeToPro = async () => {
    try {
      // Redirect to Stripe checkout for the monthly plan
      const session = await stripeService.createCheckoutSession(
        "price_monthly"
      );
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  };

  // Check subscription status when auth changes
  useEffect(() => {
    checkSubscriptionStatus();
  }, [isAuthenticated, user]);

  const value: SubscriptionContextType = {
    subscriptionStatus,
    isLoading,
    currentSubscription,
    canPerformAction: (action) => {
      if (subscriptionStatus === "loading") return false;
      return canPerformAction(action, subscriptionStatus);
    },
    getCurrentLimit: (resource) => {
      if (subscriptionStatus === "loading") return 0;
      return getCurrentLimit(resource, subscriptionStatus);
    },
    hasReachedLimit: (resource, currentCount) => {
      if (subscriptionStatus === "loading") return false;
      return hasReachedLimit(resource, currentCount, subscriptionStatus);
    },
    refreshSubscription,
    upgradeToPro,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
