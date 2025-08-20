import { pb } from "./pocketbase";
import {
  PublicHabit,
  UserHabit,
  HabitLog,
  JournalEntry,
  HabitStreak,
  NotificationSettings,
} from "./habitTypes";

export const habitService = {
  // Get all public habits
  getPublicHabits: async (): Promise<PublicHabit[]> => {
    try {
      const records = await pb.collection("public_habits").getList(1, 50, {
        sort: "name",
      });
      return records.items as PublicHabit[];
    } catch (error) {
      throw error;
    }
  },

  // Create a new public habit
  createPublicHabit: async (
    habitData: Omit<PublicHabit, "id" | "created" | "updated">
  ): Promise<PublicHabit> => {
    try {
      const record = await pb.collection("public_habits").create(habitData);
      return record as PublicHabit;
    } catch (error) {
      throw error;
    }
  },

  // Get user's habits
  getUserHabits: async (userId: string): Promise<UserHabit[]> => {
    try {
      const records = await pb.collection("user_habits").getList(1, 50, {
        filter: `userId = "${userId}" && isActive = true`,
        expand: "habitId",
      });

      // Transform the data to match UserHabit interface
      // PocketBase expands habitId into habitId.expand, we need to map it to habit
      return records.items.map((record) => ({
        ...record,
        habit: record.expand?.habitId || record.habitId, // Map expanded data to habit field
      })) as UserHabit[];
    } catch (error) {
      throw error;
    }
  },

  // Create a new user habit
  createUserHabit: async (
    habitData: Omit<UserHabit, "id" | "created" | "updated" | "habit">
  ): Promise<UserHabit> => {
    try {
      // Ensure we have the userId from the authenticated user
      if (!pb.authStore.model?.id) {
        throw new Error("User not authenticated");
      }

      const dataToSend = {
        ...habitData,
        userId: pb.authStore.model.id,
      };

      console.log("Creating user habit with data:", dataToSend);
      console.log("User ID from auth store:", pb.authStore.model.id);

      const record = await pb.collection("user_habits").create(dataToSend);
      console.log("Successfully created user habit:", record);
      return record as UserHabit;
    } catch (error: any) {
      console.error("Error in createUserHabit:", error);
      console.error("Error details:", {
        message: error.message,
        data: error.data,
        status: error.status,
      });
      throw error;
    }
  },

  // Update user habit
  updateUserHabit: async (
    id: string,
    updates: Partial<UserHabit>
  ): Promise<UserHabit> => {
    try {
      const record = await pb.collection("user_habits").update(id, updates);
      return record as UserHabit;
    } catch (error) {
      throw error;
    }
  },

  // Delete user habit
  deleteUserHabit: async (id: string): Promise<void> => {
    try {
      await pb.collection("user_habits").delete(id);
    } catch (error) {
      throw error;
    }
  },

  // Get habit logs for a specific habit
  getHabitLogs: async (habitId: string): Promise<HabitLog[]> => {
    try {
      const filter = `habitId = "${habitId}"`;

      const records = await pb.collection("habit_logs").getList(1, 100, {
        filter,
        sort: "-date",
        requestKey: null,
      });
      return records.items as HabitLog[];
    } catch (error: any) {
      console.log("getHabitLogs: Error occurred:", error);
      // Handle auto-cancelled requests gracefully
      if (
        error?.message?.includes("autocancelled") ||
        error?.name === "AbortError"
      ) {
        // Re-throw the error so React Query can handle cancellation properly
        throw error;
      }

      console.error("Error in getHabitLogs:", error);
      throw error;
    }
  },

  // Log habit completion for today
  logHabitCompletion: async (
    habitId: string,
    completed: boolean,
    notes?: string
  ): Promise<HabitLog> => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Check if log already exists for today
      // Note: PocketBase stores dates as "2025-08-18 00:00:00", so we need to normalize for comparison
      const existingLogs = await pb.collection("habit_logs").getList(1, 1, {
        filter: `habitId = "${habitId}" && date >= "${today} 00:00:00" && date <= "${today} 23:59:59"`,
      });

      if (existingLogs.items.length > 0) {
        // Update existing log
        const record = await pb
          .collection("habit_logs")
          .update(existingLogs.items[0].id, {
            completed,
            notes,
          });
        return record as HabitLog;
      } else {
        // Create new log
        const record = await pb.collection("habit_logs").create({
          habitId,
          userId: pb.authStore.model?.id,
          date: today,
          completed,
          notes,
        });
        return record as HabitLog;
      }
    } catch (error: any) {
      // Handle auto-cancelled requests gracefully
      if (
        error?.message?.includes("autocancelled") ||
        error?.name === "AbortError"
      ) {
        console.log("Request was auto-cancelled (this is normal)");
        throw new Error("Request was cancelled");
      }

      console.error("Error in logHabitCompletion:", error);
      throw error;
    }
  },

  // Calculate habit streak
  calculateHabitStreak: async (habitId: string): Promise<HabitStreak> => {
    try {
      const logs = await habitService.getHabitLogs(habitId);
      const userHabit = await pb.collection("user_habits").getOne(habitId);

      let currentStreak = 0;
      let longestStreak = 0;
      let totalCompletions = 0;
      let lastCompletedDate: string | undefined;

      // Sort logs by date (newest first)
      const sortedLogs = logs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Calculate current streak
      const today = new Date().toISOString().split("T")[0];
      let streakCount = 0;

      for (const log of sortedLogs) {
        if (log.completed) {
          if (streakCount === 0) {
            // First completion, check if it's today or yesterday
            const logDate = new Date(log.date);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate.getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
              streakCount = 1;
              lastCompletedDate = log.date;
            }
          } else {
            // Check if this is consecutive
            const prevLog = sortedLogs[sortedLogs.indexOf(log) - 1];
            if (prevLog) {
              const currentDate = new Date(log.date);
              const prevDate = new Date(prevLog.date);
              const diffTime = Math.abs(
                currentDate.getTime() - prevDate.getTime()
              );
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                streakCount++;
                lastCompletedDate = log.date;
              } else {
                break;
              }
            }
          }
        }
      }

      currentStreak = streakCount;

      // Calculate total completions
      totalCompletions = logs.filter((log) => log.completed).length;

      // For now, set longest streak same as current (you can implement more complex logic)
      longestStreak = currentStreak;

      const result = {
        habitId,
        currentStreak,
        longestStreak,
        totalCompletions,
        lastCompletedDate,
        streakType: userHabit.streakType,
        weeklyGoal: userHabit.weeklyGoal,
      };

      return result;
    } catch (error: any) {
      // Handle auto-cancelled requests gracefully
      if (
        error?.message?.includes("autocancelled") ||
        error?.name === "AbortError"
      ) {
        throw new Error("Request was cancelled");
      }

      throw error;
    }
  },
};

export const journalService = {
  // Get journal entry for a specific date
  getJournalEntry: async (date: string): Promise<JournalEntry | null> => {
    try {
      const records = await pb.collection("journal_entries").getList(1, 1, {
        filter: `date = "${date}" && userId = "${pb.authStore.model?.id}"`,
      });

      return records.items.length > 0
        ? (records.items[0] as JournalEntry)
        : null;
    } catch (error) {
      throw error;
    }
  },

  // Get all journal entries for a user
  getAllJournalEntries: async (): Promise<JournalEntry[]> => {
    try {
      const records = await pb.collection("journal_entries").getList(1, 1000, {
        filter: `userId = "${pb.authStore.model?.id}"`,
        sort: "-date",
      });
      return records.items as JournalEntry[];
    } catch (error) {
      throw error;
    }
  },

  // Get bookmarked journal entries for a user
  getBookmarkedJournalEntries: async (): Promise<JournalEntry[]> => {
    try {
      const records = await pb.collection("journal_entries").getList(1, 1000, {
        filter: `userId = "${pb.authStore.model?.id}" && bookmarked = true`,
        sort: "-date",
      });
      return records.items as JournalEntry[];
    } catch (error) {
      throw error;
    }
  },

  // Create or update journal entry
  saveJournalEntry: async (
    entry: Omit<JournalEntry, "id" | "created" | "updated">
  ): Promise<JournalEntry> => {
    try {
      // Check if entry already exists for this date
      const existingEntry = await journalService.getJournalEntry(entry.date);

      if (existingEntry) {
        // Update existing entry
        const record = await pb
          .collection("journal_entries")
          .update(existingEntry.id, {
            whatIDid: entry.whatIDid,
            whatILearned: entry.whatILearned,
            additionalNotes: entry.additionalNotes,
            mood: entry.mood,
            bookmarked: entry.bookmarked,
          });
        return record as JournalEntry;
      } else {
        // Create new entry
        const record = await pb.collection("journal_entries").create({
          ...entry,
          userId: pb.authStore.model?.id,
          bookmarked: entry.bookmarked || false, // Default to false if not provided
        });
        return record as JournalEntry;
      }
    } catch (error) {
      throw error;
    }
  },

  // Toggle bookmark status of a journal entry
  toggleBookmark: async (
    entryId: string,
    bookmarked: boolean
  ): Promise<JournalEntry> => {
    try {
      const record = await pb.collection("journal_entries").update(entryId, {
        bookmarked,
      });
      return record as JournalEntry;
    } catch (error) {
      throw error;
    }
  },
};

export const notificationService = {
  // Get user's notification settings
  getNotificationSettings: async (): Promise<NotificationSettings | null> => {
    try {
      const records = await pb
        .collection("notification_settings")
        .getList(1, 1, {
          filter: `userId = "${pb.authStore.model?.id}"`,
        });

      return records.items.length > 0
        ? (records.items[0] as NotificationSettings)
        : null;
    } catch (error) {
      throw error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> => {
    try {
      const existingSettings =
        await notificationService.getNotificationSettings();

      if (existingSettings) {
        const record = await pb
          .collection("notification_settings")
          .update(existingSettings.id, settings);
        return record as NotificationSettings;
      } else {
        const record = await pb.collection("notification_settings").create({
          ...settings,
          userId: pb.authStore.model?.id,
        });
        return record as NotificationSettings;
      }
    } catch (error) {
      throw error;
    }
  },
};
