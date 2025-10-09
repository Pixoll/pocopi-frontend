import type {Question} from "@/api";
import styles from "@/styles/ModifyConfigPage/QuestionEditor.module.css";
import {ImageEditor} from "@/components/ModifyConfigPage/ImageEditor.tsx";
import {OptionEditor} from "@/components/ModifyConfigPage/OptionEditor.tsx";

type QuestionEditorProps = {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({question, index, onChange, onRemove}:QuestionEditorProps) {
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
        placeholder="Texto de la pregunta"
        value={question.text || ''}
        onChange={(e) => onChange({...question, text: e.target.value})}
        className={styles.input}
      />
      <ImageEditor
        image={question.image}
        onChange={(image) => onChange({...question, image: image!})}
        label="Imagen de la pregunta"
      />
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h6>Opciones</h6>
          <button
            onClick={() => {
              const newOptions = [...(question.options || []), {
                id: Date.now(),
                text: '',
                correct: false
              }];
              onChange({...question, options: newOptions});
            }}
            className={styles.addButton}
          >
            + Añadir opción
          </button>
        </div>
        {question.options?.map((option, idx) => (
          <OptionEditor
            key={option.id}
            option={option}
            index={idx}
            onChange={(updated) => {
              const newOptions = [...question.options];
              newOptions[idx] = updated;
              onChange({...question, options: newOptions});
            }}
            onRemove={() => {
              const newOptions = question.options.filter((_, i) => i !== idx);
              onChange({...question, options: newOptions});
            }}
          />
        ))}
      </div>
    </div>
  )
}