import api, { type TrimmedConfig, type UserTestAttempt } from "@/api";
import { AdminPage } from "@/pages/AdminPage";
import AnalyticDashboardPage from "@/pages/AnalyticDashboardPage.tsx";
import { CompletionModal } from "@/pages/CompletionModal";
import { FormPage } from "@/pages/FormPage";
import { HomePage } from "@/pages/HomePage";
import { LoadingPage } from "@/pages/LoadingPage";
import ModifyLatestConfigPage from "@/pages/ModifyLatestConfigPage.tsx";
import { TestGreetingPage } from "@/pages/TestGreetingPage";
import { TestPage } from "@/pages/TestPage";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<TrimmedConfig | null>(null);
  const [attempt, setAttempt] = useState<UserTestAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getConfig(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await api.getActiveConfigAsUser();
      if (response.data) {
        setConfig(response.data);
        document.title = response.data.title ?? "";
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const beforeUnload = (e: WindowEventMap["beforeunload"]) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  useEffect(() => {
    getConfig();
  }, []);

  const goToModifyConfigPage = (configVersion: number, readOnly: boolean) => {
    window.scrollTo(0, 0);
    navigate(`/modify-config/${configVersion.toString()}`, { state: { readOnly } });
  };

  const goToPreTest = (attempt: UserTestAttempt) => {
    setAttempt(attempt);
    window.scrollTo(0, 0);
    navigate("/pre-test");
  };

  const goToAdminPage = () => {
    window.scrollTo(0, 0);
    navigate("/admin");
  };

  const goToGreeting = () => {
    window.scrollTo(0, 0);
    navigate("/greeting");
  };

  const goToTest = () => {
    window.scrollTo(0, 0);
    navigate("/test");
  };

  const goToPostTest = () => {
    window.scrollTo(0, 0);
    navigate("/post-test");
  };

  const goToEnd = () => {
    window.scrollTo(0, 0);
    navigate("/end");
  };

  const goToHome = () => {
    window.scrollTo(0, 0);
    navigate("/");
  };

  const goToDashboard = () => {
    window.scrollTo(0, 0);
    navigate("/dashboard");
  };

  if (isLoading || !config) {
    return <LoadingPage message="Cargando configuración..."/>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            config={config}
            goToNextPage={goToPreTest}
            onDashboard={goToDashboard}
            onAdmin={goToAdminPage}
          />
        }
      />
      <Route
        path="/pre-test"
        element={<FormPage config={config} type="pre" attempt={attempt} goToNextPage={goToGreeting}/>}
      />
      <Route
        path="/greeting"
        element={<TestGreetingPage config={config} attempt={attempt} goToNextPage={goToTest}/>}
      />
      <Route
        path="/test"
        element={<TestPage config={config} attempt={attempt} goToNextPage={goToPostTest}/>}
      />
      <Route
        path="/post-test"
        element={<FormPage config={config} type="post" attempt={attempt} goToNextPage={goToEnd}/>}
      />
      <Route
        path="/end"
        element={<CompletionModal config={config} onBackToHome={goToHome} group={attempt?.assignedGroup}/>}
      />
      <Route
        path="/dashboard"
        element={<AnalyticDashboardPage config={config} onBack={goToHome}/>}
      />
      <Route
        path="/admin"
        element={<AdminPage goToModifyConfigPage={goToModifyConfigPage} config={config}/>}
      />
      <Route
        path="/modify-config/:configVersion"
        element={<ModifyLatestConfigPage config={config}/>}
      />
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}
