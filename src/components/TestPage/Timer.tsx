import { type JSX, useEffect, useState } from "react";

type TimerProps = {
  className?: string;
  timeLimit: number;
  onEnd: () => void;
};

export function Timer({ className, timeLimit, onEnd }: TimerProps): JSX.Element {
  const [, setTimer] = useState(0);
  const remaining = Math.trunc(Math.max(timeLimit - Date.now(), 0) / 1000);
  const secondsString = (remaining % 60).toString().padStart(2, "0");
  const minutesString = (Math.trunc(remaining / 60) % 60).toString().padStart(2, "0");
  const hours = Math.trunc(remaining / 3600);
  const hoursString = hours ? hours.toString().padStart(2, "0") + ":" : "";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
      if (remaining === 0) {
        clearInterval(interval);
        onEnd();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  return (
    <span className={className}>
      {hoursString}{minutesString}:{secondsString}
    </span>
  );
}
