// Public habit types that users can choose from
export interface PublicHabit {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  created: string;
  updated: string;
}

// User's personal habit with their specific description
export interface UserHabit {
  id: string;
  userId: string;
  habitId: string; // References PublicHabit
  habit: PublicHabit; // Expanded habit data
  personalDescription: string; // User's specific goal (e.g., "Read 20 pages a day")
  streakType: "daily" | "weekly";
  weeklyGoal?: number; // For weekly habits (e.g., 5 out of 7 days)
  isActive: boolean;
  created: string;
  updated: string;
}

// Daily habit completion log
export interface HabitLog {
  id: string;
  userId: string;
  habitId: string; // References UserHabit
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
  created: string;
  updated: string;
}

// Daily journal entry
export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  whatIDid: string;
  whatILearned: string;
  additionalNotes: string;
  mood?: string; // User's mood for the day (emoji or text)
  bookmarked: boolean; // Whether entry is bookmarked by user
  created: string;
  updated: string;
}

// Habit streak data
export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompletedDate?: string;
  streakType: "daily" | "weekly";
  weeklyGoal?: number;
}

// Notification preferences
export interface NotificationSettings {
  id: string;
  userId: string;
  inAppNotifications: boolean;
  emailNotifications: boolean;
  dailyReminder: boolean;
  weeklyReport: boolean;
  reminderTime: string; // HH:MM format
  created: string;
  updated: string;
}
