import { PaintBucket } from "lucide-react";
import BucketList from "./comp/bucketList";
import SearchBucketlist from "./comp/searchBucketlist";
import Link from "next/link.js";

const Page = () => {
  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <div className="flex-1 customContainer flex justify-center items-center p-6 mb-2 md:mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <div
              className={`border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105`}
            >
              <PaintBucket strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">Bucket List</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Explore and manage your bucket list items. Search for new
                adventures to add to your list and keep track of your goals all
                in one place!
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <Link
                  href="/dashboard"
                  className="btn btn-primary"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 min-h-[500px]">
        <div className="customContainer p-4 w-full md:w-1/2">
          <SearchBucketlist />
        </div>
        <div className="customContainer p-4 w-full md:w-1/2">
          <BucketList />
        </div>
      </div>
    </div>
  );
};

export default Page;
