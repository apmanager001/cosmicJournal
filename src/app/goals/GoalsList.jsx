"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchUserGoals,
  updateUserGoal,
  deleteUserGoal,
} from "@/comp/utility/tanstack/goalsService";
import { Trash2, NotebookText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const GoalsList = () => {
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

  const toggleNotes = (id) => {
    setOpenNotesId((prev) => (prev === id ? null : id));
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

  if (isLoading) return (
    <div className="min-h-72 flex justify-center items-center">
      <span className="loading loading-bars loading-lg loading-primary"></span>
    </div>
  );
  if (error) return <div>Error loading goals.</div>;

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="p-4">
      {incompleteGoals.length === 0 && completedGoals.length === 0 && (
        <p className="text-gray-500">No goals found. Start adding some!</p>
      )}
      {incompleteGoals.length > 0 && (
        <h3 className="text-lg font-semibold mb-2">Incomplete Goals</h3>
      )}
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
              <div className="flex justify-around items-center gap-4 w-full">
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-soft btn-info rounded-full"
                    onClick={() => toggleNotes(goal.id)}
                  >
                    <NotebookText />
                  </button>
                </div>
                <span className="flex-2 text-left">
                  {goal.title || "Unknown Goal"}
                </span>
                
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

      {completedGoals.length > 0 && (
        <h3 className="text-lg font-semibold mt-6 mb-2">Completed Goals</h3>
      )}
      <ul className="space-y-2">
        {completedGoals.map((goal) => (
          <li key={goal.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <input
                id={`checkbox-${goal.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={goal.completed || false}
                onChange={() => handleCheckboxChange(goal.id, false)}
              />
              <div className="flex justify-around items-center w-full">
                <span className="flex-2 text-left">
                  {goal.title || "Unknown Goal"}
                </span>
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-soft btn-info rounded-full"
                    onClick={() => toggleNotes(goal.id)}
                  >
                    <NotebookText />
                  </button>
                  <button className="btn btn-soft btn-error rounded-full">
                    <Trash2
                      size={24}
                      className="cursor-pointer"
                      onClick={() => handleDeleteClick(goal.id)}
                    />
                  </button>
                </div>
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
};

export default GoalsList;
