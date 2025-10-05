import type {CreateUserRequest, Group, SingleConfigResponse} from "@/api";
import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { UserFormModal } from "@/components/HomePage/UserFormModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { useUserData } from "@/hooks/useUserData";
import styles from "@/styles/HomePage/HomePage.module.css";

type HomePageProps = {
  group: Group;
  config: SingleConfigResponse;
  goToNextPage: (data: CreateUserRequest) => void;
  onDashboard: () => void;
};

export function HomePage({
  group,
  config,
  goToNextPage,
  onDashboard,
}: HomePageProps) {
  const {
    showModal,
    consentAccepted,
    userData,
    handleOpenModal,
    handleCloseModal,
    handleConsentChange,
    sendUserData,
  } = useUserData(group, config);
  const { isDarkMode } = useTheme();

  const startTest = () => {
    if (userData && consentAccepted) {
      if (config.anonymous) {
        sendUserData(userData, () => goToNextPage(userData));
      } else {
        goToNextPage(userData);
      }
    }
  };

  return (
    <div className={styles.container}>
      <HomeHeader config={config} isDarkMode={isDarkMode}/>

      <HomeInfoCard
        config={config}
        isDarkMode={isDarkMode}
        userData={userData}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        onStartTest={handleOpenModal}
        onBeginAssessment={startTest}
      />

      <UserFormModal
        config={config}
        group={group}
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={sendUserData}
      />

      <DashboardButton config={config} isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      <ThemeSwitcher/>
    </div>
  );
}
