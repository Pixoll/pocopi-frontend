import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import api from "@/api";
import type { Credentials } from "@/api";

type UserRole = 'user' | 'admin' | null;

type AuthContextType = {
  token: string | undefined;
  isLoggedIn: boolean;
  isValidating: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  setToken: (token: string | undefined) => void;
  credentials: Credentials | null;
  generateCredentials: () => Credentials;
  clearAuth: () => void;
  validateTokenStatus: () => Promise<boolean>;
  login: (newToken: string) => Promise<void>;
  hasUpdatedAnonymousCredentials: boolean;
  markAnonymousCredentialsUpdated: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "token";
const ANONYMOUS_UPDATED_KEY = "anonymous_credentials_updated";
const TOKEN_CHECK_INTERVAL = 5 * 60_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [hasUpdatedAnonymousCredentials, setHasUpdatedAnonymousCredentials] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    const anonymousUpdated = localStorage.getItem(ANONYMOUS_UPDATED_KEY) === 'true';

    if (storedToken) {
      setTokenState(storedToken);
    } else {
      setIsValidating(false);
    }

    setHasUpdatedAnonymousCredentials(anonymousUpdated);
  }, []);

  useEffect(() => {
    if (token && isValidating) {
      validateTokenStatus().then(() => {
        setIsValidating(false);
      });
    }
  }, [token, isValidating]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const newToken = event.newValue || undefined;
        setTokenState(newToken);

        if (!newToken && token) {
          clearAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  useEffect(() => {
    if (token) {
      validateTokenStatus();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      validateTokenStatus();
    }, TOKEN_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [token]);

  const validateTokenStatus = async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    try {
      const adminResponse = await api.getCurrentAdmin();

      if (adminResponse && adminResponse.data) {
        setUserRole('admin');
        return true;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const userResponse = await api.getCurrentUser();

      if (userResponse && userResponse.data) {
        setUserRole('user');
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    await clearAuth();
    return false;
  };

  const setToken = (newToken: string | undefined) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem(STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (newToken: string): Promise<void> => {
    setToken(newToken);
    setTokenState(newToken);

    const isValid = await validateTokenStatus();

    if (!isValid) {
      clearAuth();
    }
  };

  const clearAuth = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setToken(undefined);
    setUserRole(null);
    localStorage.removeItem(ANONYMOUS_UPDATED_KEY);
    setHasUpdatedAnonymousCredentials(false);

    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  function generateCredentials (): Credentials{
    const username = uuidv4().replace(/-/g, "");
    const password = uuidv4().replace(/-/g, "");
    setCredentials({username, password})
    return {username, password}
  }

  const markAnonymousCredentialsUpdated = () => {
    localStorage.setItem(ANONYMOUS_UPDATED_KEY, 'true');
    setHasUpdatedAnonymousCredentials(true);
  };

  const isLoggedIn = !!token;
  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        isValidating,
        userRole,
        isAdmin,
        isUser,
        setToken,
        generateCredentials,
        credentials,
        clearAuth,
        validateTokenStatus,
        login,
        hasUpdatedAnonymousCredentials,
        markAnonymousCredentialsUpdated
      }}
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
