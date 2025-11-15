import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext.tsx';
import api from '@/api';

const TOKEN_CHECK_INTERVAL = 150000;

export function useTokenValidator() {
  const { token, clearAuth } = useAuth();
  const intervalRef = useRef<number | null>(null);

  const validateToken = useCallback(async () => {
    if (!token) return false;

    try {
      const response = await api.getCurrentUser({ auth: token });

      if (!response || !response.data) {
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      clearAuth();

      if (typeof window !== 'undefined') {
        window.location.reload();
      }

      return false;
    }
  }, [token, clearAuth]);

  useEffect(() => {
    if (!token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    validateToken();

    intervalRef.current = setInterval(validateToken, TOKEN_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, validateToken]);

  return { validateToken };
}
