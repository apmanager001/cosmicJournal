import PocketBase from "pocketbase";
import { authService } from "./auth";

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
    console.error("Error fetching bucketlist items:", error); // Log error details
    throw new Error(
      `Error fetching bucketlist items: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const addBucketlistItem = async (
  itemData: BucketlistItem
): Promise<BucketlistItem> => {
  const response = await fetch(`${pb}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error(`Error adding bucketlist item: ${response.statusText}`);
  }
  return (await response.json()) as BucketlistItem;
};

export const fetchUserBucketListItems = async (): Promise<
  UserBucketlistItem[]
> => {
  try {
    const result = await pb.collection("user_bucketlist").getFullList({
      sort: "-created",
      requestKey: `user_bucketlist_${Date.now()}`, // Unique request key
    });

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

export const addToUserBucketlist = async (itemId: string): Promise<void> => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const payload = {
      user: currentUser.id, // Use the authenticated user's ID
      item: itemId,
      notes: "",
      completed: false,
    };
    console.log("Payload for user_bucketlist:", payload); // Debugging log

    await pb.collection("user_bucketlist").create(payload);
    console.log("Added to user_bucketlist");
  } catch (error) {
    console.error("Error adding to user_bucketlist:", error); // Log detailed error response
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
    console.log("Flag added with reason:", reason);
  } catch (error) {
    console.error("Error adding flag:", error);
    throw error;
  }
};
