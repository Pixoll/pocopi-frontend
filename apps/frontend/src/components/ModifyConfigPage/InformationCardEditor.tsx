import type {InformationCard} from "@/api";
import {ImageEditor} from "@/components/ModifyConfigPage/ImageEditor.tsx";
import styles from "@/styles/ModifyConfigPage/InformationCardEditor.module.css";

type InformationCardEditorProps = {
  card: InformationCard;
  index: number;
  onChange: (card: InformationCard) => void;
  onRemove: () => void;
}

export function InformationCardEditor({card, index, onChange, onRemove}: InformationCardEditorProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4>Tarjeta {index + 1}</h4>
        <button onClick={onRemove} className={styles.removeButton}>
          Eliminar
        </button>
      </div>
      <input
        type="text"
        placeholder="Título"
        value={card.title || ''}
        onChange={(e) => onChange({...card, title: e.target.value})}
        className={styles.input}
      />
      <textarea
        placeholder="Descripción"
        value={card.description || ''}
        onChange={(e) => onChange({...card, description: e.target.value})}
        className={styles.textarea}
      />
      <input
        type="number"
        placeholder="Color (número)"
        value={card.color || 0}
        onChange={(e) => onChange({...card, color: parseInt(e.target.value) || 0})}
        className={styles.input}
      />
      <ImageEditor
        image={card.icon}
        onChange={(icon) => onChange({...card, icon})}
        label="Icono"
      />
    </div>
  )
}