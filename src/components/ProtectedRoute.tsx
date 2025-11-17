import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/HomePage/LoginModal';
import type { TrimmedConfig } from '@/api';
import api from '@/api';
import {LoadingPage} from "@/pages/LoadingPage.tsx";

type ProtectedRouteProps = {
  children: React.ReactNode;
  config: TrimmedConfig;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ children, config, requireAdmin = false }: ProtectedRouteProps) {
  const { token, isLoggedIn, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !isLoggedIn) {
        setShowLogin(true);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);

      try {
        const userResponse = await api.getCurrentUser();

        if (!userResponse || !userResponse.data) {
          console.error('Invalid user response');
          clearAuth();
          setShowLogin(true);
          setIsValidating(false);
          return;
        }

        if (requireAdmin) {
          try {
            const adminResponse = await api.getCurrentAdmin();

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
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isValidating) {
    return ( <LoadingPage message="Validando sesión" />);
  }

  if (!isLoggedIn || showLogin) {
    return (
      <LoginModal
        config={config}
        show={true}
        onHide={handleLoginSuccess}
        onCancel={handleCancel}
        goToNextPage={handleLoginSuccess}
      />
    );
  }

  return <>{children}</>;
}
