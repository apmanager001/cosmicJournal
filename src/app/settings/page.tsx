"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useAuth } from "@/comp/utility/tanstack/authContext";

import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/comp/utility/tanstack/habitHooks";
import {
  stripeService,
  SUBSCRIPTION_PLANS,
} from "@/comp/utility/tanstack/stripeService";
import CosmicTheme from "@/comp/utility/CosmicTheme";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Shield,
  CreditCard,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user, logout } = useAuth();
  const { data: notificationSettings, isLoading: settingsLoading } =
    useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const [localSettings, setLocalSettings] = useState({
    inAppNotifications: true,
    emailNotifications: false,
    dailyReminder: true,
    weeklyReport: false,
  });

  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  // Initialize local settings when data loads
  useEffect(() => {
    if (notificationSettings) {
      setLocalSettings({
        inAppNotifications: notificationSettings.inAppNotifications ?? true,
        emailNotifications: notificationSettings.emailNotifications ?? false,
        dailyReminder: notificationSettings.dailyReminder ?? true,
        weeklyReport: notificationSettings.weeklyReport ?? false,
      });
    }
  }, [notificationSettings]);

  // Load subscription data
  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      // For demo purposes, we'll use a mock subscription
      // In production, you'd call stripeService.getCurrentSubscription()
      setSubscription({
        hasSubscription: false,
        subscription: null,
      });
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setLocalSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(localSettings, {
      onSuccess: () => {
        toast.success("Notification settings saved successfully!");
      },
      onError: (error) => {
        toast.error("Failed to save settings. Please try again.");
      },
    });
  };

  const handleStripeSubscribe = async (planId: string) => {
    setIsCreatingCheckout(true);
    try {
      // For demo purposes, we'll simulate the checkout process
      // In production, you'd call stripeService.createCheckoutSession(planId)
      toast.success("Redirecting to Stripe checkout...");

      // Simulate redirect delay
      setTimeout(() => {
        window.open("https://stripe.com", "_blank");
      }, 1000);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session. Please try again.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.subscription?.id) return;

    try {
      // In production, you'd call stripeService.cancelSubscription(subscription.subscription.id)
      toast.success(
        "Subscription will be cancelled at the end of the current period."
      );
      setSubscription({
        hasSubscription: false,
        subscription: null,
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    }
  };

  return (
    <CosmicTheme variant="light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-purple-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">
                Manage your preferences and subscription
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notification Preferences */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-6">
                {/* In-App Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        In-App Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get notified within the app
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.inAppNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "inAppNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.emailNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Daily Reminder */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Daily Reminder
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get reminded to complete habits daily
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.dailyReminder}
                      onChange={(e) =>
                        handleSettingChange("dailyReminder", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Weekly Report */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Weekly Report
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive weekly progress summaries
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.weeklyReport}
                      onChange={(e) =>
                        handleSettingChange("weeklyReport", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {updateSettingsMutation.isPending
                    ? "Saving..."
                    : "Save Notification Settings"}
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Name</h3>
                    <p className="text-sm text-gray-600">
                      {user?.name || "Not set"}
                    </p>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Sidebar */}
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Plan
                </h3>
              </div>

              {isLoadingSubscription ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : subscription?.hasSubscription ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Pro Plan
                  </h4>
                  <p className="text-gray-600 mb-4">Active subscription</p>
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Free Plan
                  </h4>
                  <p className="text-gray-600 mb-4">Basic features included</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• Up to 5 habits</li>
                    <li>• Basic journaling</li>
                    <li>• Standard notifications</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Available Plans */}
            {!subscription?.hasSubscription && (
              <div className="space-y-4" id='subscribe'>
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-200/50"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-purple-600">
                          ${plan.price}
                        </div>
                        <div className="text-gray-500">per {plan.interval}</div>
                      </div>

                      <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleStripeSubscribe(plan.id)}
                        disabled={isCreatingCheckout}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {isCreatingCheckout
                          ? "Creating..."
                          : `Subscribe to ${plan.name}`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CosmicTheme>
  );
}
