"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import {
  useUserHabits,
  usePublicHabits,
  useCreateUserHabit,
  useHabitLogs,
} from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { useState, useMemo } from "react";
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  Calendar,
  BarChart3,
  Flame,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import HabitCard from "@/comp/habits/HabitCard";
import HabitCalendar from "@/comp/habits/HabitCalendar";
import { PublicHabit, UserHabit } from "@/comp/utility/tanstack/habitTypes";
import { habitService } from "@/comp/utility/tanstack/habitService";
import SubscriptionLimitBanner from "@/comp/utility/SubscriptionLimitBanner";
import SubscriptionStatusIndicator from "@/comp/utility/SubscriptionStatusIndicator";
import PageHeaderCard from "@/comp/headers/PageHeaderCard";

export default function HabitsPage() {
  return (
    <ProtectedRoute>
      <HabitsContent />
    </ProtectedRoute>
  );
}

function HabitsContent() {
  const { hasReachedLimit, canPerformAction } = useSubscription();
  const { data: userHabits, isLoading: habitsLoading } = useUserHabits();
  const { isLoading: publicHabitsLoading } = usePublicHabits();

  const [viewMode, setViewMode] = useState<"cards" | "list" | "analytics">(
    "cards",
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Calculate overall stats
  const stats = useMemo(() => {
    if (!userHabits)
      return { total: 0, active: 0, daily: 0, weekly: 0, totalStreaks: 0 };

    const total = userHabits.length;
    const active = userHabits.filter((habit) => habit.isActive).length;
    const daily = userHabits.filter(
      (habit) => habit.streakType === "daily",
    ).length;
    const weekly = userHabits.filter(
      (habit) => habit.streakType === "weekly",
    ).length;

    // Calculate total streaks (simplified - you can enhance this with actual streak data)
    const totalStreaks = userHabits.reduce((sum, habit) => {
      // This would ideally come from actual streak calculations
      return sum + (habit.isActive ? 1 : 0);
    }, 0);

    return { total, active, daily, weekly, totalStreaks };
  }, [userHabits]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (habitsLoading || publicHabitsLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32  rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statContainers = [
    {
      title: "Total Habits",
      value: stats.total,
      icon: <Target className="w-5 h-5 text-blue-600" strokeWidth={2.5} />,
      iconColor: "bg-blue-100",
      borderColor: "border-blue-600",
    },
    {
      title: "Active",
      value: stats.active,
      icon: (
        <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2.5} />
      ),
      iconColor: "bg-green-100",
      borderColor: "border-green-600",
    },
    {
      title: "Daily",
      value: stats.daily,
      icon: (
        <TrendingUp className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
      ),
      iconColor: "bg-purple-100",
      borderColor: "border-purple-600",
    },
    {
      title: "Weekly",
      value: stats.weekly,
      icon: <Calendar className="w-5 h-5 text-yellow-600" strokeWidth={2.5} />,
      iconColor: "bg-yellow-100",
      borderColor: "border-yellow-600",
    },
    {
      title: "Total Streaks",
      value: stats.totalStreaks,
      icon: <Flame className="w-5 h-5 text-red-600" strokeWidth={2.5} />,
      iconColor: "bg-red-100",
      borderColor: "border-red-600",
    },
  ];

  const hasOddNumberOfStats = statContainers.length % 2 === 1;

  return (
    <div className="container mx-auto  md:px-4 md:py-8">
      <PageHeaderCard
        icon={<Target strokeWidth={2.5} />}
        title="Habits"
        description="Track your daily habits and build consistency"
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="flex gap-4 items-center justify-center flex-wrap">
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  // Scroll to the form section smoothly
                  setTimeout(() => {
                    document.getElementById("showCreateForm")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100); // Small delay to ensure the form is rendered
                }}
                disabled={
                  !canPerformAction("canCreateHabits") ||
                  hasReachedLimit("habits", userHabits?.length || 0)
                }
                className="btn btn-success btn-sm md:btn-md"
              >
                <Plus className="w-4 h-4" />
                New Habit
              </button>
            </div>
          </>
        }
      />
      {/* Stats Overview */}
      <div className="grid md:grid-cols-6 md:gap-4 md:mb-4">
        {/* Left: stats + subscription info */}
        <div className="md:grid grid-cols-5 gap-4 col-span-5">
          {/* Stat cards row */}
          <div className="max-w-screen col-span-2 md:col-span-5 grid grid-cols-2 md:grid-cols-5 md:gap-2 w-full">
            {statContainers.map((stat, index) => {
              const isLastSingleCard =
                hasOddNumberOfStats && index === statContainers.length - 1;

              return (
                <div
                  key={stat.title}
                  className={`customContainer col-span-1 p-4 flex gap-4 items-center justify-left md:justify-center ${
                    isLastSingleCard ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <div
                    className={`border-4 p-3 rounded-2xl text-2xl ${stat.iconColor} ${stat.borderColor} shadow-sm hover:shadow-md transition-transform hover:scale-105`}
                  >
                    {stat.icon}
                  </div>

                  <div className="text-left md:text-center">
                    <h1 className="text-lg font-bold leading-tight">
                      {stat.title}
                    </h1>
                    <p className="text-base-content/60 mt-1">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscription banner + status row */}
          <div className="col-span-5 grid md:grid-cols-5 md:gap-4 items-stretch">
            <div className="customContainer col-span-2 flex justify-center items-center">
              <div role="tablist" className="tabs tabs-box">
                <a
                  role="tab"
                  onClick={() => setViewMode("cards")}
                  className={`tab ${viewMode === "cards" ? "tab-active text-success hover:text-green-200" : ""}`}
                >
                  Cards
                </a>
                <a
                  role="tab"
                  onClick={() => setViewMode("list")}
                  className={`tab ${viewMode === "list" ? "tab-active text-success hover:text-green-200" : ""}`}
                >
                  List
                </a>
                <a
                  role="tab"
                  onClick={() => setViewMode("analytics")}
                  className={`tab ${viewMode === "analytics" ? "tab-active text-success hover:text-green-200" : ""}`}
                >
                  Analytics
                </a>
              </div>
            </div>
            <div className="hidden md:block md:col-span-3">
              <SubscriptionLimitBanner
                resource="habits"
                currentCount={userHabits?.length || 0}
              />
            </div>
          </div>
        </div>
        <div className="hidden md:block">
        <SubscriptionStatusIndicator />
        </div>
      </div>
      {/* <HabitFillCalendar /> */}
      {/* <WeeklyCalendar /> */}
      {/* Create New Habit Form */}
      {showCreateForm && (
        <div
          className={`customContainer rounded-lg shadow-lg p-6`}
          id="showCreateForm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create New Habit</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className=" hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <CreateHabitForm onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Habits Display */}
      {viewMode === "cards" && (
        <div className="space-y-6 md:mt-4 mb-16 md:mb-0">
          {userHabits && userHabits.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 ">
              {userHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No habits set up yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your daily habits to build consistency
              </p>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  // Scroll to the form section smoothly
                  setTimeout(() => {
                    document.getElementById("showCreateForm")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100); // Small delay to ensure the form is rendered
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Habit
              </button>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="customContainer rounded-lg shadow-lg overflow-hidden mb-16 md:mb-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-400">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userHabits &&
                  userHabits.map((habit) => (
                    <tr key={habit.id} className="hover:bg-base-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {habit.habit.icon}
                          </span>
                          <div>
                            <div className="text-sm font-medium">
                              {habit.habit.name}
                            </div>
                            <div className="text-sm text-base-200">
                              {habit.habit.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm max-w-xs truncate">
                          {habit.personalDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            habit.streakType === "daily"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {habit.streakType === "daily" ? "Daily" : "Weekly"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            habit.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {habit.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(habit.created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === "analytics" && (
        <div className="space-y-6 mb-16 md:mb-0">
          {/* Habit Completion Charts */}
          <div className="customContainer rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Habit Completion Trends
            </h3>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Analytics Coming Soon</p>
              <p className="text-sm">
                This feature will show detailed habit completion analytics and
                trends
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Create Habit Form Component
function CreateHabitForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const { hasReachedLimit, canPerformAction, upgradeToPro } = useSubscription();
  const { data: userHabits } = useUserHabits();

  const [formData, setFormData] = useState({
    habitId: "",
    personalDescription: "",
    streakType: "daily" as "daily" | "weekly",
    weeklyGoal: 5,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PublicHabit[]>([]);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<PublicHabit | null>(null);
  const [newHabitData, setNewHabitData] = useState({
    name: "",
    category: "",
    description: "",
    icon: "🎯", // Default icon
  });

  const createHabitMutation = useCreateUserHabit();
  const { data: publicHabits } = usePublicHabits();

  // Search through public habits
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (searchValue.trim() === "") {
      setSearchResults([]);
      setShowCreateNew(false);
      return;
    }

    // Filter public habits that start with the search term
    const filtered =
      publicHabits?.filter((habit) => {
        const searchLower = searchValue.toLowerCase().trim();
        const nameStartsWith = habit.name.toLowerCase().startsWith(searchLower);
        const categoryStartsWith = habit.category
          .toLowerCase()
          .startsWith(searchLower);

        return nameStartsWith || categoryStartsWith;
      }) || [];

    setSearchResults(filtered);
    setShowCreateNew(false); // Hide create new form when showing results
  };

  // Handle selecting an existing habit
  const handleSelectHabit = (habit: PublicHabit) => {
    setFormData((prev) => ({ ...prev, habitId: habit.id }));
    setSelectedHabit(habit);
    setSearchTerm("");
    setSearchResults([]); // Clear dropdown
    setShowCreateNew(false);
  };

  // Handle showing create new habit form
  const handleShowCreateNew = () => {
    setShowCreateNew(true);
    setSearchResults([]); // Clear dropdown
    // Pre-fill the new habit data with the search term
    setNewHabitData((prev) => ({ ...prev, name: searchTerm.trim() }));
  };

  // Handle removing selected habit
  const handleRemoveSelectedHabit = () => {
    setSelectedHabit(null);
    setFormData((prev) => ({ ...prev, habitId: "" }));
    setSearchTerm("");
  };

  // Handle creating a new habit
  const handleCreateNewHabit = async () => {
    if (
      !newHabitData.name ||
      !newHabitData.category ||
      !newHabitData.description
    ) {
      alert("Please fill in all fields for the new habit");
      return;
    }

    try {
      console.log("Creating new public habit with data:", newHabitData);

      // First create the public habit using the service
      const newPublicHabit = await habitService.createPublicHabit({
        name: newHabitData.name,
        category: newHabitData.category,
        description: newHabitData.description,
        icon: newHabitData.icon,
      });

      console.log("Successfully created public habit:", newPublicHabit);

      // Update formData with the new habit ID
      setFormData((prev) => ({ ...prev, habitId: newPublicHabit.id }));

      if (!user) {
        alert("User not authenticated");
        return;
      }

      const userHabitData = {
        habitId: newPublicHabit.id,
        userId: user.id,
        personalDescription: formData.personalDescription,
        streakType: formData.streakType,
        weeklyGoal:
          formData.streakType === "weekly" ? formData.weeklyGoal : undefined,
        isActive: true,
      };

      console.log("Creating user habit with data:", userHabitData);

      // Then create the user habit
      await createHabitMutation.mutateAsync(userHabitData);

      onSuccess();
    } catch (error) {
      console.error("Error creating new habit:", error);
      alert("Failed to create new habit. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check subscription limits
    if (!canPerformAction("canCreateHabits")) {
      alert(
        "You don't have permission to create habits. Please upgrade to Pro.",
      );
      return;
    }

    if (hasReachedLimit("habits", userHabits?.length || 0)) {
      alert(
        "You've reached your habit limit on the free plan. Please upgrade to Pro for unlimited habits.",
      );
      upgradeToPro();
      return;
    }

    console.log("Form submission - Current state:", {
      formData,
      showCreateNew,
      selectedHabit,
      newHabitData,
    });

    if (!formData.habitId && !showCreateNew) {
      alert("Please select a habit or create a new one");
      return;
    }

    if (showCreateNew) {
      await handleCreateNewHabit();
    } else {
      // Ensure we have a habitId when using an existing habit
      if (!formData.habitId) {
        alert("Please select a habit type");
        return;
      }

      if (!user) {
        alert("User not authenticated");
        return;
      }

      try {
        const habitData = {
          habitId: formData.habitId,
          userId: user.id,
          personalDescription: formData.personalDescription,
          streakType: formData.streakType,
          weeklyGoal:
            formData.streakType === "weekly" ? formData.weeklyGoal : undefined,
          isActive: true,
        };

        console.log("Creating habit with data:", habitData);

        await createHabitMutation.mutateAsync(habitData);

        onSuccess();
      } catch (error) {
        console.error("Error creating habit:", error);
        alert("Failed to create habit. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {selectedHabit || showCreateNew
            ? "Your Habit Type"
            : "Search for Habit Type"}
        </label>

        {/* Selected Habit Badge */}
        {selectedHabit && (
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 rounded-full px-3 py-2">
              <span className="text-xl">{selectedHabit.icon}</span>
              <div className="text-sm">
                <span className="font-medium">{selectedHabit.name}</span>
                <span className="text-green-600 ml-1">
                  • {selectedHabit.category}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveSelectedHabit}
                className="ml-2 text-green-600 hover:text-green-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Create New Habit Badge */}
        {showCreateNew && !selectedHabit && (
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-3 py-2">
              <span className="text-xl">➕</span>
              <div className="text-sm">
                <span className="font-medium text-blue-800">
                  Creating New Habit Type
                </span>
                <span className="text-blue-600 ml-1">
                  • &quot;{searchTerm}&quot;
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateNew(false);
                  setSearchTerm("");
                  setNewHabitData({
                    name: "",
                    category: "",
                    description: "",
                    icon: "🎯",
                  });
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search Input - Only show when no habit is selected and not creating new */}
        {!selectedHabit && !showCreateNew && (
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search for habits (e.g., 'reading', 'exercise')..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => handleSelectHabit(habit)}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {habit.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {habit.category}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Create New Habit Type Option */}
                <button
                  type="button"
                  onClick={handleShowCreateNew}
                  className="w-full p-3 text-left hover:bg-green-50 border-t-2 border-green-200 bg-green-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <div>
                      <div className="font-medium text-green-700">
                        Create New Habit Type
                      </div>
                      <div className="text-sm text-green-600">
                        Add &quot;{searchTerm}&quot; to the public habits
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* No Results Message */}
            {searchTerm.trim() !== "" &&
              searchResults.length === 0 &&
              publicHabits &&
              publicHabits.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                  <div className="text-center text-gray-500">
                    <p className="text-sm">
                      No habits found starting with &quot;{searchTerm}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={handleShowCreateNew}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Create New Habit Type
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Create New Habit Form */}
      {showCreateNew && (
        <div className="customContainer p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Create New Habit Type
            </span>
          </div>

          <div className="customContainer p-3">
            <p className="text-sm text-blue-800">
              <strong>Creating new habit type: &quot;{searchTerm}&quot;</strong>
              <br />
              This will be available for all users. Make sure to use a clear,
              descriptive name.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabitData.name}
                onChange={(e) =>
                  setNewHabitData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Reading, Meditation"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={newHabitData.category}
                onChange={(e) =>
                  setNewHabitData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                placeholder="e.g., Health, Learning, Productivity"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newHabitData.description}
              onChange={(e) =>
                setNewHabitData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of this habit type..."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "🎯",
                "📚",
                "🏃‍♂️",
                "🧘‍♀️",
                "💧",
                "🥗",
                "💤",
                "🎨",
                "🎵",
                "✍️",
                "🔬",
                "🌱",
              ].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewHabitData((prev) => ({ ...prev, icon }))}
                  className={`w-10 h-10 text-2xl rounded-lg border-2 transition-colors ${
                    newHabitData.icon === icon
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Your Personal Goal
        </label>
        <textarea
          value={formData.personalDescription}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              personalDescription: e.target.value,
            }))
          }
          required
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., Read 20 pages a day, Walk 10,000 steps..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Streak Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="daily"
              checked={formData.streakType === "daily"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  streakType: e.target.value as "daily" | "weekly",
                }))
              }
              className="mr-2 cursor-pointer"
            />
            Daily
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="weekly"
              checked={formData.streakType === "weekly"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  streakType: e.target.value as "daily" | "weekly",
                }))
              }
              className="mr-2 cursor-pointer"
            />
            Weekly
          </label>
        </div>
      </div>

      {formData.streakType === "weekly" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Goal (out of 7 days)
          </label>
          <input
            type="number"
            min="1"
            max="7"
            value={formData.weeklyGoal}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                weeklyGoal: parseInt(e.target.value),
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={createHabitMutation.isPending}
          className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
        </button>
        <button type="button" onClick={onSuccess} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

// Component that fetches habit logs and renders the calendar
function HabitCalendarWithLogs({ habit }: { habit: UserHabit }) {
  const { data: habitLogs, isLoading } = useHabitLogs(habit.id);

  if (isLoading) {
    return (
      <div className="customContainer p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{habit.habit.icon}</span>
          <h4 className="font-medium text-gray-900">{habit.habit.name}</h4>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4  rounded w-3/4"></div>
          <div className="h-4 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="customContainer p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{habit.habit.icon}</span>
        <h4 className="font-medium text-gray-900">{habit.habit.name}</h4>
      </div>
      <HabitCalendar habitLogs={habitLogs || []} className="w-full" />
    </div>
  );
}
