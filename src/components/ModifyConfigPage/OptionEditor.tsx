
import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/OptionEditor.module.css";
import type {EditablePatchOption, ImageState} from "@/utils/imageCollector.ts";

type OptionEditorProps = {
  option: EditablePatchOption;
  index: number;
  onChange: (option: EditablePatchOption) => void;
  onRemove: () => void;
}

export function OptionEditor({ option, index, onChange, onRemove }: OptionEditorProps) {
  return (
    <div className={styles.optionItem}>
      <div className={styles.optionHeader}>
        <span className={styles.optionTitle}>Opción {index + 1}</span>
        <div className={styles.headerActions}>
          <label className={styles.inlineCheckbox}>
            <input
              type="checkbox"
              checked={option.correct}
              onChange={(e) => onChange({ ...option, correct: e.target.checked })}
            />
            <span className={styles.correctLabel}>Correcta</span>
          </label>
          <button onClick={onRemove} className={styles.smallRemoveButton} title="Eliminar opción" type="button">
            ×
          </button>
        </div>
      </div>

      <div className={styles.optionContent}>
        <input
          type="text"
          placeholder="Texto de la opción"
          value={option.text || ''}
          onChange={(e) => onChange({ ...option, text: e.target.value })}
          className={styles.input}
        />

        <ImageEditor
          image={option.image}
          onChange={(imageState: ImageState) => onChange({ ...option, image: imageState })}
          label=""
          compact={true}
        />
      </div>
    </div>
  );
}
