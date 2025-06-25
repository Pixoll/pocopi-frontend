import styles from "@/styles/TestGreetingPage/TestGreetingPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useEffect } from "react";
import Markdown from "react-markdown";

type TestInformationPageProps = {
  groupGreeting: string | undefined;
  goToNextPage: () => void;
};

export function TestGreetingPage({ groupGreeting, goToNextPage }: TestInformationPageProps) {
  useEffect(() => {
    if (!groupGreeting) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {config.t("greeting.title")}
        </h1>
        <Markdown>{groupGreeting}</Markdown>
        <button className={styles.button} onClick={goToNextPage}>
          {config.t("greeting.startTest")}
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
}
