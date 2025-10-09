import type {Option} from "@/api";
import {ImageEditor} from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/OptionEditor.module.css";

type OptionEditorProps = {
  option: Option;
  index: number;
  onChange: (option: Option) => void;
  onRemove: () => void;
}

export function OptionEditor({ option, index, onChange, onRemove }:OptionEditorProps){
  return (
    <div className={styles.optionItem}>
      <div className={styles.optionHeader}>
        <span>Opción {index + 1}</span>
        <button onClick={onRemove} className={styles.smallRemoveButton}>
          ×
        </button>
      </div>
      <input
        type="text"
        placeholder="Texto de la opción"
        value={option.text || ''}
        onChange={(e) => onChange({ ...option, text: e.target.value })}
        className={styles.input}
      />
      <ImageEditor
        image={option.image}
        onChange={(image) => onChange({ ...option, image })}
        label="Imagen de la opción"
      />
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={option.correct}
          onChange={(e) => onChange({ ...option, correct: e.target.checked })}
        />
        Respuesta correcta
      </label>
    </div>
  )
}