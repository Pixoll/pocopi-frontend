import styles from "@/styles/AdminPage/AdminPage.module.css";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api, { type TrimmedConfig, type ConfigPreview } from "@/api";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { ConfigSection } from "@/components/AdminPage/ConfigSection";
import { LoadingPage } from "@/pages/LoadingPage.tsx";
import AdminAccountsSection from "@/components/AdminPage/AdminAccountsSection.tsx";

type AdminPageProps = {
  goToModifyConfigPage: (configVersion: number, onlyRead: boolean) => void;
  token: string;
  config: TrimmedConfig;
}

type TabType = 'configurations' | 'Administrators';

async function getAllConfigs(set: (data: ConfigPreview[]) => void) {
  try {
    const response = await api.getAllConfigs();
    if (response) {
      const sorted = response. data?.sort((a, b) => {
        if (a. active) return -1;
        if (b.active) return 1;
        return b.version - a.version;
      }) ?? [];

      set(sorted);
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
  const [activeTab, setActiveTab] = useState<TabType>('configurations');

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        await getAllConfigs(setConfigs);
      } catch (err) {
        console. error(err);
        setError("Error al cargar las configuraciones");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [token]);

  async function setAsLastVersion(version: number) {
    try {
      const response = await api.setConfigAsActive({ path: { version } })
      if (response) {
        await getAllConfigs(setConfigs);
      }
    } catch (err) {
      console.error(err);
      setError("Error al establecer la versión");
    }
  }

  async function cloneConfigByVersion(version: number) {
    try {
      setLoading(true);
      const response = await api.cloneConfigByVersion({ path: { version } })
      if (response) {
        await getAllConfigs(setConfigs);
      }
    } catch (e) {
      console. error(e);
      setError("Error al duplicar la configuración");
    } finally {
      setLoading(false);
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
        <header className={styles. pageHeader}>
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
        <p className={styles. pageSubtitle}>Manage and version configurations</p>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles. tab} ${activeTab === 'configurations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('configurations')}
        >
          Configurations
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Administrators' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Administrators')}
        >
          Administrators
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'configurations' && (
          <section className={styles.mainSection}>
            <div className={styles.sectionsContainer}>
              {configs.map((config) => (
                <ConfigSection
                  key={config.version}
                  configData={config}
                  onModify={goToModifyConfigPage}
                  onSetActive={setAsLastVersion}
                  onClone={cloneConfigByVersion}
                  onDelete={deleteConfig}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Administrators' && (
          <section className={styles.mainSection}>
            <div className={styles.emptySection}>
              <AdminAccountsSection />
            </div>
          </section>
        )}
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
