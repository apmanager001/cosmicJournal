// Subscription configuration and limits
export const SUBSCRIPTION_CONFIG = {
  // Free tier limits
  FREE_TIER: {
    HABIT_LIMIT: parseInt(process.env.NEXT_PUBLIC_FREE_TIER_HABIT_LIMIT || '3'),
    JOURNAL_ENTRY_LIMIT: parseInt(process.env.NEXT_PUBLIC_FREE_TIER_JOURNAL_ENTRY_LIMIT || '10'),
    BOOKMARK_LIMIT: parseInt(process.env.NEXT_PUBLIC_FREE_TIER_BOOKMARK_LIMIT || '5'),
  },
  
  // Pro tier features (unlimited)
  PRO_TIER: {
    HABIT_LIMIT: -1, // -1 means unlimited
    JOURNAL_ENTRY_LIMIT: -1,
    BOOKMARK_LIMIT: -1,
  }
};

// Feature flags based on subscription status
export const FEATURES = {
  FREE: {
    canCreateHabits: true,
    canCreateJournalEntries: true,
    canBookmarkEntries: true,
    canUseAdvancedAnalytics: false,
    canExportData: false,
    canUseCustomThemes: false,
    canCollaborate: false,
  },
  PRO: {
    canCreateHabits: true,
    canCreateJournalEntries: true,
    canBookmarkEntries: true,
    canUseAdvancedAnalytics: true,
    canExportData: true,
    canUseCustomThemes: true,
    canCollaborate: true,
  }
};

// Helper function to check if user can perform an action
export function canPerformAction(
  action: keyof typeof FEATURES.FREE,
  subscriptionStatus: 'free' | 'pro' | 'trial'
): boolean {
  if (subscriptionStatus === 'pro' || subscriptionStatus === 'trial') {
    return FEATURES.PRO[action];
  }
  return FEATURES.FREE[action];
}

// Helper function to get current limit for a resource
export function getCurrentLimit(
  resource: 'habits' | 'journalEntries' | 'bookmarks',
  subscriptionStatus: 'free' | 'pro' | 'trial'
): number {
  if (subscriptionStatus === 'pro' || subscriptionStatus === 'trial') {
    return SUBSCRIPTION_CONFIG.PRO_TIER[`${resource.toUpperCase()}_LIMIT` as keyof typeof SUBSCRIPTION_CONFIG.PRO_TIER];
  }
  
  return SUBSCRIPTION_CONFIG.FREE_TIER[`${resource.toUpperCase()}_LIMIT` as keyof typeof SUBSCRIPTION_CONFIG.FREE_TIER];
}

// Helper function to check if user has reached limit
export function hasReachedLimit(
  resource: 'habits' | 'journalEntries' | 'bookmarks',
  currentCount: number,
  subscriptionStatus: 'free' | 'pro' | 'trial'
): boolean {
  const limit = getCurrentLimit(resource, subscriptionStatus);
  if (limit === -1) return false; // Unlimited
  return currentCount >= limit;
}


