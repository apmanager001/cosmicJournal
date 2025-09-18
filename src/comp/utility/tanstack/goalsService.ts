import PocketBase from "pocketbase";
import { toast } from "react-hot-toast";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
);
pb.autoCancellation(false);

interface Goal {
  id: string;
  title: string;
  notes?: string;
  created_by?: string;
  created: string;
  updated: string;
}

export const fetchUserGoals = async (): Promise<Goal[]> => {
  try {
    const currentUser = pb.authStore.model;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const goals = await pb.collection("goals_user").getFullList({
      filter: `user = '${currentUser.id}'`,
      sort: "-created",
    });

    return goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      notes: goal.notes,
      completed: goal.completed,
      created: goal.created,
      updated: goal.updated,
    }));
  } catch (error) {
    console.error("Error fetching user goals:", error);
    throw new Error("Failed to fetch user goals.");
  }
};

export const addGoal = async (
  goalData: Omit<Goal, "id" | "created" | "updated">
): Promise<Goal> => {
  try {
    const currentUser = pb.authStore.model;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
        console.log("Adding goal with data:", goalData);
    const payload = {
      ...goalData,
      user: currentUser.id,
    };

    const createdGoal = await pb.collection("goals_user").create(payload);
    toast.success("Goal added successfully!", {
      position: "top-right",
      duration: 3000,
    });

    return {
      id: createdGoal.id,
      ...payload,
      created: createdGoal.created,
      updated: createdGoal.updated,
    };
  } catch (error) {
    console.error("Error adding goal:", error);
    toast.error("Failed to add goal. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const deleteUserGoal = async (goalId: string): Promise<void> => {
  try {
    await pb.collection("goals_user").delete(goalId);
    toast.success("Goal deleted successfully!", {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    toast.error("Failed to delete goal. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const updateUserGoals = async (goalId: string): Promise<void> => {
  try {
    await pb.collection("goals_user").delete(goalId);
    toast.success("Goal deleted successfully!", {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    toast.error("Failed to delete goal. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const updateUserGoal = async (
  goalId: string,
  updates: Partial<{ completed: boolean; notes: string }>
): Promise<void> => {
  try {
    await pb.collection("goals_user").update(goalId, updates);
    const message = updates.completed
      ? "Goal marked as completed!"
      : "Goal marked as uncompleted!";
    toast.success(message, {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    console.error(`Error updating goal ${goalId}:`, error);
    toast.error("Failed to update your Goal. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};
