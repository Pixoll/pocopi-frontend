import { useTheme } from "@/hooks/useTheme";
import {type TestOption } from "@/api";
import styles from "@/styles/TestPage/TestOptions.module.css";
// import type { TestOption } from "@pocopi/config";

type TestOptionsProps = {
  options: readonly TestOption[];
  selected: number | null;
  onOptionClick: (id: number) => void;
  onOptionHover: (id: number) => void;
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
          onClick={() => onOptionClick(option.id)}
          onMouseEnter={() => onOptionHover(option.id)}
          tabIndex={0}
          role="button"
          aria-pressed={selected === option.id}
        >
          {option.text && (
            option.image ? (
              <div className={styles.optionTextWithImage}>{option.text}</div>
            ) : (
              <div
                className={[
                  styles.optionText,
                  isDarkMode ? styles.optionTextDark : styles.optionTextLight,
                ].join(" ")}
              >
                {option.text}
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
