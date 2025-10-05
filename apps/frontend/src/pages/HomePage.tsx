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
  //goToNextPage,
  onDashboard,
}: HomePageProps) {
  const {
    showModal,
    consentAccepted,
    userData,
    handleOpenModal,
    handleCloseModal,
    handleConsentChange,
    //sendUserData,
  } = useUserData(group, config);
  const { isDarkMode } = useTheme();

  //deberia ser como: correct sign up + config.anonymous -> go to next page
  /*const startTest = () => {
    console.log("config.anonymous:", config.anonymous);
    console.log("consentAccepted:", consentAccepted);

    if (!consentAccepted) return;

    if (config.anonymous) {
      if (userData) {
        console.log("startTest:");
        sendUserData(userData, () => goToNextPage(userData));
      } else {
        console.warn("No hay datos de usuario para enviar en modo anónimo");
      }
    } else {
      handleOpenModal();
    }
  };*/

  const goToPreTest = () => {
    handleOpenModal();
  };
  /*
  * En vez de iniciar test -> Registrarse(todos los datos) (sign up)
  * Después pide si es anonimo o no,
  * Si es anonimo -> login(username y password),
  * Si no es anonimo pide todos los datos,
  *
  * */
  return (
    <div className={styles.container}>
      <HomeHeader config={config} isDarkMode={isDarkMode}/>

      <HomeInfoCard
        config={config}
        isDarkMode={isDarkMode}
        userData={userData}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        onRegister={goToPreTest}
      />

      <UserFormModal
        config={config}
        group={group}
        show={showModal}
        onHide={handleCloseModal}
      />

      <DashboardButton config={config} isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      <ThemeSwitcher config={config}/>
    </div>
  );
}
