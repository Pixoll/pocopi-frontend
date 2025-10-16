import api, {type CreateUserRequest, type SingleConfigResponse, type Group} from "@/api";
import {AnalyticsDashboard} from "@/pages/AnalyticsDashboard";
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
import Decimal from "decimal.js";

function sampleGroup(config: SingleConfigResponse): Group {
  const groupsArray = Object.values(config.groups);
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0]!;
  const targetProbability = new Decimal("0." + randomValue.toString().split("").reverse().join(""));

  const probabilitySums: Decimal[] = [];
  let lastProbability = new Decimal(0);

  for (const group of groupsArray) {
    const prob = new Decimal(group.probability ?? 0).div(100);
    lastProbability = lastProbability.add(prob);
    probabilitySums.push(lastProbability);
  }

  let left = 0;
  let right = probabilitySums.length - 1;
  let index = 0;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const value = probabilitySums[mid]!;

    if (value.greaterThan(targetProbability)) {
      index = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return groupsArray[index]!;
}

export function App() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<SingleConfigResponse | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [userData, setUserData] = useState<CreateUserRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getConfig(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await api.getLastestConfig();
      if (response.data) {
        setConfig(response.data);
        setGroup(sampleGroup(response.data));
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

  const goToPreTest = (data: CreateUserRequest) => {
    window.scrollTo(0, 0);
    setUserData(data);
    navigate("/pretest");
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
    navigate("/posttest");
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

  if (isLoading || !group || !config) {
    return <LoadingPage message="Cargando configuración..." />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage group={group} config={config} goToNextPage={goToPreTest} onDashboard={goToDashboard} onAdmin={goToAdminPage}/>}
        />
        <Route
          path="/pretest"
          element={<FormPage config={config} type="pre-test" username={userData?.username ?? ""} goToNextPage={goToGreeting} />}
        />
        <Route
          path="/greeting"
          element={<TestGreetingPage config={config} groupGreeting={group.greeting} goToNextPage={goToTest} />}
        />
        <Route
          path="/test"
          element={<TestPage config={config} protocol={group.protocol} goToNextPage={goToPostTest} userData={userData!} />}
        />
        <Route
          path="/posttest"
          element={<FormPage config={config} type="post-test" username={userData?.username ?? ""} goToNextPage={goToEnd} />}
        />
        <Route
          path="/end"
          element={<CompletionModal config={config} userData={userData!} onBackToHome={goToHome} />}
        />
        <Route
          path="/dashboard"
          element={<AnalyticsDashboard config={config} onBack={goToHome}/>}
        />
        <Route
          path="/admin"
          element={<AdminPage />}
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