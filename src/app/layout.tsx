import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/comp/utility/tanstack/authContext";
import { SubscriptionProvider } from "@/comp/utility/tanstack/subscriptionContext";
import { QueryProvider } from "@/comp/utility/tanstack/queryProvider";
import Header from "@/comp/headers/header";
import CosmicFooter from "@/comp/utility/CosmicFooter";
import Toasters from "@/comp/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cosmic Journal - Track Habits & Journal Your Journey",
  description:
    "A cosmic-themed habit tracking and journaling app to help you build consistency and explore your thoughts through the cosmos.",
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
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Header />
                <main className="relative z-10">{children}</main>
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
