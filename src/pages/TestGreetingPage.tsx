import type { TrimmedConfig, UserTestAttempt } from "@/api";
import styles from "@/styles/TestGreetingPage/TestGreetingPage.module.css";
import { t } from "@/utils/translations.ts";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Markdown from "react-markdown";

type TestInformationPageProps = {
  config: TrimmedConfig;
  attempt: UserTestAttempt | null;
  goToNextPage: () => void;
};

export function TestGreetingPage({ config, attempt, goToNextPage }: TestInformationPageProps) {
  if (!attempt || !attempt.assignedGroup.greeting) {
    goToNextPage();
    return (
      <div>
        <p>Cargando test...</p>
      </div>
    );
  }

  if (attempt.completedTest) {
    goToNextPage();
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p>Test ya fue completado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {t(config, "greeting.title")}
        </h1>
        <Markdown>{attempt.assignedGroup.greeting}</Markdown>
        <button className={styles.button} onClick={goToNextPage}>
          {t(config, "greeting.startTest")}
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
}
