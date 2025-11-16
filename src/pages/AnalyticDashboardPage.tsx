import type { TrimmedConfig } from "@/api";
import { AnalyticsDashboard } from "@/components/DashboardPage/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type AnalyticDashboardPageProps = {
  config: TrimmedConfig;
  onBack: () => void;
};

function AnalyticDashboardPageContent({ config, onBack }: AnalyticDashboardPageProps) {
  const { token } = useAuth();

  return <AnalyticsDashboard config={config} onBack={onBack} adminToken={token!} />;
}

export default function AnalyticDashboardPage({ config, onBack }: AnalyticDashboardPageProps) {
  return (
    <ProtectedRoute config={config} requireAdmin={true}>
      <AnalyticDashboardPageContent config={config} onBack={onBack} />
    </ProtectedRoute>
  );
}
