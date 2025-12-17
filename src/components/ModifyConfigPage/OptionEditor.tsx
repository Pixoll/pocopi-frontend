import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/OptionEditor.module.css";
import type {EditablePatchOption, ImageState} from "@/utils/imageCollector.ts";
import {useTheme} from "@/hooks/useTheme.ts";

type OptionEditorProps = {
  option: EditablePatchOption;
  index: number;
  onChange: (option: EditablePatchOption) => void;
  onRemove: () => void;
}

export function OptionEditor({ option, index, onChange, onRemove }: OptionEditorProps) {
  const {isDarkMode} = useTheme();

  return (
    <div className={`${styles.optionItem} ${isDarkMode ? '' : styles.optionItemLight}`}>
      <div className={styles.optionHeader}>
        <span className={`${styles.optionTitle} ${isDarkMode ? '' : styles.optionTitleLight}`}>Opción {index + 1}</span>
        <div className={styles.headerActions}>
          <label className={`${styles.inlineCheckbox} ${isDarkMode ? '' : styles. inlineCheckboxLight}`}>
            <input
              type="checkbox"
              checked={option.correct}
              onChange={(e) => onChange({ ...option, correct: e.target.checked })}
            />
            <span className={`${styles.correctLabel} ${isDarkMode ? '' : styles.correctLabelLight}`}>Correcta</span>
          </label>
          <button
            onClick={onRemove}
            className={`${styles.smallRemoveButton} ${isDarkMode ? '' : styles.smallRemoveButtonLight}`}
            title="Eliminar opción"
            type="button"
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.optionContent}>
        <input
          type="text"
          placeholder="Texto de la opción"
          value={option. text || ''}
          onChange={(e) => onChange({ ...option, text: e.target.value })}
          className={`${styles.input} ${isDarkMode ?  '' : styles.inputLight}`}
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
