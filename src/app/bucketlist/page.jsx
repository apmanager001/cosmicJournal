import { PaintBucket } from "lucide-react";
import BucketList from "./comp/bucketList";
import SearchBucketlist from "./comp/searchBucketlist";
import Link from "next/link.js";
import PageHeaderCard from "@/comp/headers/PageHeaderCard";

const Page = () => {
  return (
    <div className="container mx-auto md:px-4 md:py-8 min-h-screen">
      <PageHeaderCard
        icon={<PaintBucket strokeWidth={2.5} />}
        title="Bucket List"
        description="Explore and manage your bucket list items. Search for new adventures to add to your list and keep track of your goals all in one place!"
        rightContent={
          <>
            <div className="btn btn-primary btn-sm md:btn-md">
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </>
        }
      />
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="customContainer p-4 w-full md:w-1/2 min-h-[400px]">
          <SearchBucketlist />
        </div>
        <div className="customContainer p-4 w-full md:w-1/2 min-h-[500px]">
          <BucketList />
        </div>
      </div>
    </div>
  );
};

export default Page;
