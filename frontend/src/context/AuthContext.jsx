"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          setUser(session.user);
          setCredits(session.user.credits || 0);
        }
      } catch (err) {
        console.error("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || "Login failed");
    setUser(data?.user || null);
    return data;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    if (error) throw new Error(error.message || "Google login failed");
    setUser(data?.user || null);
    return data;
  };

  const register = async (name, email, password, image, role) => {
    const credits = role === "creator" ? 20 : 50;
    const { data, error } = await authClient.signUp.email({ name, email, password, image, role, credits });
    if (error) throw new Error(error.message || "Registration failed");
    setUser(data?.user || null);
    setCredits(credits);
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUser(session.user);
        setCredits(session.user.credits || 0);
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider value={{ user, credits, loading, login, loginWithGoogle, register, logout, refreshUser, setUser, setCredits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
