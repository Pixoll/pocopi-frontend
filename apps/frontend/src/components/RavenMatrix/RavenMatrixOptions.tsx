// Componente para mostrar las opciones de respuesta de la pregunta actual

import styles from "@/styles/RavenMatrix/RavenMatrixOptions.module.css";
import { Image } from "@pocopi/config";
import classNames from "classnames";

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
      style={{ gridTemplateColumns: `repeat(${optionsColumns}, 1fr)` }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={classNames(
            styles.option,
            styles.cursorPointer,
            selected === option.id && styles.selectedOption
          )}
          onClick={() => onOptionClick(option.id)}
          tabIndex={0}
          role="button"
          aria-pressed={selected === option.id}
        >
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
