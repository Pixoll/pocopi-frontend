import api, { type Credentials, type FullConfig, type TrimmedConfig, type UserTestAttempt } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type LoginLogicOptions = {
  config: TrimmedConfig | FullConfig;
  onSuccess?: (attempt: UserTestAttempt) => void;
  stayOnPage?: boolean;
};

export function useLoginLogic({ config, onSuccess, stayOnPage = false }: LoginLogicOptions) {
  const { setToken, setUsername, generateCredentials } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAnonymous = config.anonymous;

  const login = async (credentials: Credentials): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      const response = await api.login({ body: credentials });

      if (response.data) {
        const token = response.data.token;
        setToken(token);
        setUsername(credentials.username);

        if (stayOnPage) {
          onSuccess?.(null as never);
          return true;
        }
      } else {
        throw new Error(response.error?.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`);
      return false;
    } finally {
      setSaving(false);
    }
    return false;
  };

  const createAnonymousUser = async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      const newCredentials = generateCredentials();

      const registerRes = await api.register({ body: newCredentials });
      if (registerRes.data) {
        return await login(newCredentials);
      } else {
        throw new Error(registerRes.error?.message || "Error al registrar usuario");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    login,
    createAnonymousUser,
    isAnonymous,
    setError,
  };
}
