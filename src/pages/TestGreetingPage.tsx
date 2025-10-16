import styles from "@/styles/TestGreetingPage/TestGreetingPage.module.css";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect } from "react";
import Markdown from "react-markdown";
import type {SingleConfigResponse} from "@/api";
import {t} from "@/utils/translations.ts";

type TestInformationPageProps = {
  config: SingleConfigResponse;
  groupGreeting: string | undefined;
  goToNextPage: () => void;
};

export function TestGreetingPage({config, groupGreeting, goToNextPage }: TestInformationPageProps) {
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
          {t(config, "greeting.title")}
        </h1>
        <Markdown>{groupGreeting}</Markdown>
        <button className={styles.button} onClick={goToNextPage}>
          {t(config, "greeting.startTest")}
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
}
