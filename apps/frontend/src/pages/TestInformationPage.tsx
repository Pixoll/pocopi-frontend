import styles from "@/styles/TestInformationPage/TestInformationPage.module.css";
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
    <div className={styles.testInformationPage}>
      <h1>Test Information</h1>
      <Markdown>{groupText}</Markdown>
      <button onClick={onNext}>Next</button>
    </div>
  );
}
