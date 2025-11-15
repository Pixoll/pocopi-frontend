import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/HomePage/LoginModal';
import type { TrimmedConfig } from '@/api';
import api from '@/api';

type ProtectedRouteProps = {
  children: React.ReactNode;
  config: TrimmedConfig;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ children, config, requireAdmin = false }: ProtectedRouteProps) {
  const { token, isLoggedIn, clearAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !isLoggedIn) {
        setShowLogin(true);
        setIsValidating(false);
        return;
      }

      try {
        const userResponse = await api.getCurrentUser({ auth: token });

        if (!userResponse || !userResponse.data) {
          console.error('Invalid user response');
          clearAuth();
          setShowLogin(true);
          setIsValidating(false);
          return;
        }

        if (requireAdmin) {
          try {
            const adminResponse = await api.getCurrentAdmin({ auth: token });

            if (!adminResponse || !adminResponse.data) {
              clearAuth();
              setShowLogin(true);
              setIsValidating(false);
              return;
            }
          } catch (error) {
            console.error(error);
            clearAuth();
            setShowLogin(true);
            setIsValidating(false);
            return;
          }
        }

        setShowLogin(false);
      } catch (error) {
        console.error('Auth validation failed:', error);
        clearAuth();
        setShowLogin(true);
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, [token, isLoggedIn, requireAdmin, clearAuth]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setIsValidating(false);
  };

  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div>Validando sesión...</div>
      </div>
    );
  }

  if (!isLoggedIn || showLogin) {
    return (
      <LoginModal
        config={config}
        show={true}
        onHide={() => {}}
        goToNextPage={handleLoginSuccess}
      />
    );
  }

  return <>{children}</>;
}
