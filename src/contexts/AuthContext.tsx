"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserRole } from "@/types";

export interface AppUser {
  id: string;
  uid: string; // alias for id, for backward compat
  email: string;
  name: string;
  displayName: string; // alias for name
  role: UserRole;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = (data: { id: string; email: string; name: string; role: UserRole }): AppUser => ({
    id: data.id,
    uid: data.id,
    email: data.email,
    name: data.name,
    displayName: data.name,
    role: data.role,
  });

  const buildProfile = (data: { id: string; email: string; name: string; role: UserRole }): UserProfile => ({
    uid: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  });

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(buildUser(data.user));
          setUserProfile(buildProfile(data.user));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    setUser(buildUser(data.user));
    setUserProfile(buildProfile(data.user));
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(buildUser(data.user));
    setUserProfile(buildProfile(data.user));
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (_email: string) => {
    // Not applicable for SQL-backed auth, but provide a graceful message
    throw new Error("Password reset is not available. Please contact support.");
  };

  const refreshProfile = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) {
      setUser(buildUser(data.user));
      setUserProfile(buildProfile(data.user));
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
