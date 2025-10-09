import type {Faq} from "@/api";
import styles from "@/styles/ModifyConfigPage/FaqEditor.module.css";

type FaqEditorProps = {
  faq: Faq;
  index: number;
  onChange: (faq: Faq) => void;
  onRemove: () => void;
}

export function FaqEditor({faq, index, onChange, onRemove}:FaqEditorProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4>FAQ {index + 1}</h4>
        <button onClick={onRemove} className={styles.removeButton}>
          Eliminar
        </button>
      </div>
      <input
        type="text"
        placeholder="Pregunta"
        value={faq.question || ''}
        onChange={(e) => onChange({...faq, question: e.target.value})}
        className={styles.input}
      />
      <textarea
        placeholder="Respuesta"
        value={faq.answer || ''}
        onChange={(e) => onChange({...faq, answer: e.target.value})}
        className={styles.textarea}
      />
    </div>
  )
}