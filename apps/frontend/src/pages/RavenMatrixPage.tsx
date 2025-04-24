import { config } from "@pocopi/config";
import { useState } from "react";
import styles from "./RavenMatrixPage.module.css";

export function RavenMatrixPage() {
  const [selected, setSelected] = useState<string>("");

  // TODO should be props
  const { img, options: tempOptions } = config.protocols.control.phases[0];
  const options = tempOptions.map(option => {
    const base64 = option.src.split(";")[1].slice(7);
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);

    return { id, ...option };
  });
  const optionsColumns = Math.ceil(options.length / 2);
  const isOptionsOdd = options.length % 2 === 1;

  const handleRavenOptionClick = (id: string) => {
    return () => setSelected(v => v === id ? "" : id);
  };

  return (
    <div className={styles.ravenMatrixContainer} draggable={false}>
      <img className={styles.ravenMatrix} src={img.src} alt={img.alt} draggable={false}/>
      <div
        className={styles.ravenOptionsContainer}
        draggable={false}
        style={{ gridTemplateColumns: `repeat(${optionsColumns}, ${100 / optionsColumns}%)` }}
      >
        {options.map((option, i) => (
          <img
            className={[
              styles.ravenOption,
              isOptionsOdd && i % 2 === 1 ? styles.oddRavenOption : "",
              option.id === selected ? styles.selectedRavenOption : "",
            ].join(" ")}
            key={option.id}
            src={option.src}
            alt={option.alt}
            onClick={handleRavenOptionClick(option.id)}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
