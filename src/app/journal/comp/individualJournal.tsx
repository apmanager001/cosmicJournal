"use client";
import { useJournalEntryById } from "@/comp/utility/tanstack/habitHooks";
import { useParams } from "next/navigation";

const IndividualJournal = (props: {
  id?: string;
  params?: { id?: string };
}) => {
  const routeParams = useParams<{ id?: string }>();
  const id = props.id ?? props.params?.id ?? routeParams?.id;

  if (!id) {
    return <div className="p-4 text-red-600">Entry ID is missing.</div>;
  }

  const { data: entry, isLoading, error } = useJournalEntryById(id);
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-600">Failed to load entry.</div>;
  if (!entry) return <div className="p-4">Entry not found.</div>;

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
console.log(entry)
  return (
    <div className="customContainer m-4 p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-2">
          {new Date(entry.date).toLocaleString()}
        </h2>
        <div className="text-xl">
          <span className="text-base-content/60">{entry.mood}</span>{" "}
          {entry.mood ? getMoodEmoji(entry.mood) : "📝"}
        </div>
      </div>
      <section className="mb-4">
        <h3 className="font-medium text-base-content/60">What I did</h3>
        <p className="whitespace-pre-wrap">{entry.whatIDid}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-medium text-base-content/60">What I learned</h3>
        <p className="whitespace-pre-wrap">{entry.whatILearned}</p>
      </section>
      {entry.additionalNotes?.trim() && (
      <section className="mb-4">
        <h3 className="font-medium text-base-content/60">Additional notes</h3>
        <p className="whitespace-pre-wrap">{entry.additionalNotes}</p>
      </section>
      )}
      <div className="text-sm text-gray-400">
        Created:{" "}
        {new Date((entry as any).created_on ?? entry.created).toLocaleString()}
      </div>
    </div>
  );
};

export default IndividualJournal;
