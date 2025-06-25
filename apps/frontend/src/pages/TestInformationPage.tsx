import styles from "@/styles/TestInformationPage/TestInformationPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import Markdown from "react-markdown";

type TestInformationPageProps = {
  groupText: string | undefined;
  onNext: () => void;
};

export function TestInformationPage({ groupText, onNext }: TestInformationPageProps) {
  useEffect(() => {
    if (!groupText) {
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Test Information</h1>
        <Markdown>{groupText}</Markdown>
        <button className={styles.button} onClick={onNext}>
          Start Test
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
}
