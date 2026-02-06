"use client";
import React from "react";
import { useJournalEntryById } from "@/comp/utility/tanstack/habitHooks";
import { useParams } from "next/navigation";

const IndividualJournal = (props) => {
  const routeParams = useParams();
  const id = props.id ?? props.params?.id ?? routeParams?.id;
  const { data: entry, isLoading, error } = useJournalEntryById(id);
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-600">Failed to load entry.</div>;
  if (!entry) return <div className="p-4">Entry not found.</div>;

  return (
    <div className="customContainer m-4 p-6">
      <h2 className="text-2xl font-semibold mb-2">
        {new Date(entry.date).toLocaleString()}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {entry.mood ? `Mood: ${entry.mood}` : null}
      </p>

      <section className="mb-4">
        <h3 className="font-medium">What I did</h3>
        <p className="whitespace-pre-wrap">{entry.whatIDid}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-medium">What I learned</h3>
        <p className="whitespace-pre-wrap">{entry.whatILearned}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-medium">Additional notes</h3>
        <p className="whitespace-pre-wrap">{entry.additionalNotes}</p>
      </section>

      <div className="text-sm text-gray-400">
        Created: {new Date(entry.created_on).toLocaleString()}
      </div>
    </div>
  );
};

export default IndividualJournal;
