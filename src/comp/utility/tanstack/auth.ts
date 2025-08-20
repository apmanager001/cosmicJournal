import { pb } from "./pocketbase";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
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
};

