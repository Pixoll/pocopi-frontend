import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/InformationCardEditor.module.css";
import type {EditablePatchInformationCard, ImageState} from "@/utils/imageCollector.ts";
import {useTheme} from "@/hooks/useTheme.ts";

type InformationCardEditorProps = {
  card: EditablePatchInformationCard;
  index: number;
  onChange: (card: EditablePatchInformationCard) => void;
  onRemove: () => void;
  readOnly:boolean;
}

export function InformationCardEditor({ card, index, onChange, onRemove, readOnly }: InformationCardEditorProps) {
  const {isDarkMode} = useTheme()

  return (
    <div className={`${styles.card} ${!isDarkMode ? styles.cardLight : ''}`}>
      <div className={`${styles.cardHeader} ${!isDarkMode ? styles.cardHeaderLight : ''}`}>
        <h4>Tarjeta {index + 1}</h4>
        <button onClick={onRemove} className={styles.removeButton} type="button">
          Eliminar
        </button>
      </div>
      <input
        type="text"
        placeholder="Título"
        value={card.title || ''}
        onChange={(e) => onChange({ ...card, title: e.target.value })}
        className={`${styles.input} ${!isDarkMode ? styles.inputLight : ''}`}
        disabled={readOnly}
      />
      <textarea
        placeholder="Descripción"
        value={card.description || ''}
        onChange={(e) => onChange({ ...card, description: e.target.value })}
        className={`${styles.textarea} ${!isDarkMode ? styles.textareaLight : ''}`}
        rows={3}
        disabled={readOnly}
      />
      <input
        type="number"
        placeholder="Color (número)"
        value={card.color || 0}
        onChange={(e) => onChange({ ...card, color: parseInt(e.target.value) || 0 })}
        className={`${styles.input} ${!isDarkMode ? styles.inputLight : ''}`}
        disabled={readOnly}
      />
      <ImageEditor
        image={card.icon}
        onChange={(imageState: ImageState) => onChange({ ...card, icon: imageState })}
        label="Icono"
      />
    </div>
  );
}
