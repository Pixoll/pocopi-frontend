import { useState } from "react";
import type { TrimmedConfig } from "@/api";
import { LoginModal } from "@/components/HomePage/LoginModal";
import { AnalyticsDashboard } from "@/components/DashboardPage/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function AnalyticDashboardPage({ config, onBack }: { config: TrimmedConfig; onBack: () => void }) {
  const { token, isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(!isLoggedIn);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginModal
        config={config}
        show={showLogin}
        onHide={() => setShowLogin(false)}
        goToNextPage={handleLoginSuccess}
      />
    );
  }

  return <AnalyticsDashboard config={config} onBack={onBack} adminToken={token!} />;
}
