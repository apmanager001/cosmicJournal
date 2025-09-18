"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchUserGoals,
  updateUserGoal,
  deleteUserGoal,
} from "@/comp/utility/tanstack/goalsService";
import { Trash2 } from "lucide-react";
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

  if (isLoading) return <div>Loading goals...</div>;
  if (error) return <div>Error loading goals.</div>;

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Goals</h2>
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
              <input
                id={`checkbox-${goal.id}`}
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={goal.completed || false}
                onChange={() => handleCheckboxChange(goal.id, true)}
              />
              <div className="flex justify-between items-center w-full">
                <span className="flex-1 text-left">
                  {goal.title || "Unknown Goal"}
                </span>
                <span className="flex-1 text-right">
                  <button className="btn btn-soft btn-error rounded-full">
                    <Trash2
                      color="red"
                      size={24}
                      className="cursor-pointer"
                      onClick={() => handleDeleteClick(goal.id)}
                    />
                  </button>
                </span>
              </div>
            </div>
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
              <div className="flex justify-between w-full">
                <span className="flex-1 text-left line-through">
                  {goal.title || "Unknown Goal"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isDeleteModalOpen && (
        <div className="modal modal-open flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to remove this goal?</p>
            <div className="modal-action">
              <button className="btn btn-error rounded-2xl" onClick={confirmDelete}>
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
