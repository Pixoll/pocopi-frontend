import styles from "@/styles/TestGreetingPage/TestGreetingPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import Markdown from "react-markdown";

type TestInformationPageProps = {
  groupGreeting: string | undefined;
  onNext: () => void;
};

export function TestGreetingPage({ groupGreeting, onNext }: TestInformationPageProps) {
  useEffect(() => {
    if (!groupGreeting) {
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Test Information</h1>
        <Markdown>{groupGreeting}</Markdown>
        <button className={styles.button} onClick={onNext}>
          Start Test
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
}
