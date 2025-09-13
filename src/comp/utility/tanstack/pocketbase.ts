import PocketBase from "pocketbase";

// Create PocketBase client
export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8090"
);

// Export PocketBase instance for use in other files
export default pb;

