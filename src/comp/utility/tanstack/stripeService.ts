import { pb } from "./pocketbase";

export interface StripeCheckoutSession {
  id: string;
  url: string;
  status: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

export const stripeService = {
  // Create a Stripe checkout session for subscription
  createCheckoutSession: async (
    priceId: string
  ): Promise<StripeCheckoutSession> => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/settings?success=true`,
          cancelUrl: `${window.location.origin}/settings?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  },

  // Get customer's current subscription
  getCurrentSubscription: async () => {
    try {
      const response = await fetch("/api/stripe/subscription");

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string) => {
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      return await response.json();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  },

  // Get available subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await fetch("/api/stripe/plans");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  },
};

// Available subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "price_monthly",
    name: "Pro Monthly",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited habits",
      "Advanced analytics",
      "Priority support",
      "Custom themes",
      "Export data",
      "Team collaboration",
    ],
  },
  {
    id: "price_yearly",
    name: "Pro Yearly",
    price: 99.99,
    interval: "year",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Early access to features",
      "Exclusive content",
    ],
  },
];
