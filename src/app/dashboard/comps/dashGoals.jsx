'use client'

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchUserGoals,
  updateUserGoal,
  deleteUserGoal,
} from "@/comp/utility/tanstack/goalsService";
import { Trash2, NotebookText, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const DashGoals = () => {
    const queryClient = useQueryClient();
    const {
      data: goals = [],
      isLoading,
      error,
    } = useQuery({
      queryKey: ["userGoals"],
      queryFn: fetchUserGoals,
    });
    const [deleteGoalId, setDeleteGoalId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [openNotesId, setOpenNotesId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };
    const handleCheckboxChange = async (goalId, newCompletedValue) => {
      try {
        await updateUserGoal(goalId, { completed: newCompletedValue });
        queryClient.invalidateQueries({ queryKey: ["userGoals"] });
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    };

    const handleDeleteClick = (goalId) => {
      setDeleteGoalId(goalId);
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      try {
        await deleteUserGoal(deleteGoalId);
        queryClient.invalidateQueries({ queryKey: ["userGoals"] });
      } catch (error) {
        console.error("Error deleting goal:", error);
        toast.error("Failed to remove goal. Please try again.", {
          position: "top-right",
          duration: 3000,
        });
      } finally {
        setIsDeleteModalOpen(false);
        setDeleteGoalId(null);
      }
    };

    if (isLoading)
      return (
        <div className="min-h-72 flex justify-center items-center">
          <span className="loading loading-bars loading-lg loading-primary"></span>
        </div>
      );
    if (error) return <div>Error loading goals.</div>;

    const incompleteItems = goals.filter((goal) => !goal.completed);

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

    const incompleteGoals = paginatedIncompleteItems;

  return (
    <div
      className={`inline-flex flex-col ${incompleteGoals.length === 0 ? "justify-center" : ""} gap-2 p-3 mb-2 h-full w-full`}
    >
      {incompleteGoals.length === 0 && (
        <div className="text-center pt-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold  mb-2">No Goals yet</h3>
          <p className="text-gray-400 mb-6">
            Start by adding a new goal to track your progress and achievements!
          </p>
        </div>
      )}
      <span className="flex justify-end items-center text-base-content/60 mb-2">
       {incompleteGoals.length > 0 &&
        <h4>
          {totalIncomplete === 0
            ? "0 of 0"
            : `${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                safeCurrentPage * ITEMS_PER_PAGE,
                totalIncomplete,
              )} of ${totalIncomplete}`}
        </h4>}
      </span>
      <ul className="space-y-2">
        {incompleteGoals.map((goal) => (
          <li key={goal.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <button className="btn btn-soft btn-error btn-sm rounded-full">
                <Trash2
                  size={24}
                  className="cursor-pointer"
                  onClick={() => handleDeleteClick(goal.id)}
                />
              </button>
              <input
                id={`checkbox-${goal.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={goal.completed || false}
                onChange={() => handleCheckboxChange(goal.id, true)}
              />
              <div className="w-full text-left ml-4">
                <p className="flex-1 min-w-36 md:min-w-52 text-left flex flex-col justify-left items-start">
                  {goal.title || "Unknown Goal"}
                  <span className="text-sm text-base-content/60 ml-2">
                    {formatDate(goal.created)}
                  </span>
                </p>
              </div>
            </div>
            {openNotesId === goal.id && (
              <div className="ml-8 mt-1 text-sm p-2 border border-base-content/10 rounded-2xl">
                {goal.notes || "No notes available."}
              </div>
            )}
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
      {isDeleteModalOpen && (
        <div className="modal modal-open flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to remove this goal?</p>
            <div className="modal-action">
              <button
                className="btn btn-error rounded-2xl"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-ghost rounded-2xl"
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
}

export default DashGoals