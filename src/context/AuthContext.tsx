"use client";

import * as React from "react";
import { AuthService } from "@/services/auth.service";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Purely in-memory state — zero localStorage usage for zero XSS token/data leakage
  const [user, setUserState] = React.useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const setUser = React.useCallback((newUser: AuthUser | null) => {
    setUserState(newUser);
    setIsLoggedIn(!!newUser);
  }, []);

  // Check auth session via HTTP-Only cookie on app mount
  const refreshUser = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await AuthService.getMe();
      if (res && (res.id || res.email || res.name || res.profile)) {
        const authUser: AuthUser = {
          id: res.id || res.user?.id || "user_active",
          name: res.profile?.fullName || res.name || res.user?.name || res.email?.split("@")[0] || "Customer",
          email: res.email || res.user?.email || "",
          role: res.roles?.[0] || res.role || res.user?.role || "CUSTOMER",
          avatar: res.profile?.avatar,
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = React.useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
    }
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
