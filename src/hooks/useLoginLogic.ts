import api, { type Credentials } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function useLoginLogic() {
  const { setToken, setUsername, generateCredentials } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: Credentials): Promise<boolean> => {
    setSaving(true);
    setError(null);
    let success = false;

    try {
      const response = await api.login({ body: credentials });

      if (response.data) {
        const token = response.data.token;
        setToken(token);
        setUsername(credentials.username);
        success = true;
      } else {
        setError(response.error?.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`);
    } finally {
      setSaving(false);
    }

    return success;
  };

  const createAnonymousUser = async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    let success = false;

    try {
      const credentials = generateCredentials();

      const response = await api.register({ body: credentials });
      if (response.data) {
        const token = response.data.token;
        setToken(token);
        setUsername(credentials.username);
        success = true;
      } else {
        setError(response.error?.message || "Error al registrar usuario");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`);
    } finally {
      setSaving(false);
    }

    return success;
  };

  return {
    saving,
    error,
    login,
    createAnonymousUser,
  };
}
