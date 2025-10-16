
import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/InformationCardEditor.module.css";
import type {EditablePatchInformationCard, ImageState} from "@/utils/imageCollector.ts";

type InformationCardEditorProps = {
  card: EditablePatchInformationCard;
  index: number;
  onChange: (card: EditablePatchInformationCard) => void;
  onRemove: () => void;
}

export function InformationCardEditor({ card, index, onChange, onRemove }: InformationCardEditorProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
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
        className={styles.input}
      />
      <textarea
        placeholder="Descripción"
        value={card.description || ''}
        onChange={(e) => onChange({ ...card, description: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
      <input
        type="number"
        placeholder="Color (número)"
        value={card.color || 0}
        onChange={(e) => onChange({ ...card, color: parseInt(e.target.value) || 0 })}
        className={styles.input}
      />
      <ImageEditor
        image={card.icon}
        onChange={(imageState: ImageState) => onChange({ ...card, icon: imageState })}
        label="Icono"
      />
    </div>
  );
}
