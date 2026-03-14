"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();

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
    const checkSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Get user profile from database
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (data && !error) {
            const appUser = buildUser(data);
            setUser(appUser);
            setUserProfile(buildProfile(data));
          }
        }
      } catch (error) {
        console.error("[v0] Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [supabase]);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed");

      // Create user record in database
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const appUser = buildUser(userData);
      setUser(appUser);
      setUserProfile(buildProfile(userData));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Login failed");

      // Get user profile from database
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (dbError) throw dbError;

      const appUser = buildUser(userData);
      setUser(appUser);
      setUserProfile(buildProfile(userData));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("[v0] Logout error:", error);
    }
  };

  const resetPassword = async (_email: string) => {
    throw new Error("Password reset is not available. Please contact support.");
  };

  const refreshProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (data && !error) {
          const appUser = buildUser(data);
          setUser(appUser);
          setUserProfile(buildProfile(data));
        }
      }
    } catch (error) {
      console.error("[v0] Error refreshing profile:", error);
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
