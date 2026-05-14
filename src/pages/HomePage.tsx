import type { TrimmedConfig, UserTestAttempt } from "@/api";
import { ContinueAttemptModal } from "@/components/ContinueAttemptModal";
import { AdminButton } from "@/components/HomePage/AdminButton";
import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/HomePage.module.css";
import { type ChangeEvent, useState } from "react";
import UserLogout from "@/components/UserLogout.tsx";

type HomePageProps = {
  config: TrimmedConfig;
  onStartTest: (attempt: UserTestAttempt) => void;
  onDashboard: () => void;
  onAdmin: () => void;
};

export function HomePage({
  config,
  onStartTest,
  onDashboard,
  onAdmin,
}: HomePageProps) {
  const { isDarkMode } = useTheme();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const handleContinueAttempt = (attempt: UserTestAttempt) => {
    setShowContinueModal(false);
    onStartTest(attempt);
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
      <UserLogout/>
      <HomeHeader config={config} isDarkMode={isDarkMode}/>

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
        onStartTest={onStartTest}
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
