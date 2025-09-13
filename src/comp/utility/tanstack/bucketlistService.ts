import PocketBase, { ClientResponseError } from "pocketbase";
import { authService } from "./auth";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
);
pb.autoCancellation(false);
export const fetchBucketlistItems = async (
  searchTerm: string
): Promise<any> => {
  const filter = `(title~"${searchTerm}" || description~"${searchTerm}")`;

  try {
    const resultList = await pb.collection("bucketlist_items").getList(1, 5, {
      filter,
    });
    return resultList.items;
  } catch (error: any) {
    console.error("Error fetching bucketlist items:", error); // Log error details
    throw new Error(
      `Error fetching bucketlist items: ${error.message || "Unknown error"}`
    );
  }
};

export const addBucketlistItem = async (itemData: {
  title: string;
  created_by?: string;
  description?: string;
  is_global?: boolean;
  is_public?: boolean;
}): Promise<any> => {
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
  return response.json();
};

export const fetchUserBucketListItems = async (): Promise<any> => {
//   const dedicatedClient = new PocketBase(
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
//   ); // Dedicated client instance

  try {
    const result = await pb
      .collection("user_bucketlist")
      .getFullList({
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
          return { ...entry, item: itemDetails }; // Replace item ID with full item object
        } catch (error) {
          const typedError = error as { name?: string }; // Explicitly type the error
          if (typedError.name === "AbortError") {
            console.warn(
              `Retrying fetch for item ID ${entry.item} due to AbortError.`
            );
            return await pb
              .collection("bucketlist_items")
              .getOne(entry.item);
          }
          console.error(
            `Error fetching details for item ID ${entry.item}:`,
            error
          );
          return { ...entry, item: null }; // Gracefully handle missing items
        }
      })
    );
    return enrichedResult;
  } catch (error: any) {
    console.error("Error fetching user bucket list items:", error);
    throw new Error(
      `Error fetching user bucket list items: ${
        error.message || "Unknown error"
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
  } catch (error: any) {
    console.error("Error adding to user_bucketlist:", error?.data || error); // Log detailed error response
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
