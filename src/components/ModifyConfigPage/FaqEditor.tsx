import type { FrequentlyAskedQuestionUpdate } from "@/api";
import styles from "@/styles/ModifyConfigPage/FaqEditor.module.css";
import {useTheme} from "@/hooks/useTheme.ts";

type FaqEditorProps = {
  faq: FrequentlyAskedQuestionUpdate;
  index: number;
  onChange:  (faq: FrequentlyAskedQuestionUpdate) => void;
  onRemove: () => void;
  readOnly:  boolean;
}

export function FaqEditor({ faq, index, onChange, onRemove ,readOnly }: FaqEditorProps) {

  const {isDarkMode} = useTheme()

  return (
    <div className={`${styles.card} ${isDarkMode ? styles.cardDark : styles.cardLight}`}>
      <div className={`${styles.cardHeader} ${isDarkMode ? styles.cardHeaderDark : styles.cardHeaderLight}`}>
        <div className={styles.headerLeft}>
          <h4 className={isDarkMode ? styles.titleDark : styles.titleLight}>FAQ {index + 1}</h4>
        </div>
        <button
          onClick={onRemove}
          className={`${styles.removeButton} ${isDarkMode ? styles.removeButtonDark :  styles.removeButtonLight}`}
          title="Eliminar FAQ"
        >
          <span className={styles.removeIcon}>×</span>
        </button>
      </div>

      <div className={styles.faqContent}>
        <div className={styles.fieldGroup}>
          <label className={`${styles.label} ${isDarkMode ? styles.labelDark :  styles.labelLight}`}>
            <span className={styles.labelText}>Pregunta</span>
          </label>
          <input
            type="text"
            placeholder="¿Cuál es tu pregunta frecuente?"
            value={faq.question || ''}
            onChange={(e) => onChange({ ...faq, question: e.target. value })}
            className={`${styles.input} ${isDarkMode ? styles.inputDark :  styles.inputLight}`}
            disabled={readOnly}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={`${styles.label} ${isDarkMode ? styles.labelDark : styles.labelLight}`}>
            <span className={styles.labelText}>Respuesta</span>
          </label>
          <textarea
            placeholder="Escribe la respuesta detallada aquí..."
            value={faq.answer || ''}
            onChange={(e) => onChange({ ...faq, answer: e.target.value })}
            className={`${styles.textarea} ${isDarkMode ? styles.textareaDark : styles.textareaLight}`}
            rows={4}
            disabled={readOnly}
          />
          <div className={`${styles.charCount} ${isDarkMode ? styles.charCountDark : styles.charCountLight}`}>
            {(faq. answer || '').length} caracteres
          </div>
        </div>
      </div>
    </div>
  );
}
