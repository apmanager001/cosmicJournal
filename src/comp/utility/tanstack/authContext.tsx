"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { pb } from "./pocketbase";
import { User, authService } from "./auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    passwordConfirm: string,
    name?: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  requestEmailVerification: (email: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      // Check if user is already authenticated
      if (pb.authStore.isValid && pb.authStore.model) {
        setUser(pb.authStore.model as unknown as User);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (token && model) {
        setUser(model as unknown as User);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await authService.login({ email, password });
      setUser(authData.record as unknown as User);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    name?: string
  ) => {
    try {
      await authService.register({ email, password, passwordConfirm, name });
      // After registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      if (pb.authStore.isValid) {
        const authData = await pb.collection("users").authRefresh();
        setUser(authData.record as unknown as User);
      }
    } catch (error) {
      console.error("Failed to refresh auth:", error);
      logout();
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    try {
      await authService.updateEmail(newEmail);
      console.log("User email updated to:", newEmail);
      // Refresh user to ensure new email is reflected
      await refreshUser();
    } catch (error) {
      console.error("Failed to update user email:", error);
      throw error;
    }
  };

  const requestEmailVerification = async (email: string) => {
    try {
      await authService.requestVerification(email);
      console.log("Email verification requested for:", email);
    } catch (error) {
      console.error("Failed to request email verification:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    requestEmailVerification,
    updateUserEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
