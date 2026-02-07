import IndividualJournal from '../comp/individualJournal'
import { Notebook } from 'lucide-react';
import Link from 'next/link.js';
import PageHeaderCard from '@/comp/headers/PageHeaderCard';

const Page = () => {
  return (
    <div className="container mx-auto px-0 py-0 md:px-4 md:py-8 flex flex-col md:gap-4">
      <PageHeaderCard
        icon={<Notebook strokeWidth={2.5} />}
        title="Journal Entry"
        description="View and manage your individual journal entry."
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="btn btn-secondary btn-sm md:btn-md">
              <Link href="/journal">Journal</Link>
            </div>
          </>
        }
      />
      <IndividualJournal />
    </div>
  );
}

export default Page