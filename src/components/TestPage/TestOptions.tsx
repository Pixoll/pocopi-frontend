import { type AssignedTestOption } from "@/api";
import { Markdown } from "@/components/Markdown";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestOptions.module.css";
import type { MouseEvent } from "react";

type TestOptionsProps = {
  options: readonly AssignedTestOption[];
  selected: number | null;
  onOptionClick: (id: number, x: number, y: number) => void;
  onOptionHover: (id: number, x: number, y: number) => void;
};

export function TestOptions({
  options,
  selected,
  onOptionClick,
  onOptionHover,
}: TestOptionsProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={styles.testOptionsContainer}
      style={{ gridTemplateColumns: `repeat(${Math.ceil(options.length / 2)}, 1fr)` }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={[
            styles.option,
            selected === option.id ? styles.selectedOption : "",
          ].join(" ")}
          onClick={(e) => onOptionClick(option.id, ...getNormalizedPos(e))}
          onMouseEnter={(e) => onOptionHover(option.id, ...getNormalizedPos(e))}
          tabIndex={0}
          role="button"
          aria-pressed={selected === option.id}
        >
          {option.text && (
            option.image ? (
              <div className={styles.optionTextWithImage}>
                <Markdown>
                  {option.text}
                </Markdown>
              </div>
            ) : (
              <div
                className={[
                  styles.optionText,
                  isDarkMode ? styles.optionTextDark : styles.optionTextLight,
                ].join(" ")}
              >
                <Markdown>
                  {option.text}
                </Markdown>
              </div>
            )
          )}
          {option.image && (
            <img
              src={option.image.url}
              alt={option.image.alt}
              className={styles.optionImage}
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getNormalizedPos(e: MouseEvent<HTMLDivElement>): [number, number] {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.max(Math.min(Math.ceil((e.clientX - rect.left) / rect.width * 100), 100), 0);
  const y = Math.max(Math.min(Math.ceil((e.clientY - rect.top) / rect.height * 100), 100), 0);
  return [x, y];
}
