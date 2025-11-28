import api, { type Credentials, type FullConfig, type TrimmedConfig, type UserTestAttempt } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type LoginLogicOptions = {
  config: TrimmedConfig | FullConfig;
  onSuccess?: (attempt: UserTestAttempt) => void;
  onAttemptInProgress: () => void;
  stayOnPage?: boolean;
};

export function useLoginLogic({ config, onSuccess, onAttemptInProgress, stayOnPage = false }: LoginLogicOptions) {
  const { setToken, generateCredentials } = useAuth();
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

        if (stayOnPage) {
          onSuccess?.(null as never);
          return true;
        }

        const groupResponse = await api.beginTest();

        if (groupResponse.data) {
          onSuccess?.(groupResponse.data);
          return true;
        } else if (groupResponse.error) {
          if (groupResponse.error.code === 409) {
            console.log("hay un intento");
            onAttemptInProgress();
            return false;
          } else {
            throw new Error(groupResponse.error.message);
          }
        }
      } else {
        throw new Error(response.error?.message || "Error al iniciar sesión");
      }
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
