import IndividualJournal from '../comp/individualJournal'
import { Notebook } from 'lucide-react';
import Link from 'next/link.js';

const Page = () => {
  return (
    <div className="container mx-auto px-0 py-0 md:px-4 md:py-8 flex flex-col gap-2 md:gap-4">
      <div className="flex-1 customContainer flex justify-center items-center p-6 mb-2 md:mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <div
              className={`border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105`}
            >
              <Notebook strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">
                Journal Entry
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                Your journal entry.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary rounded-lg text-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/journal"
                  className="px-4 py-2 bg-secondary rounded-lg text-center"
                >
                  Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IndividualJournal />
    </div>
  );
}

export default Page