import { Option } from "@/hooks/useTest";
import styles from "@/styles/TestPage/TestOptions.module.css";

type TestOptionsProps = {
  options: readonly Option[];
  selected: string;
  onOptionClick: (id: string) => void;
  optionsColumns: number;
  isDarkMode: boolean;
};

export function TestOptions({
  options,
  selected,
  onOptionClick,
  optionsColumns,
  isDarkMode,
}: TestOptionsProps) {
  return (
    <div
      className={styles.testOptionsContainer}
      style={{ gridTemplateColumns: `repeat(${optionsColumns}, 1fr)` }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={[
            styles.option,
            selected === option.id ? styles.selectedOption : "",
          ].join(" ")}
          onClick={() => onOptionClick(option.id)}
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
              src={option.image.src}
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
