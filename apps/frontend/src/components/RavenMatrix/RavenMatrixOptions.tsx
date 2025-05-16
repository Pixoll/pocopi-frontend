// Componente para mostrar las opciones de respuesta de la pregunta actual

import styles from "@/pages/RavenMatrixPage.module.css";

interface Option {
  id: string;
  src: string;
  alt: string;
}

interface RavenMatrixOptionsProps {
  options: Option[];
  selected: string;
  onOptionClick: (id: string) => void;
  optionsColumns: number;
  isDarkMode: boolean;
}

const RavenMatrixOptions = ({
  options,
  selected,
  onOptionClick,
  optionsColumns,
}: RavenMatrixOptionsProps) => (
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
        className={`rounded-3 p-2 mb-2 cursor-pointer ${
          selected === option.id ? "selected-option" : ""
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
        <img
          src={option.src}
          alt={option.alt}
          className="img-fluid"
          style={{ maxWidth: "100px", pointerEvents: "none" }}
          draggable={false}
        />
      </div>
    ))}
  </div>
);

export default RavenMatrixOptions;
