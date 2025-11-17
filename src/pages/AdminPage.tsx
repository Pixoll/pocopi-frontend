import styles from "@/styles/AdminPage/AdminPage.module.css";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api, { type TrimmedConfig, type ConfigPreview } from "@/api";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { LoadingPage } from "@/pages/LoadingPage.tsx";

type AdminPageProps = {
  goToModifyConfigPage: (configVersion: number, onlyRead: boolean) => void;
  token: string;
  config: TrimmedConfig;
}

async function getAllConfigs(set: (data: ConfigPreview[]) => void) {
  try {
    const response = await api.getAllConfigs();
    if (response) {
      set(response.data ?? []);
    }
  } catch (error) {
    console.log(error);
    set([]);
  }
}

function AdminPageContent({ goToModifyConfigPage, token }: Omit<AdminPageProps, 'config'>) {
  const [configs, setConfigs] = useState<ConfigPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        await getAllConfigs(setConfigs);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las configuraciones");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [token]);

  async function setAsLastVersion(version: number) {
    try {
      const response = await api.setConfigAsActive({ path: {version}})
      if(response){
        await getAllConfigs(setConfigs);
      }

    } catch (err) {
      console.error(err);
      setError("Error al establecer la versión");
    }
  }

  async function deleteConfig(version: number) {
    try {
      const response = await api.deleteConfig({ path: { version } });
      if (response) {
        await getAllConfigs(setConfigs);
      }
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la configuración");
    }
  }

  function configSection(configData: ConfigPreview) {
    const isActive = configData.active;

    return (
      <div className={isActive ? styles.lastConfigSection : styles.configSection} key={configData.version}>
        <div className={styles.infoContainer}>
          <div className={styles.versionHeader}>
            {configData.icon?.url && (
              <img
                src={configData.icon.url}
                alt={`Icon version ${configData.version}`}
                className={styles.configIcon}
              />
            )}
            <span className={styles.versionNumber}>Version {configData.version}</span>
            {isActive && <span className={styles.currentBadge}>Current</span>}
          </div>

          <div className={styles.contentInfo}>
            <h3 className={styles.title}>{configData.title || "Sin título"}</h3>
            {configData.subtitle && (
              <p className={styles.subtitle}>{configData.subtitle}</p>
            )}
            <p className={styles.description}>{configData.description || "Sin descripción"}</p>
          </div>
        </div>

        <div className={styles.buttonsContainer}>
          {isActive ? (
            <div className={styles.buttonWrapper}>
              <button onClick={() => goToModifyConfigPage(configData.version, isActive)} className={styles.modifyButton}>
                Modify
              </button>
              <span className={styles.buttonHint}>Edit current configuration</span>
            </div>
          ) : (
            <>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.setVersionButton}
                  onClick={() => setAsLastVersion(configData.version)}
                >
                  Set as active version
                </button>
                <span className={styles.buttonHint}>Make this the active config</span>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteConfig(configData.version)}
                  disabled={!configData.canDelete}
                >
                  Delete
                </button>
                <span className={styles.buttonHint}>
                  {configData.canDelete ? "Remove this version" : "Cannot delete this version"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingPage message="Cargando configuraciones..." />;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => getAllConfigs(setConfigs)}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Configuration panel</h1>
          <p className={styles.pageSubtitle}>Manage and version configurations</p>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Configuration panel</h1>
        <p className={styles.pageSubtitle}>Manage and version configurations</p>
      </header>

      <div className={styles.sectionsContainer}>
        {configs.map((config) => configSection(config))}
      </div>
    </div>
  );
}

export function AdminPage({ goToModifyConfigPage, config }: Omit<AdminPageProps, 'token'>) {
  const { token } = useAuth();
  return (
    <ProtectedRoute config={config} requireAdmin={true}>
      <AdminPageContent goToModifyConfigPage={goToModifyConfigPage} token={token!} />
    </ProtectedRoute>
  );
}
