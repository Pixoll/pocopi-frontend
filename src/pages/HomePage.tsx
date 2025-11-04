import { useState } from "react";
import type { AssignedTestGroup, TrimmedConfig } from "@/api";
import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { ContinueAttemptModal } from "@/components/ContinueAttemptModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AdminButton } from "@/components/HomePage/AdminButton";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/HomePage.module.css";

type HomePageProps = {
  config: TrimmedConfig;
  goToNextPage: (group: AssignedTestGroup) => void;
  onDashboard: () => void;
  onAdmin: () => void;
};

export function HomePage({
                           config,
                           goToNextPage,
                           onDashboard,
                           onAdmin,
                         }: HomePageProps) {
  const { isDarkMode } = useTheme();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const handleContinueAttempt = (group: AssignedTestGroup) => {
    setShowContinueModal(false);
    goToNextPage(group);
  };

  const handleDiscardAttempt = () => {
    setShowContinueModal(false);
    setConsentAccepted(false);
  };

  const handleModalError = (error: string) => {
    setModalError(error);
    setTimeout(() => setModalError(null), 5000);
  };

  const handleAttemptInProgress = () => {
    setShowContinueModal(true);
  };

  return (
    <div className={styles.container}>
      <HomeHeader
        config={config}
        isDarkMode={isDarkMode}
        goToNextPage={goToNextPage}
        onAttemptInProgress={handleAttemptInProgress}
      />

      {modalError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {modalError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setModalError(null)}
            aria-label="Close"
          />
        </div>
      )}

      <HomeInfoCard
        config={config}
        isDarkMode={isDarkMode}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        goToNextPage={goToNextPage}
        onAttemptInProgress={handleAttemptInProgress}
      />

      <ContinueAttemptModal
        show={showContinueModal}
        onContinue={handleContinueAttempt}
        onDiscard={handleDiscardAttempt}
        onError={handleModalError}
      />

      <AdminButton isDarkMode={isDarkMode} onAdmin={onAdmin} />
      <DashboardButton config={config} isDarkMode={isDarkMode} onDashboard={onDashboard} />

      <ThemeSwitcher config={config} />
    </div>
  );
}
