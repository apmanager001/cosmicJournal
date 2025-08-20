import { NextRequest, NextResponse } from "next/server";

// For now, we'll use a mock subscription system
// In a real implementation, you would integrate with Stripe properly

export async function GET(request: NextRequest) {
  try {
    // Mock response for development
    // This simulates a free tier user
    return NextResponse.json({
      hasSubscription: false,
      subscription: null,
      status: "free",
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
