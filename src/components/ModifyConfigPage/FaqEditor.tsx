import type { FrequentlyAskedQuestionUpdate } from "@/api";
import styles from "@/styles/ModifyConfigPage/FaqEditor.module.css";

type FaqEditorProps = {
  faq: FrequentlyAskedQuestionUpdate;
  index: number;
  onChange: (faq: FrequentlyAskedQuestionUpdate) => void;
  onRemove: () => void;
}

export function FaqEditor({ faq, index, onChange, onRemove }: FaqEditorProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h4>FAQ {index + 1}</h4>
        </div>
        <button onClick={onRemove} className={styles.removeButton} title="Eliminar FAQ">
          <span className={styles.removeIcon}>×</span>
        </button>
      </div>

      <div className={styles.faqContent}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelText}>Pregunta</span>
          </label>
          <input
            type="text"
            placeholder="¿Cuál es tu pregunta frecuente?"
            value={faq.question || ''}
            onChange={(e) => onChange({ ...faq, question: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelText}>Respuesta</span>
          </label>
          <textarea
            placeholder="Escribe la respuesta detallada aquí..."
            value={faq.answer || ''}
            onChange={(e) => onChange({ ...faq, answer: e.target.value })}
            className={styles.textarea}
            rows={4}
          />
          <div className={styles.charCount}>
            {(faq.answer || '').length} caracteres
          </div>
        </div>
      </div>
    </div>
  );
}
