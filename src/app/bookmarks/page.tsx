"use client";
import ProtectedRoute from "@/comp/utility/tanstack/ProtectedRoute";
import { useBookmarkedJournalEntries } from "@/comp/utility/tanstack/habitHooks";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useSubscription } from "@/comp/utility/tanstack/subscriptionContext";
import { Bookmark, Star } from "lucide-react";
import Link from "next/link";
import PageHeaderCard from "@/comp/headers/PageHeaderCard";

export default function BookmarksPage() {
  return (
    <ProtectedRoute>
      <BookmarksContent />
    </ProtectedRoute>
  );
}

function BookmarksContent() {
  const {} = useAuth();
  const {} = useSubscription();
  const { data: bookmarkedEntries, isLoading } = useBookmarkedJournalEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      Happy: "😊",
      Sad: "😢",
      Excited: "🤩",
      Calm: "😌",
      Energetic: "⚡",
      Tired: "😴",
      Focused: "🎯",
      Creative: "🎨",
      Grateful: "🙏",
      Motivated: "💪",
    };
    return moodEmojis[mood] || "😐";
  };

  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <PageHeaderCard
        icon={<Bookmark strokeWidth={2.5} />}
        title="Bookmarks"
        description="Your Bookmarked journal entries and reflections"
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </>
        }
      />
      {/* Bookmarked Entries */}
      {bookmarkedEntries && bookmarkedEntries.length > 0 ? (
        <div className="customContainer p-6 md:mt-2 text-left w-full min-h-screen">
          <span className="text-base-content/60">
            Bookmarked Journal Entries
          </span>
          <div className="mt-3 space-y-3">
            {bookmarkedEntries.slice(0, 5).map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {entry.mood ? getMoodEmoji(entry.mood) : "📝"}
                    </div>
                    <div>
                      <p className="font-medium text-sm lg:text-base">
                        {formatDateLong(entry.date)}
                      </p>
                      {entry.whatIDid && (
                        <p className="text-xs lg:text-sm text-base-content/70 truncate max-w-65">
                          {entry.whatIDid}
                        </p>
                      )}
                    </div>
                  </div>
                  {entry.bookmarked && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="customContainer items-center rounded-lg shadow-lg p-12 text-center min-h-[500px]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold  mb-2">
            No bookmarked entries yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start journaling and bookmark your favorite entries to see them here
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary rounded-lg text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/journal"
              className="px-6 py-3 bg-secondary rounded-lg text-center"
            >
              Start Journaling
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
