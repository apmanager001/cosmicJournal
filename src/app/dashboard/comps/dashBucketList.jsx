"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchUserBucketListItems,
  updateUserBucketlistItem,
  deleteUserBucketlistItem,
} from "../../../comp/utility/tanstack/bucketlistService";
import { PaintBucket, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DashBucketList = () => {
  const queryClient = useQueryClient();
  const {
    data: bucketListItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userBucketlist"],
    queryFn: fetchUserBucketListItems,
  });

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCheckboxChange = async (itemId, newCompletedValue) => {
    try {
      await updateUserBucketlistItem(itemId, { completed: newCompletedValue });
      queryClient.invalidateQueries({ queryKey: ["userBucketlist"] });
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
      queryClient.invalidateQueries({ queryKey: ["userBucketlist"] });
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

  if (isLoading)
    return (
      <div className="min-h-72 flex justify-center items-center">
        <span className="loading loading-bars loading-lg loading-primary"></span>
      </div>
    );
  if (error) {
    console.error("BucketList encountered an error:", error);
    return <div>Error loading bucket list items.</div>;
  }

  const incompleteItems = bucketListItems.filter((item) => !item.completed);
  const completedItems = bucketListItems.filter((item) => item.completed);

  const totalIncomplete = incompleteItems.length;
  const totalPages = totalIncomplete
    ? Math.ceil(totalIncomplete / ITEMS_PER_PAGE)
    : 1;

  const maxPage = totalPages || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), maxPage);

  const paginatedIncompleteItems = incompleteItems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (newPage) => {
    const clamped = Math.min(Math.max(newPage, 1), maxPage);
    if (clamped === currentPage) return;
    setCurrentPage(clamped);
  };

  return (
    <div className="inline-flex flex-col gap-2 p-3 mb-2 w-full">
      {incompleteItems.length === 0 && completedItems.length === 0 && (
        <div className="text-center pt-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PaintBucket className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Nothing in bucket list yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start by adding a new items to your bucket list!
          </p>
        </div>
      )}
      <span className="flex justify-end items-center text-base-content/60 mb-2">
        <h4>
          {totalIncomplete === 0
            ? "0 of 0"
            : `${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                safeCurrentPage * ITEMS_PER_PAGE,
                totalIncomplete,
              )} of ${totalIncomplete}`}
        </h4>
      </span>
      <ul className="space-y-2">
        {paginatedIncompleteItems.map((item) => (
          <li key={item?.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex-1 md:flex-2 text-right flex justify-center items-center">
                <button className="btn btn-soft btn-error btn-sm rounded-full ">
                  <Trash2
                    size={24}
                    className="cursor-pointer"
                    onClick={() => handleDeleteClick(item.id)}
                  />
                </button>
              </span>
              <input
                id={`checkbox-${item.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={item?.completed || false}
                onChange={() => handleCheckboxChange(item.id, true)}
              />
              <div className="w-full text-left ml-4">
                <p className="flex-1 min-w-36 md:min-w-52 text-left flex flex-col justify-left items-start">
                  {item.item?.title || "Unknown Item"}
                  <span className="text-sm text-base-content/60 ml-2">
                    {formatDate(item.created)}
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {totalIncomplete > ITEMS_PER_PAGE && (
        <div className="join w-full flex justify-center items-center mt-4">
          <button
            className="join-item btn rounded-l-3xl"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === safeCurrentPage;
            return (
              <button
                key={pageNumber}
                className={`join-item btn btn-square ${
                  isActive ? "btn-primary" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className="join-item btn rounded-r-3xl"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="modal modal-open">
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
            <div
              className="modal-backdrop"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <button>close</button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

const BucketListWithErrorBoundary = () => {
  try {
    return <DashBucketList />;
  } catch (error) {
    console.error("Error rendering BucketList:", error);
    return <div>Error rendering Bucket List.</div>;
  }
};

export default BucketListWithErrorBoundary;
