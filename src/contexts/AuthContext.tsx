import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Credentials } from "@/api";
type AuthContextType = {
  token: string | undefined;
  isLoggedIn: boolean;
  setToken: (token: string | undefined) => void;
  generateCredentials: () => Credentials;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) setTokenState(storedToken);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setTokenState(event.newValue || undefined);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  const setToken = (newToken: string | undefined) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem(STORAGE_KEY, newToken);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const generateCredentials = (): Credentials => ({
    username: uuidv4().replace(/-/g, ""),
    password: uuidv4().replace(/-/g, ""),
  });

  const clearAuth = () => setToken(undefined);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, setToken, generateCredentials, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
