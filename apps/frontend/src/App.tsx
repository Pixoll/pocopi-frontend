import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import { CompletionModal } from "@/pages/CompletionModal";
import { HomePage } from "@/pages/HomePage";
import { TestPage } from "@/pages/TestPage";
import { config } from "@pocopi/config";
import mime from "mime";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { UserData } from "./types/user";

enum Page {
  HOME,
  TEST,
  END,
  DASHBOARD,
}

export function App() {
  const [group] = useState(config.sampleGroup());
  const [page, setPage] = useState<Page>(Page.HOME);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    document.title = config.title;

    const head = document.querySelector("head")!;
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = mime.getType(config.icon.src)!;
    link.href = config.icon.src;
    head.appendChild(link);
  }, []);

  const startTest = (data: UserData) => {
    setUserData(data);
    setPage(Page.TEST);
  };

  const goToHome = () => {
    setPage(Page.HOME);
  };

  const goToDashboard = () => {
    setPage(Page.DASHBOARD);
  };

  const goToEndPage = () => {
    setPage(Page.END);
  };

  // routeless pages
  const renderPage = () => {
    switch (page) {
      case Page.HOME:
        return <HomePage groupLabel={group.label} onStartTest={startTest} onDashboard={goToDashboard}/>;
      case Page.TEST:
        return <TestPage group={group} goToNextPage={goToEndPage} userData={userData!}/>;
      case Page.END:
        return <CompletionModal userData={userData!} onBackToHome={goToHome}/>;
      case Page.DASHBOARD:
        return <AnalyticsDashboard onBack={goToHome}/>;
    }
  };

  return (
    <ThemeProvider>
      {renderPage()}
    </ThemeProvider>
  );
}
