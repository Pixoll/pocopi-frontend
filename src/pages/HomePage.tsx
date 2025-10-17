import type {NewUser, Group, SingleConfigResponse} from "@/api";
import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { UserFormModal } from "@/components/HomePage/UserFormModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { useUserData } from "@/hooks/useUserData";
import styles from "@/styles/HomePage/HomePage.module.css";
import {AdminButton} from "@/components/HomePage/AdminButton.tsx";

type HomePageProps = {
  group: Group;
  config: SingleConfigResponse;
  goToNextPage: (data: NewUser) => void;
  onDashboard: () => void;
  onAdmin: () => void;
};

export function HomePage({
  config,
  goToNextPage,
  onDashboard,
  onAdmin,
}: HomePageProps) {
  const {
    showModal,
    consentAccepted,
    userData,
    handleOpenModal,
    handleCloseModal,
    handleConsentChange,
  } = useUserData(config);
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.container}>
      <HomeHeader config={config} isDarkMode={isDarkMode}/>

      <HomeInfoCard
        config={config}
        isDarkMode={isDarkMode}
        userData={userData}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        onRegister={handleOpenModal}
      />

      <UserFormModal
        config={config}
        show={showModal}
        onHide={handleCloseModal}
        goToNextPage={goToNextPage}
      />

      <AdminButton isDarkMode={isDarkMode} onAdmin={onAdmin}/>
      <DashboardButton config={config} isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      <ThemeSwitcher config={config}/>
    </div>
  );
}
