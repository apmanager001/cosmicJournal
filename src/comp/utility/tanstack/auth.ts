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

  // Login with Facebook OAuth
  loginWithFacebook: async () => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "facebook",
        redirectUrl: `${window.location.origin}/auth/callback`,
      });
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Login with Apple OAuth
  loginWithApple: async () => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "apple",
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
};
