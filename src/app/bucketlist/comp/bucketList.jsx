"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserBucketListItems,
  updateUserBucketlistItem,
  deleteUserBucketlistItem,
} from "../../../comp/utility/tanstack/bucketlistService";
import { Link, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchBucketListItems = async () => {
      try {
        console.log('fetching bucket list items');
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
  }, [fetchUserBucketListItems]);

  const handleCheckboxChange = async (itemId, newCompletedValue) => {
    try {
      await updateUserBucketlistItem(itemId, { completed: newCompletedValue });
      setBucketListItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, completed: newCompletedValue } : item
        )
      );
    } catch (error) {
      console.error("Error updating bucket list item:", error);
    }
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUserBucketlistItem(deleteItemId);
      setBucketListItems((prevItems) =>
        prevItems.filter((item) => item.id !== deleteItemId)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

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
        <p className="text-gray-500">
          No items in your bucket list. Start adding some!{" "}
          <Link href="/bucketlist" className="text-blue-500">
            Click Here
          </Link>
        </p>
      )}
      {incompleteItems.length > 0 && (
        <h3 className="text-lg font-semibold mb-2">
          Still have time to Achieve
        </h3>
      )}
      <ul className="space-y-2">
        {incompleteItems.map((item) => (
          <li key={item?.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <input
                id={`checkbox-${item.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={item?.completed || false}
                onChange={() => handleCheckboxChange(item.id, true)}
              />
              <div className="flex justify-between w-full">
                <span className="flex-1 min-w-52 text-left flex justify-left items-center">
                  {item.item?.title || "Unknown Item"}
                </span>
                <span className="flex-2 text-center w-32 flex justify-center items-center">
                  {formatDate(item.created)}
                </span>
                <span className="flex-2 text-right flex justify-center items-center">
                  <Trash2
                    color="red"
                    size={24}
                    className="cursor-pointer"
                    onClick={() => handleDeleteClick(item.id)}
                  />
                </span>
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
                id={`checkbox-${item.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={item?.completed || false}
                onChange={() => handleCheckboxChange(item.id, false)}
              />
              <div className="flex justify-between w-full">
                <span className="flex-1 text-left line-through">
                  {item.item?.title || "Unknown Item"}
                </span>
                <span className="flex-none text-center w-32">
                  {formatDate(item.created)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to remove this item from your bucket list?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
