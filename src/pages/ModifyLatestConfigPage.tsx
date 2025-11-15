import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { ModifyLatestConfig } from '@/components/ModifyConfigPage/ModifyLatestConfig';
import type { TrimmedConfig } from '@/api';

export default function ModifyLatestConfigPage({ config }: { config: TrimmedConfig }) {
  const { token } = useAuth();

  return (
    <ProtectedRoute config={config} requireAdmin={true}>
      <ModifyLatestConfig token={token!} />
    </ProtectedRoute>
  );
}