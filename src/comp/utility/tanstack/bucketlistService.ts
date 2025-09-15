import PocketBase from "pocketbase";
import { authService } from "./auth";
import { toast } from "react-hot-toast";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
);
pb.autoCancellation(false);

interface BucketlistItem {
  id: string;
  title: string;
  description?: string;
  created_by?: string;
  is_global?: boolean;
  is_public?: boolean;
  flag_count?: number;
}

interface UserBucketlistItem {
  id: string;
  user: string;
  item: BucketlistItem | null;
  notes: string;
  completed: boolean;
  created: string;
  updated: string;
}

interface BucketlistCategory {
  id: string;
  name: string;
  description?: string;
}

export const fetchBucketlistItems = async (
  searchTerm: string
): Promise<BucketlistItem[]> => {
  const filter = `(title~"${searchTerm}" || description~"${searchTerm}")`;

  try {
    const resultList = await pb.collection("bucketlist_items").getList(1, 5, {
      filter,
    });
    return resultList.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      created_by: item.created_by,
      is_global: item.is_global,
      is_public: item.is_public,
      flag_count: item.flag_count,
    }));
  } catch (error) {
    toast.error("Error getting your bucketlist items. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    console.error("Error fetching bucketlist items:", error); // Log error details
    throw new Error(
      `Error fetching bucketlist items: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const addBucketlistItem = async (
  itemData: Omit<BucketlistItem, "id"> & { category: string }
): Promise<BucketlistItem> => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const payload = {
      title: itemData.title,
      description: itemData.description,
      created_by: currentUser.id,
      is_global: true,
      is_public: true,
      flag_count: 0,
      status: "active",
      category: itemData.category,
    };

    const createdItem = await pb.collection("bucketlist_items").create(payload);
    toast.success("Bucketlist item added successfully!", {
      position: "top-right",
      duration: 3000,
    });

    return {
      id: createdItem.id,
      ...payload,
    };
  } catch (error) {
    console.error("Error adding bucketlist item:", error);
    toast.error("Failed to add bucketlist item. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const fetchUserBucketListItems = async (): Promise<
  UserBucketlistItem[]
> => {
  try {
    const result = await pb.collection("user_bucketlist").getFullList({
      sort: "-created",
      requestKey: `user_bucketlist_${Date.now()}`, // Unique request key
    });
    console.log("testing refresh list");
    // Fetch item details for each user_bucketlist entry
    const enrichedResult = await Promise.all(
      result.map(async (entry) => {
        try {
          const itemDetails = await pb
            .collection("bucketlist_items")
            .getOne(entry.item);
          return {
            id: entry.id,
            user: entry.user,
            item: {
              id: itemDetails.id,
              title: itemDetails.title,
              description: itemDetails.description,
              created_by: itemDetails.created_by,
              is_global: itemDetails.is_global,
              is_public: itemDetails.is_public,
              flag_count: itemDetails.flag_count,
            },
            notes: entry.notes,
            completed: entry.completed,
            created: entry.created,
            updated: entry.updated,
          };
        } catch (error) {
          console.error(
            `Error fetching details for item ID ${entry.item}:`,
            error
          );
          return {
            id: entry.id,
            user: entry.user,
            item: null,
            notes: entry.notes,
            completed: entry.completed,
            created: entry.created,
            updated: entry.updated,
          };
        }
      })
    );
    return enrichedResult;
  } catch (error) {
    console.error("Error fetching user bucket list items:", error);
    throw new Error(
      `Error fetching user bucket list items: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const addToUserBucketlist = async (
  itemId: string
): Promise<UserBucketlistItem[]> => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const payload = {
      user: currentUser.id,
      item: itemId,
      notes: "",
      completed: false,
    };
    await pb.collection("user_bucketlist").create(payload);
    toast.success("Added to your Bucketlist!", {
      position: "top-right",
      duration: 3000,
    });

    // Fetch updated bucketlist
    return await fetchUserBucketListItems();
  } catch (error) {
    toast.error("Error adding to your bucketlist: Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const flagBucketlistItem = async (
  itemId: string,
  reason: string
): Promise<void> => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    await pb.collection("bucketlist_items").update(itemId, {
      flag_count:
        (await pb.collection("bucketlist_items").getOne(itemId)).flag_count + 1,
    });
    await pb.collection("bucketlist_flags").create({
      item: itemId,
      flagged_by: currentUser.id,
      reason,
    });
    toast.success("Your Flag has been Submitted", {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    toast.error("Error adding flag: Please refresh the page and try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const updateUserBucketlistItem = async (
  itemId: string,
  updates: Partial<{ completed: boolean; notes: string }>
): Promise<void> => {
  try {
    await pb.collection("user_bucketlist").update(itemId, updates);
    const message = updates.completed
      ? "Item marked as completed!"
      : "Item marked as uncompleted!";
    toast.success(message, {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    console.error(`Error updating user_bucketlist item ${itemId}:`, error);
    toast.error("Failed to update item. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};

export const fetchCategories = async (): Promise<BucketlistCategory[]> => {
  try {
    const categories = await pb
      .collection("bucketlist_categories")
      .getFullList();

    // Map the categories to match the BucketlistCategory interface
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description || "",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories.");
  }
};

export const deleteUserBucketlistItem = async (
  itemId: string
): Promise<void> => {
  try {
    await pb.collection("user_bucketlist").delete(itemId);
    toast.success("Item removed successfully!", {
      position: "top-right",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.error("Failed to remove item. Please try again.", {
      position: "top-right",
      duration: 3000,
    });
    throw error;
  }
};
