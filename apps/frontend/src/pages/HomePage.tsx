import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { UserFormModal } from "@/components/HomePage/UserFormModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { useUserData } from "@/hooks/useUserData";
import styles from "@/styles/HomePage/HomePage.module.css";
import { UserData } from "@/types/user";
import { config } from "@pocopi/config";

type HomePageProps = {
  groupLabel: string;
  onStartTest: (data: UserData) => void;
  onDashboard: () => void;
};

export function HomePage({
  groupLabel,
  onStartTest,
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
  } = useUserData(groupLabel);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const startTest = () => {
    if (userData && consentAccepted) {
      if (config.anonymous) {
        sendUserData(userData);
      }
      onStartTest(userData);
    }
  };

  return (
    <div className={styles.container}>
      <HomeHeader isDarkMode={isDarkMode}/>

      <HomeInfoCard
        isDarkMode={isDarkMode}
        userData={userData}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        onStartTest={handleOpenModal}
        onBeginAssessment={startTest}
      />

      <UserFormModal
        groupLabel={groupLabel}
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={sendUserData}
      />

      <DashboardButton isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      <ThemeSwitcher/>
    </div>
  );
}
