import styles from "@/styles/AdminPage/AdminPage.module.css";
import type { ConfigPreview } from "@/api";
import Markdown from "react-markdown";

type ConfigSectionProps = {
  configData: ConfigPreview;
  onModify: (version: number, readOnly: boolean) => void;
  onSetActive: (version: number) => void;
  onClone: (version: number) => void;
  onDelete: (version: number) => void;
};

export function ConfigSection({
                                configData,
                                onModify,
                                onSetActive,
                                onClone,
                                onDelete
                              }: ConfigSectionProps) {
  const isActive = configData.active;

  return (
    <div className={isActive ? styles.lastConfigSection : styles.configSection}>
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
          <h3 className={styles.title}>{configData. title || "Sin título"}</h3>
          {configData. subtitle && (
            <p className={styles.subtitle}>{configData.subtitle}</p>
          )}
          <div className={styles. description}>
            <Markdown>{configData.description || "Sin descripción"}</Markdown>
          </div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        {isActive ? (
          <div className={styles.buttonWrapper}>
            <button
              onClick={() => onModify(configData.version, false)}
              className={styles.modifyButton}
            >
              Modify
            </button>
            <span className={styles.buttonHint}>Edit current configuration</span>
          </div>
        ) : (
          <>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.setVersionButton}
                onClick={() => onSetActive(configData.version)}
              >
                Set as active version
              </button>
              <span className={styles.buttonHint}>Make this the active config</span>

              <button
                className={styles.setVersionButton}
                onClick={() => onModify(configData.version, true)}
              >
                View version
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.cloneButton}
                onClick={() => onClone(configData.version)}
              >
                Duplicate
              </button>
              <span className={styles.buttonHint}>Create a copy of this version</span>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(configData.version)}
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
