import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Return available subscription plans
    const plans = [
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

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}



















