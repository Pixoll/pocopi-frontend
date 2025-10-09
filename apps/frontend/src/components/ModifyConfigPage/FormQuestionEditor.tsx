import type {SelectMultiple, SelectOne, Slider, TextLong, TextShort} from "@/api";
import styles from "@/styles/ModifyConfigPage/FormQuestionEditor.module.css";

type FormQuestionEditorProps = {
  question: SelectMultiple | SelectOne | Slider | TextLong | TextShort;
  index: number;
  onChange: (question: unknown) => void;
  onRemove: () => void;
}

export function FormQuestionEditor({ question, index, onChange, onRemove }: FormQuestionEditorProps) {

  const renderTypeSpecificFields = () => {
    switch (question.type) {
      case 'select-multiple': {
        const smq = question as SelectMultiple;
        return (
          <>
            <input
              type="number"
              placeholder="Mínimo"
              value={smq.min || 0}
              onChange={(e) => onChange({ ...question, min: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Máximo"
              value={smq.max || 0}
              onChange={(e) => onChange({ ...question, max: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={smq.other}
                onChange={(e) => onChange({ ...question, other: e.target.checked })}
              />
              Permitir "Otro"
            </label>
          </>
        );
      }
      case 'select-one': {
        const soq = question as SelectOne;
        return (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={soq.other}
              onChange={(e) => onChange({ ...question, other: e.target.checked })}
            />
            Permitir "Otro"
          </label>
        );
      }
      case 'slider': {
        const slq = question as Slider;
        return (
          <>
            <input
              type="text"
              placeholder="Placeholder"
              value={slq.placeholder || ''}
              onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Mínimo"
              value={slq.min || 0}
              onChange={(e) => onChange({ ...question, min: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Máximo"
              value={slq.max || 0}
              onChange={(e) => onChange({ ...question, max: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Step"
              value={slq.step || 1}
              onChange={(e) => onChange({ ...question, step: parseInt(e.target.value) || 1 })}
              className={styles.input}
            />
          </>
        );
      }
      case 'text-long':
      case 'text-short': {
        const tq = question as TextLong | TextShort;
        return (
          <>
            <input
              type="text"
              placeholder="Placeholder"
              value={tq.placeholder || ''}
              onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Longitud mínima"
              value={tq.minLength || 0}
              onChange={(e) => onChange({ ...question, minLength: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Longitud máxima"
              value={tq.maxLength || 0}
              onChange={(e) => onChange({ ...question, maxLength: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h5>Pregunta {index + 1}</h5>
        <button onClick={onRemove} className={styles.removeButton}>
          Eliminar
        </button>
      </div>
      <input
        type="text"
        placeholder="Categoría"
        value={question.category || ''}
        onChange={(e) => onChange({ ...question, category: e.target.value })}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Texto"
        value={question.text || ''}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        className={styles.input}
      />
      <select
        value={question.type}
        onChange={(e) => onChange({ ...question, type: e.target.value })}
        className={styles.select}
      >
        <option value="select-one">Select one question</option>
        <option value="select-multiple">Multi select question</option>
        <option value="slider">Slider</option>
        <option value="text-short">Short text</option>
        <option value="text-long">Long text</option>
      </select>
      {renderTypeSpecificFields()}
    </div>
  );
}