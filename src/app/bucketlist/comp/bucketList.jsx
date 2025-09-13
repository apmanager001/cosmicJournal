"use client";
import React, { useEffect, useState } from "react";
import { fetchUserBucketListItems } from "../../../comp/utility/tanstack/bucketlistService";
import { Link } from "lucide-react";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BucketList = () => {
  const [bucketListItems, setBucketListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBucketListItems = async () => {
      try {
        const result = await fetchUserBucketListItems();
        setBucketListItems(result);
      } catch (err) {
        console.error("Error fetching bucket list items:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBucketListItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error("BucketList encountered an error:", error);
    return <div>Error loading bucket list items.</div>;
  }

  const incompleteItems = bucketListItems.filter((item) => !item.completed);
  const completedItems = bucketListItems.filter((item) => item.completed);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Bucket List</h2>
        {incompleteItems.length === 0 && completedItems.length === 0 && (
          <p className="text-gray-500">No items in your bucket list. Start adding some! <Link href="/bucketlist" className="text-blue-500">Click Here</Link></p>
        )}
        {incompleteItems.length > 0 && (
          <h3 className="text-lg font-semibold mb-2">Still have time to Achieve</h3>
        )}
      <ul className="space-y-2">
        {incompleteItems.map((item) => (
          <li key={item?.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                defaultChecked={item?.completed || false}
              />
              <div className="flex justify-between w-full">
                <span>{item.item?.title || "Unknown Item"}</span>
                <span>{formatDate(item.created)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {completedItems.length > 0 && (
        <h3 className="text-lg font-semibold mt-6 mb-2">Completed Items</h3>
      )}
      <ul className="space-y-2">
        {completedItems.map((item) => (
          <li key={item?.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                defaultChecked={item?.completed || false}
              />
              <div className="flex justify-between w-full">
                <span className="line-through">
                  {item.item?.title || "Unknown Item"}
                </span>
                <span>{formatDate(item.created)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BucketListWithErrorBoundary = () => {
  try {
    return <BucketList />;
  } catch (error) {
    console.error("Error rendering BucketList:", error);
    return <div>Error rendering Bucket List.</div>;
  }
};

export default BucketListWithErrorBoundary;
