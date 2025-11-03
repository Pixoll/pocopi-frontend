import { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {Credentials} from "@/api";

type AuthContextType = {
  credentials: Credentials | null;
  token: string | undefined;
  setCredentials: (credentials: Credentials) => void;
  setToken: (token: string | undefined) => void;
  generateCredentials: () => Credentials;
  clearAuth: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);

  const generateCredentials = (): Credentials => {
    const newCredentials = {
      username:  uuidv4().replace(/-/g, ""),
      password:  uuidv4().replace(/-/g, ""),
    };
    setCredentials(newCredentials);
    return newCredentials;
  };

  const clearAuth = () => {
    setCredentials(null);
    setToken(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        credentials,
        token,
        setCredentials,
        setToken,
        generateCredentials,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}