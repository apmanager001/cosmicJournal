# Subscription System Setup Guide

This guide explains how to set up and use the subscription-based limits system in your Cosmic Journal app.

## Overview

The subscription system provides:
- **Free Tier**: Limited access to features with configurable limits
- **Pro Tier**: Unlimited access to all features
- **Automatic Limit Checking**: Prevents users from exceeding their plan limits
- **Upgrade Prompts**: Encourages free users to upgrade when approaching limits

## Features by Tier

### Free Tier
- ✅ Create up to 3 habits (configurable)
- ✅ Create up to 10 journal entries (configurable)
- ✅ Create up to 5 bookmarks (configurable)
- ❌ Advanced analytics
- ❌ Data export
- ❌ Custom themes
- ❌ Team collaboration

### Pro Tier
- ✅ Unlimited habits
- ✅ Unlimited journal entries
- ✅ Unlimited bookmarks
- ✅ Advanced analytics
- ✅ Data export
- ✅ Custom themes
- ✅ Team collaboration

## Configuration

### 1. Environment Variables

Copy `env.example` to `.env.local` and configure your limits:

```bash
# Subscription Limits for Non-Subscribers
NEXT_PUBLIC_FREE_TIER_HABIT_LIMIT=3
NEXT_PUBLIC_FREE_TIER_JOURNAL_ENTRY_LIMIT=10
NEXT_PUBLIC_FREE_TIER_BOOKMARK_LIMIT=5

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### 2. Stripe Setup

1. Create a Stripe account and get your API keys
2. Set up your subscription products and prices
3. Update the `SUBSCRIPTION_PLANS` in `src/comp/utility/tanstack/stripeService.ts`
4. Configure your webhook endpoints

## How It Works

### 1. Subscription Context

The `SubscriptionProvider` wraps your app and provides:
- Current subscription status
- Limit checking functions
- Upgrade functionality

### 2. Limit Checking

Before creating resources, the system checks:
```typescript
// Check if user can perform action
if (!canPerformAction('canCreateHabits')) {
  // Show error or redirect to upgrade
}

// Check if user has reached limit
if (hasReachedLimit('habits', currentCount)) {
  // Show upgrade prompt
}
```

### 3. Automatic Banners

The system automatically shows:
- **Approaching Limit**: When user reaches 80% of their limit
- **Limit Reached**: When user hits their limit
- **Upgrade Prompts**: With direct links to Stripe checkout

## Components

### SubscriptionLimitBanner
Shows limit warnings and upgrade prompts based on current usage.

### SubscriptionStatusIndicator
Displays current plan status and usage limits.

## Usage Examples

### In Habits Page
```typescript
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";

function HabitsPage() {
  const { hasReachedLimit, canPerformAction } = useSubscription();
  
  // Disable create button if limit reached
  const canCreate = canPerformAction('canCreateHabits') && 
                   !hasReachedLimit('habits', habitsCount);
}
```

### In Journal Form
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Check limits before saving
  if (!existingEntry && hasReachedLimit('journalEntries', entriesCount)) {
    upgradeToPro();
    return;
  }
  // ... save entry
};
```

## Customization

### Adding New Limits

1. Update `SUBSCRIPTION_CONFIG` in `src/config/subscription.ts`
2. Add new feature flags to `FEATURES`
3. Update the subscription context
4. Add limit checking to your components

### Changing Default Limits

Modify the environment variables or update the fallback values in `SUBSCRIPTION_CONFIG`.

## Testing

### Free Tier Limits
1. Create the maximum number of habits/entries
2. Try to create one more
3. Verify the limit banner appears
4. Test the upgrade flow

### Pro Tier Features
1. Set up a test subscription
2. Verify unlimited access
3. Test all premium features

## Troubleshooting

### Common Issues

1. **Limits not working**: Check environment variables are loaded
2. **Upgrade not working**: Verify Stripe configuration
3. **Banners not showing**: Check subscription context is properly wrapped

### Debug Mode

Add console logs to see subscription status:
```typescript
const { subscriptionStatus, getCurrentLimit } = useSubscription();
console.log('Status:', subscriptionStatus);
console.log('Habit limit:', getCurrentLimit('habits'));
```

## Security Notes

- Limits are enforced on the frontend for UX
- Consider adding backend validation for production
- Stripe webhooks should verify subscription status
- Always validate user permissions before allowing actions

## Future Enhancements

- Add usage analytics dashboard
- Implement trial periods
- Add family/team plans
- Create usage-based pricing tiers
- Add feature gating for premium features


