"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchUserGoals, addGoal } from "@/comp/utility/tanstack/goalsService";
import { Plus, X, Info } from "lucide-react";
import { toast } from "react-hot-toast";

const SearchGoals = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    notes: "",
    completed: false,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["userGoals"],
    queryFn: fetchUserGoals,
  });

  const handleAddGoal = async () => {
    if (!newGoal.title) {
      toast.error("Title is required.", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    try {
      await addGoal(newGoal);
      setNewGoal({ title: "", notes: "", completed: false });
      queryClient.invalidateQueries({ queryKey: ["userGoals"] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-end">
        {data?.length >
        parseInt(process.env.NEXT_PUBLIC_FREE_TIER_GOALS_LIMIT || "0", 10) ? (
          <button className="btn md:btn-lg btn-error text-error-content text-sm cursor-pointer flex justify-center items-center gap-2 shadow-md p-4 mt-2 rounded-b-2xl">
            <Info className="w-6 h-6 mr-2" />
            Goals limit reached. Please upgrade your plan to add more items.
          </button>
        ) : (
          <button
            className="btn btn-primary rounded-2xl"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2" /> Add Goal
          </button>
        )}
      </div>
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="modal modal-open">
            <div className="modal-box">
              <div
                className="absolute right-4 top-4 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="bg-base-200 p-2 rounded-full hover:bg-base-300">
                  <X />
                </div>
              </div>
              <h3 className="font-bold text-lg">Add New Goal</h3>
              <div className="py-4">
                <input
                  id="goal-title"
                  type="text"
                  placeholder="Goal Title"
                  className="input input-bordered w-full mb-4"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  autoComplete="off"
                  required
                />
                <textarea
                  id="goal-notes"
                  placeholder="Goal Notes"
                  className="textarea textarea-bordered w-full"
                  value={newGoal.notes}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, notes: e.target.value })
                  }
                  autoComplete="off"
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-primary rounded-2xl"
                  onClick={handleAddGoal}
                >
                  Add Goal
                </button>
                <button
                  className="btn btn-ghost rounded-2xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            >
              <button>close</button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SearchGoals;
