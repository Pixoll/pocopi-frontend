import styles from "@/styles/TestPage/TimesUp.module.css";
import type { JSX } from "react";

type TimesUpProps = {
  goToNextPage: () => void;
};

export function TimesUp({ goToNextPage }: TimesUpProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h3>Se acabó el tiempo.</h3>

      <button type="button" className={styles.continue} onClick={goToNextPage}>
        Continuar
      </button>
    </div>
  );
}
