"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { pb } from "./pocketbase";
import { User } from "./auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => void;
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
        setUser(pb.authStore.model as User);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (token && model) {
        setUser(model as User);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      if (pb.authStore.isValid) {
        const authData = await pb.collection("users").authRefresh();
        setUser(authData.record as User);
      }
    } catch (error) {
      console.error("Failed to refresh auth:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



