import type { User } from "@/api";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import { CompletionModal } from "@/pages/CompletionModal";
import { HomePage } from "@/pages/HomePage";
import { TestInformationPage } from "@/pages/TestInformationPage";
import { TestPage } from "@/pages/TestPage";
import { config } from "@pocopi/config";
import mime from "mime";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

enum Page {
  HOME,
  INFORMATION,
  TEST,
  END,
  DASHBOARD,
}

export function App() {
  const [group] = useState(config.sampleGroup());
  const [page, setPage] = useState<Page>(Page.HOME);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    document.title = config.title;

    const head = document.querySelector("head")!;
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = mime.getType(config.icon.src)!;
    link.href = config.icon.src;
    head.appendChild(link);
  }, []);

  const goToInformation = (data: User) => {
    setUserData(data);
    setPage(Page.INFORMATION);
  };

  const goToTest = () => {
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
        return <HomePage groupLabel={group.label} onNext={goToInformation} onDashboard={goToDashboard}/>;
      case Page.INFORMATION:
        return <TestInformationPage groupText={group.text} onNext={goToTest}/>;
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
