import api, {type AssignedTestGroup, type TrimmedConfig} from "@/api";
import {CompletionModal} from "@/pages/CompletionModal";
import {FormPage} from "@/pages/FormPage";
import {HomePage} from "@/pages/HomePage";
import {TestGreetingPage} from "@/pages/TestGreetingPage";
import {TestPage} from "@/pages/TestPage";
import {AdminPage} from "@/pages/AdminPage";
import {ModifyConfigPage} from "@/pages/ModifyConfigPage";
import {LoadingPage} from "@/pages/LoadingPage";
import { Routes, Route, useNavigate, Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AnalyticDashboardPage from "@/pages/AnalyticDashboardPage.tsx";
export function App() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<TrimmedConfig | null>(null);
  const [group, setGroup] = useState<AssignedTestGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getConfig(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await api.getLastestConfigAsUser();
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
    getConfig();
  }, []);

  const goToModifyConfigPage= ()=>{
    window.scrollTo(0, 0);
    navigate("/modify-config");
  }
  const goToPreTest = (group: AssignedTestGroup) => {
    setGroup(group);
    window.scrollTo(0, 0);
    navigate("/pre-test");
  };
  const goToAdminPage = () => {
    window.scrollTo(0, 0);
    navigate("/admin");
  }

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
    return <LoadingPage message="Cargando configuración..." />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage config={config} goToNextPage={goToPreTest} onDashboard={goToDashboard} onAdmin={goToAdminPage}/>}
        />
        <Route
          path="/pre-test"
          element={<FormPage config={config} type="pre-test" goToNextPage={goToGreeting} />}
        />
        <Route
          path="/greeting"
          element={<TestGreetingPage config={config} groupGreeting={group?.greeting} goToNextPage={goToTest} />}
        />
        <Route
          path="/test"
          element={<TestPage config={config} protocol={group} goToNextPage={goToPostTest} />}
        />
        <Route
          path="/post-test"
          element={<FormPage config={config} type="post-test"  goToNextPage={goToEnd} />}
        />
        <Route
          path="/end"
          element={<CompletionModal config={config}  onBackToHome={goToHome} group={group}/>}
        />
        <Route
          path="/dashboard"
          element={<AnalyticDashboardPage config={config} onBack={goToHome}/>}
        />
        <Route
          path="/admin"
          element={<AdminPage goToModifyConfigPage={goToModifyConfigPage} />}
        />
        <Route
          path="/modify-config"
          element={<ModifyConfigPage initialConfig={config} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}