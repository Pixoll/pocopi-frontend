import styles from "@/styles/AdminPage/AdminPage.module.css";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { TrimmedConfig } from "@/api";

type AdminPageProps = {
  goToModifyConfigPage: () => void;
  config: TrimmedConfig;
}

function AdminPageContent({ goToModifyConfigPage }: Omit<AdminPageProps, 'config'>) {
  const [Ids, setIds] = useState([1, 2, 3, 4, 5]);
  const [max, setMax] = useState(5);

  const orderConfigs = [...Ids].sort((a, b) => b - a);

  function setAsLastVersion(id: number) {
    const newIds = Ids.filter(existingId => existingId !== id);
    const newMaxId = max + 1;
    setIds([...newIds, newMaxId]);
    setMax(newMaxId);
  }

  function configSection(id: number, isLast: boolean) {
    return (
      <div className={isLast ? styles.lastConfigSection : styles.configSection} key={id}>
        <div className={styles.infoContainer}>
          <div className={styles.versionHeader}>
            <span className={styles.versionNumber}>Version {id}</span>
            {isLast && <span className={styles.currentBadge}>Current</span>}
          </div>

          <div className={styles.contentInfo}>
            <h3 className={styles.title}>Title</h3>
            <p className={styles.subtitle}>Subtitle</p>
            <p className={styles.description}>Description</p>
          </div>
        </div>

        <div className={styles.buttonsContainer}>
          {isLast ? (
            <div className={styles.buttonWrapper}>
              <button onClick={goToModifyConfigPage} className={styles.modifyButton}>
                Modify
              </button>
              <span className={styles.buttonHint}>Edit current configuration</span>
            </div>
          ) : (
            <>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.setVersionButton}
                  onClick={() => setAsLastVersion(id)}
                >
                  Set as last version
                </button>
                <span className={styles.buttonHint}>Make this the active config</span>
              </div>
              <div className={styles.buttonWrapper}>
                <button className={styles.deleteButton}>
                  Delete
                </button>
                <span className={styles.buttonHint}>Remove this version</span>
              </div>
            </>
          )}
        </div>
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
        {orderConfigs.map((id) => configSection(id, id === max))}
      </div>
    </div>
  );
}

export function AdminPage({ goToModifyConfigPage, config }: AdminPageProps) {
  return (
    <ProtectedRoute config={config} requireAdmin={true}>
      <AdminPageContent goToModifyConfigPage={goToModifyConfigPage} />
    </ProtectedRoute>
  );
}
