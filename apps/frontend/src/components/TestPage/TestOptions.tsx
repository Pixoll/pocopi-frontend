import { Option } from "@/hooks/useTest";
import styles from "@/styles/TestOptions.module.css";

type TestOptionsProps = {
  options: Option[];
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
      style={{
        gridTemplateColumns: `repeat(${optionsColumns}, ${100 / optionsColumns}%)`,
      }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={`text-center rounded-3 p-2 mb-2 ${styles.cursorPointer} ${
            selected === option.id ? styles.selectedOption : ""
          }`}
          style={{
            border:
              selected === option.id
                ? `2px solid #ffc107`
                : `2px solid transparent`,
          }}
          onClick={() => onOptionClick(option.id)}
          tabIndex={0}
          role="button"
          aria-pressed={selected === option.id}
        >
          {option.text && (
            option.image ? (
              <div className="mb-2">{option.text}</div>
            ) : (
              <div
                className={`pt-4 pb-4 ps-5 pe-5 rounded-3 ${
                  isDarkMode ? "bg-body-tertiary" : "bg-body-secondary"
                }`}
              >
                {option.text}
              </div>
            )
          )}
          {option.image && (
            <img
              src={option.image.src}
              alt={option.image.alt}
              className="img-fluid"
              style={{ maxWidth: "100px", pointerEvents: "none" }}
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}
