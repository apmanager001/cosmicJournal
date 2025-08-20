"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  habitService,
  journalService,
  notificationService,
} from "./habitService";
import { useAuth } from "./authContext";
import toast from "react-hot-toast";
import type {
  UserHabit,
  JournalEntry,
  NotificationSettings,
} from "./habitTypes";

// Error interface for better type safety
interface ApiError {
  message?: string;
  data?: { message?: string };
  name?: string;
  isAbort?: boolean;
}

// Public habits hooks
export const usePublicHabits = () => {
  return useQuery({
    queryKey: ["publicHabits"],
    queryFn: async () => {
      try {
        const result = await habitService.getPublicHabits();
        return result;
      } catch (error) {
        console.error("usePublicHabits: Error fetching public habits:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// User habits hooks
export const useUserHabits = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userHabits", user?.id],
    queryFn: () => habitService.getUserHabits(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUserHabit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (
      habitData: Omit<UserHabit, "id" | "created" | "updated" | "habit">
    ) => habitService.createUserHabit(habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userHabits", user?.id] });
      toast.success("Habit created successfully!");
    },
    onError: (error: unknown) => {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        "Failed to create habit";
      toast.error(message);
    },
  });
};

export const useUpdateUserHabit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<UserHabit>;
    }) => habitService.updateUserHabit(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userHabits", user?.id] });
      toast.success("Habit updated successfully!");
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to update habit";
      toast.error(message);
    },
  });
};

export const useDeleteUserHabit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => habitService.deleteUserHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userHabits", user?.id] });
      toast.success("Habit deleted successfully!");
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to delete habit";
      toast.error(message);
    },
  });
};

// Habit completion hooks
export const useLogHabitCompletion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      habitId,
      completed,
      notes,
    }: {
      habitId: string;
      completed: boolean;
      notes?: string;
    }) => habitService.logHabitCompletion(habitId, completed, notes),
    onSuccess: (data, variables) => {
      // Invalidate user habits and specific habit logs
      queryClient.invalidateQueries({ queryKey: ["userHabits", user?.id] });

      // Invalidate all habit logs for this habit (with and without date filters)
      queryClient.invalidateQueries({
        queryKey: ["habitLogs", variables.habitId],
      });

      // Also invalidate streak data since completion affects streaks
      queryClient.invalidateQueries({
        queryKey: ["habitStreak", variables.habitId],
      });

      // Force refetch of today's logs specifically
      queryClient.refetchQueries({
        queryKey: ["habitLogs", variables.habitId],
        exact: false,
      });

      // Force refetch of streak data
      queryClient.refetchQueries({
        queryKey: ["habitStreak", variables.habitId],
        exact: false,
      });

      const message = variables.completed
        ? "Habit completed for today!"
        : "Habit marked as incomplete";
      toast.success(message);
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to log habit completion";
      toast.error(message);
    },
  });
};

export const useHabitLogs = (habitId: string) => {
  return useQuery({
    queryKey: ["habitLogs", habitId],
    queryFn: async () => {
      try {
        const result = await habitService.getHabitLogs(habitId);
        return result;
      } catch (error: unknown) {
        // Handle auto-cancelled requests gracefully
        if (
          (error as ApiError)?.message?.includes("Request was cancelled") ||
          (error as ApiError)?.message?.includes("autocancelled") ||
          (error as ApiError)?.name === "AbortError" ||
          (error as ApiError)?.isAbort === true
        ) {
          // Don't return empty array for auto-cancelled requests
          // Let React Query handle the cancellation properly
          throw error;
        }
        console.error("useHabitLogs: Error fetching data:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Changed to true to ensure data loads on mount
    refetchOnReconnect: true, // Refetch when reconnecting
    retry: (failureCount, error: unknown) => {
      // Don't retry auto-cancelled requests
      if (
        (error as ApiError)?.message?.includes("Request was cancelled") ||
        (error as ApiError)?.message?.includes("autocancelled") ||
        (error as ApiError)?.name === "AbortError" ||
        (error as ApiError)?.isAbort === true
      ) {
        return false;
      }
      return failureCount < 3;
    },
    // Prevent auto-cancellation
    throwOnError: false,
    // Keep data in cache longer
    placeholderData: (previousData) => previousData,
    // Add timeout to prevent hanging requests
    networkMode: "online",
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useHabitStreak = (habitId: string) => {
  return useQuery({
    queryKey: ["habitStreak", habitId],
    queryFn: async () => {
      try {
        const result = await habitService.calculateHabitStreak(habitId);
        return result;
      } catch (error: unknown) {
        // Handle auto-cancelled requests gracefully
        if (
          (error as ApiError)?.message?.includes("Request was cancelled") ||
          (error as ApiError)?.message?.includes("autocancelled") ||
          (error as ApiError)?.name === "AbortError" ||
          (error as ApiError)?.isAbort === true
        ) {
          throw error; // Re-throw to let React Query handle it
        }
        console.error("useHabitStreak: Error calculating streak:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Changed to true to ensure data loads on mount
    refetchOnReconnect: true, // Refetch when reconnecting
    retry: (failureCount, error: unknown) => {
      // Don't retry auto-cancelled requests
      if (
        (error as ApiError)?.message?.includes("Request was cancelled") ||
        (error as ApiError)?.message?.includes("autocancelled") ||
        (error as ApiError)?.name === "AbortError" ||
        (error as ApiError)?.isAbort === true
      ) {
        return false;
      }
      return failureCount < 3;
    },
    // Prevent auto-cancellation
    throwOnError: false,
    // Keep data in cache longer
    placeholderData: (previousData) => previousData,
  });
};

// Journal entry hooks
export const useJournalEntry = (date: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["journalEntry", date, user?.id],
    queryFn: () => journalService.getJournalEntry(date),
    enabled: !!user?.id && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAllJournalEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["allJournalEntries", user?.id],
    queryFn: () => journalService.getAllJournalEntries(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookmarkedJournalEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarkedJournalEntries", user?.id],
    queryFn: () => journalService.getBookmarkedJournalEntries(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSaveJournalEntry = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (entry: Omit<JournalEntry, "id" | "created" | "updated">) =>
      journalService.saveJournalEntry(entry),
    onSuccess: (data) => {
      // Invalidate specific entry and all entries
      queryClient.invalidateQueries({
        queryKey: ["journalEntry", data.date, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["allJournalEntries", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarkedJournalEntries", user?.id],
      });
      toast.success("Journal entry saved successfully!");
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to save journal entry";
      toast.error(message);
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      entryId,
      bookmarked,
    }: {
      entryId: string;
      bookmarked: boolean;
    }) => journalService.toggleBookmark(entryId, bookmarked),
    onSuccess: (data) => {
      // Invalidate all journal-related queries
      queryClient.invalidateQueries({
        queryKey: ["journalEntry", data.date, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["allJournalEntries", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarkedJournalEntries", user?.id],
      });

      const message = data.bookmarked
        ? "Entry bookmarked!"
        : "Bookmark removed!";
      toast.success(message);
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to update bookmark";
      toast.error(message);
    },
  });
};

// Notification settings hooks
export const useNotificationSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notificationSettings", user?.id],
    queryFn: () => notificationService.getNotificationSettings(),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) =>
      notificationService.updateNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificationSettings", user?.id],
      });
      toast.success("Notification settings updated!");
    },
    onError: (error: unknown) => {
      const message =
        (error as ApiError)?.data?.message ||
        (error as ApiError)?.message ||
        "Failed to update notification settings";
      toast.error(message);
    },
  });
};

// Utility hooks
export const useTodayJournalEntry = () => {
  const today = new Date().toISOString().split("T")[0];
  return useJournalEntry(today);
};
