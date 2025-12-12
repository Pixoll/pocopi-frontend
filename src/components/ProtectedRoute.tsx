import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/HomePage/LoginModal';
import type { TrimmedConfig } from '@/api';
import api from '@/api';
import { LoadingPage } from "@/pages/LoadingPage.tsx";
import styles from '@/styles/ProtectedRoute.module.css';

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
  const [showUnauthorized, setShowUnauthorized] = useState(false);

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
          const adminResponse = await api.getCurrentAdmin();

          if (!adminResponse || !adminResponse.data) {
            setShowUnauthorized(true);
            setIsValidating(false);
            setTimeout(() => {
              navigate('/');
            }, 3000);
            return;
          }
        }

        setShowLogin(false);
      } catch (error) {
        console.error('Auth validation failed:', error);

        if (requireAdmin) {
          setShowUnauthorized(true);
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          clearAuth();
          setShowLogin(true);
        }
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, [token, isLoggedIn, requireAdmin, clearAuth, navigate]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isValidating) {
    return <LoadingPage message="Validando sesión" />;
  }

  if (showUnauthorized) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <svg
              className={styles.iconSvg}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className={styles.title}>
            Acceso No Autorizado
          </h2>
          <p className={styles.message}>
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <p className={styles.redirectMessage}>
            Serás redirigido a la página principal en unos segundos...
          </p>
          <button
            onClick={() => navigate('/')}
            className={styles.button}
          >
            Ir al inicio ahora
          </button>
        </div>
      </div>
    );
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
