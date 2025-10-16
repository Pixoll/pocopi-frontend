import styles from "@/styles/Spinner.module.css";

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "" }: SpinnerProps) {
  return <div className={[styles.spinner, className].join(" ")}/>;
}
