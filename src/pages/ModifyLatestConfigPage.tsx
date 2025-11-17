import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModifyLatestConfig } from '@/components/ModifyConfigPage/ModifyLatestConfig';
import {useLocation, useParams} from 'react-router-dom';
import {type TrimmedConfig} from "@/api";

export default function ModifyLatestConfigPage({ config }: { config: TrimmedConfig }) {
  const {configVersion} = useParams();
  const location = useLocation();
  const { readOnly } = location.state || {};
  return (
    <ProtectedRoute config={config} requireAdmin={true}>
      <ModifyLatestConfig  configVersion={configVersion ? +configVersion : 0} readOnly={!!readOnly} />
    </ProtectedRoute>
  );
}