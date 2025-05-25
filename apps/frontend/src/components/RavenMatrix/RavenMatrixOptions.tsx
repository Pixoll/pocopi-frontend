// Componente para mostrar las opciones de respuesta de la pregunta actual

import styles from "@/styles/RavenMatrixOptions.module.css";
import { Image } from "@pocopi/config";

type Option = {
  id: string;
  text?: string;
  image?: Image;
};

type RavenMatrixOptionsProps = {
  options: Option[];
  selected: string;
  onOptionClick: (id: string) => void;
  optionsColumns: number;
  isDarkMode: boolean;
};

export function RavenMatrixOptions({
  options,
  selected,
  onOptionClick,
  optionsColumns,
}: RavenMatrixOptionsProps) {
  return (
    <div
      className={styles.ravenOptionsContainer}
      style={{
        gridTemplateColumns: `repeat(${optionsColumns}, ${
          100 / optionsColumns
        }%)`,
      }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={`rounded-3 p-2 mb-2 ${styles.cursorPointer} ${
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
          {/* TODO add text */}
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
