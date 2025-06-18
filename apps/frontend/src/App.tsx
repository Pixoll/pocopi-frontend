import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import { CompletionModal } from "@/pages/CompletionModal";
import { HomePage } from "@/pages/HomePage";
import { TestPage } from "@/pages/TestPage";
import { PreTestPage } from "@/pages/PreTestPage";
import { PostTestPage } from "@/pages/PosTestPage";
import { config } from "@pocopi/config";
import mime from "mime";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserData } from "./types/user";

enum Page {
  PRETEST,
  HOME,
  TEST,
  END,
  POSTTEST,
  DASHBOARD,
}

export function App() {
  const [group] = useState(config.sampleGroup());
  const [page, setPage] = useState<Page>(Page.PRETEST);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preTestAnswers, setPreTestAnswers] = useState<number[] | null>(null);
  const [postTestAnswers, setPostTestAnswers] = useState<number[] | null>(null);

  useEffect(() => {
    document.title = config.title;

    const head = document.querySelector("head")!;
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = mime.getType(config.icon.src)!;
    link.href = config.icon.src;
    head.appendChild(link);
  }, []);

  const handlePreTestSubmit = (answers: number[]) => {
    setPreTestAnswers(answers);
    setPage(Page.HOME);
  };

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

  const handlePostTestSubmit = (answers: number[]) => {
    setPostTestAnswers(answers);
    setPage(Page.DASHBOARD); // O puedes volver al HOME o mostrar un resumen final
  };

  const renderPage = () => {
    switch (page) {
      case Page.PRETEST:
        return <PreTestPage onSubmit={handlePreTestSubmit} />;
      case Page.HOME:
        return <HomePage groupLabel={group.label} onStartTest={startTest} onDashboard={goToDashboard}/>;
      case Page.TEST:
        return <TestPage group={group} goToNextPage={goToEndPage} userData={userData!}/>;
      case Page.END:
        return <CompletionModal userData={userData} onBackToHome={() => setPage(Page.POSTTEST)}/>;
      case Page.POSTTEST:
        return <PostTestPage onSubmit={handlePostTestSubmit} />;
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
