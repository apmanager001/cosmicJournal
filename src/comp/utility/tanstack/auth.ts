import { pb } from "./pocketbase";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

export interface AuthModel {
  token: string;
  model: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
}

// Authentication functions
export const authService = {
  // Get current user
  getCurrentUser: () => {
    return pb.authStore.model as User | null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return pb.authStore.isValid;
  },

  // Login with email/password
  login: async (credentials: LoginCredentials) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(credentials.email, credentials.password);
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Login with Google OAuth
  loginWithGoogle: async () => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "google",
        redirectUrl: `${window.location.origin}/auth/callback`,
      });
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (credentials: RegisterCredentials) => {
    try {
      const user = await pb.collection("users").create({
        email: credentials.email,
        password: credentials.password,
        passwordConfirm: credentials.passwordConfirm,
        name: credentials.name,
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    pb.authStore.clear();
  },

  // Refresh auth
  refresh: async () => {
    try {
      const authData = await pb.collection("users").authRefresh();
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Request email verification
  requestVerification: async (email: string) => {
    try {
      await pb.collection("users").requestVerification(email);
    } catch (error) {
      throw error;
    }
  },

  updateEmail: async (newEmail: string) => {
    try {
      if (!pb.authStore.model?.id) {
        throw new Error("User not authenticated");
      }

      const sanitizedEmail = newEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        throw new Error("Invalid email format");
      }

      // Check if the new email is different from current
      if (pb.authStore.model.email === sanitizedEmail) {
        throw new Error("New email is the same as current email");
      }

      // Check if the new email already exists for another user
      try {
        const existingUser = await pb
          .collection("users")
          .getFirstListItem(`email = "${sanitizedEmail}"`);
        if (existingUser && existingUser.id !== pb.authStore.model.id) {
          throw new Error("This email is already in use by another user");
        }
      } catch (checkError: unknown) {
        const error = checkError as { status?: number };
        if (error.status === 404) {
          // Email doesn't exist, which is good
          console.log("Email availability check passed");
        } else {
          console.log("Email availability check error:", checkError);
        }
      }

      // Request email change - this will send a confirmation email
      await pb.collection("users").requestEmailChange(sanitizedEmail);

      return {
        success: true,
        message: `Email change requested. Please check your email at ${sanitizedEmail} and click the confirmation link to complete the change.`,
      };
    } catch (error: unknown) {
      console.error("Email update error details:", error);
      throw error;
    }
  },

  // Update user email
  // updateEmail: async (newEmail: string) => {
  //   try {
  //     if (!pb.authStore.model?.id) {
  //       throw new Error("User not authenticated");
  //     }

  //     // First, let's get the current user record to see what fields are available
  //     // const currentUser = await pb
  //     //   .collection("users")
  //     //   .getOne(pb.authStore.model.id);
  //     // console.log("Current user record from DB:", currentUser);

  //     // Check if the new email is different from current
  //     // if (currentUser.email === newEmail) {
  //     //   throw new Error("New email is the same as current email");
  //     // }
  //       // const user = await pb
  //       //   .collection("users")
  //       //   .update(currentUser.id, { email: newEmail });
  //      console.log("Requesting email change for:", pb.authStore.model.email);
  //      const user = await pb.collection("users").requestEmailChange(newEmail);
  //      console.log("User:", user);

  //       // After updating email in an auth collection, we need to refresh the auth
  //       // This ensures the new email is reflected in the current session
  //       await pb.collection("users").authRefresh();

  //       console.log(user);
  //       return user;
  //       user.email;

  //   } catch (error: any) {
  //     console.error("Email update error details:", error);
  //     if (error.response) {
  //       console.error("Response data:", error.response);
  //       console.error("Response status:", error.status);
  //       console.error("Response message:", error.message);

  //       // Check for specific validation errors
  //       if (error.response.data && error.response.data.details) {
  //         const details = error.response.data.details;
  //         console.error("Validation details:", details);
  //         console.error("Full error response:", error.response);

  //         // Check for specific email validation errors
  //         if (details.email) {
  //           console.error("Email field validation error:", details.email);
  //           if (details.email === "Values don't match.") {
  //             throw new Error(
  //               "Email validation failed. The email format may be invalid or there may be a unique constraint issue. Please check your PocketBase collection settings for email validation rules."
  //             );
  //           } else if (typeof details.email === "string") {
  //             throw new Error(`Email validation error: ${details.email}`);
  //           } else if (typeof details.email === "object") {
  //             throw new Error(
  //               `Email validation error: ${JSON.stringify(details.email)}`
  //             );
  //           }
  //         }

  //         // Check for other field validation errors
  //         Object.keys(details).forEach((field) => {
  //           if (field !== "email" && details[field]) {
  //             console.error(`${field} field validation error:`, details[field]);
  //           }
  //         });
  //       }
  //     }
  //     throw error;
  //   }
  // },
};
