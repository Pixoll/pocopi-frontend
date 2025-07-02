import type { User } from "@/api";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import { CompletionModal } from "@/pages/CompletionModal";
import { FormPage } from "@/pages/FormPage";
import { HomePage } from "@/pages/HomePage";
import { TestGreetingPage } from "@/pages/TestGreetingPage";
import { TestPage } from "@/pages/TestPage";
import { config } from "@pocopi/config";
import mime from "mime";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

enum Page {
  HOME,
  PRETEST,
  GREETING,
  TEST,
  POSTTEST,
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

  const goToPreTest = (data: User) => {
    window.scrollTo(0, 0);
    setUserData(data);
    setPage(Page.PRETEST);
  };

  const goToGreeting = () => {
    window.scrollTo(0, 0);
    setPage(Page.GREETING);
  };

  const goToTest = () => {
    window.scrollTo(0, 0);
    setPage(Page.TEST);
  };

  const goToPostTest = () => {
    window.scrollTo(0, 0);
    setPage(Page.POSTTEST);
  };

  const goToEnd = () => {
    window.scrollTo(0, 0);
    setPage(Page.END);
  };

  const goToHome = () => {
    window.scrollTo(0, 0);
    setPage(Page.HOME);
  };

  const goToDashboard = () => {
    window.scrollTo(0, 0);
    setPage(Page.DASHBOARD);
  };

  switch (page) {
    case Page.HOME:
      return <HomePage groupLabel={group.label} goToNextPage={goToPreTest} onDashboard={goToDashboard}/>;
    case Page.PRETEST:
      return <FormPage type="pre-test" userData={userData!} goToNextPage={goToGreeting}/>;
    case Page.GREETING:
      return <TestGreetingPage groupGreeting={group.greeting} goToNextPage={goToTest}/>;
    case Page.TEST:
      return <TestPage protocol={group.protocol} goToNextPage={goToPostTest} userData={userData!}/>;
    case Page.POSTTEST:
      return <FormPage type="post-test" userData={userData!} goToNextPage={goToEnd}/>;
    case Page.END:
      return <CompletionModal userData={userData!} onBackToHome={goToHome}/>;
    case Page.DASHBOARD:
      return <AnalyticsDashboard onBack={goToHome}/>;
  }
}
