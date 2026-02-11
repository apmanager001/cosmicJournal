import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/comp/utility/tanstack/authContext";
import { SubscriptionProvider } from "@/comp/utility/tanstack/subscriptionContext";
import { QueryProvider } from "@/comp/utility/tanstack/queryProvider";
import Header from "@/comp/headers/header";
import CosmicFooter from "@/comp/headers/CosmicFooter";
import Toasters from "@/comp/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadataBase = new URL("https://cosmicjournal.app");

export const metadata: Metadata = {
  title: {
    default: "Cosmic Journal — Habit Tracker & Guided Journaling App",
    template: "%s | Cosmic Journal",
  },
  description:
    "Cosmic Journal helps you build consistent habits and capture daily reflections with guided journaling, habit tracking, reminders, and progress insights.",
  keywords: [
    "habit tracker",
    "journal app",
    "guided journaling",
    "habit tracking",
    "bucket list",
    "goals",
    "productivity",
    "wellness",
    "self-improvement",
  ],
  authors: [{ name: "Cosmic Journal" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cosmic Journal — Habit Tracker & Guided Journaling App",
    description:
      "Build consistent habits and capture daily reflections with guided journaling. Track progress, set reminders, and grow over time.",
    siteName: "Cosmic Journal",
    type: "website",
    images: [`${metadataBase.origin}/icon.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosmic Journal — Habit Tracker & Guided Journaling App",
    description:
      "Build consistent habits and capture daily reflections with guided journaling.",
    images: [
      `${metadataBase.origin}/icon.png`,
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <div className="min-h-screen">
                <Header />
                <main className="relative z-10 min-h-screen">{children}</main>
                <CosmicFooter />
              </div>
              <Toasters />
            </SubscriptionProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
