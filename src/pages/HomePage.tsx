import type { TrimmedConfig, UserTestAttempt } from "@/api";
import { ContinueAttemptModal } from "@/components/ContinueAttemptModal";
import { AdminButton } from "@/components/HomePage/AdminButton";
import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/HomePage.module.css";
import { type ChangeEvent, useState } from "react";

type HomePageProps = {
  config: TrimmedConfig;
  goToNextPage: (attempt: UserTestAttempt) => void;
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
  const { username } = useAuth();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const handleContinueAttempt = (attempt: UserTestAttempt) => {
    setShowContinueModal(false);
    goToNextPage(attempt);
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

  const handleLoginSuccess = () => {
    setConsentAccepted(false);
    setModalError(null);
  };

  return (
    <div className={styles.container}>
      {username && (
        <div className={styles.usernameBadge}>
          <span>👤 {username}</span>
        </div>
      )}

      <HomeHeader
        config={config}
        isDarkMode={isDarkMode}
        goToNextPage={goToNextPage}
        onAttemptInProgress={handleAttemptInProgress}
        onLoginSuccess={handleLoginSuccess}
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

      <AdminButton isDarkMode={isDarkMode} onAdmin={onAdmin}/>
      <DashboardButton config={config} isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      <ThemeSwitcher config={config}/>
    </div>
  );
}
