import { useState } from "react";
import styles from "@/styles/ModifyConfigPage/QuestionEditor.module.css";
import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";
import { OptionEditor } from "@/components/ModifyConfigPage/OptionEditor.tsx";
import type {EditablePatchOption, EditablePatchQuestion, ImageState} from "@/utils/imageCollector.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTrash, faPlus, faCopy, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

type QuestionEditorProps = {
  question: EditablePatchQuestion;
  index: number;
  onChange: (question: EditablePatchQuestion) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  onCopy?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function QuestionEditor({
                                 question,
                                 index,
                                 onChange,
                                 onRemove,
                                 onDuplicate,
                                 onCopy,
                                 onMoveUp,
                                 onMoveDown
                               }: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addOption = () => {
    const newOption: EditablePatchOption = {
      id: undefined,
      text: '',
      correct: false,
      image: undefined
    };
    const newOptions = [...(question.options || []), newOption];
    onChange({ ...question, options: newOptions });
  };

  const updateOption = (idx: number, updated: EditablePatchOption) => {
    const newOptions = [...question.options];
    newOptions[idx] = updated;
    onChange({ ...question, options: newOptions });
  };

  const removeOption = (idx: number) => {
    const newOptions = question.options.filter((_, i) => i !== idx);
    onChange({ ...question, options: newOptions });
  };

  const getQuestionSummary = () => {
    const text = question.text || 'Sin texto';
    const optionsCount = question.options?.length || 0;
    const correctCount = question.options?.filter(o => o.correct).length || 0;

    return `${text.substring(0, 50)}${text.length > 50 ? '...' : ''} • ${optionsCount} opciones • ${correctCount} correcta(s)`;
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div
        className={styles.cardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.headerLeft}>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className={styles.chevronIcon}
          />
          <div className={styles.headerInfo}>
            <h5>Pregunta {index + 1}</h5>
            {!isExpanded && (
              <p className={styles.summary}>{getQuestionSummary()}</p>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.actionGroup}>
            {onMoveUp && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className={styles.iconButton}
                type="button"
                title="Mover arriba"
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className={styles.iconButton}
                type="button"
                title="Mover abajo"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
          </div>

          {(onMoveUp || onMoveDown) && (onCopy || onDuplicate) && (
            <div className={styles.actionSeparator} />
          )}

          <div className={styles.actionGroup}>
            {onCopy && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
                className={styles.iconButton}
                type="button"
                title="Copiar pregunta"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className={styles.iconButton}
                type="button"
                title="Duplicar pregunta"
              >
                <FontAwesomeIcon icon={faCopy} />
                <FontAwesomeIcon icon={faCopy} className={styles.duplicateIcon} />
              </button>
            )}
          </div>

          {(onCopy || onDuplicate) && (
            <div className={styles.actionSeparator} />
          )}

          <div className={styles.actionGroup}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`${styles.iconButton} ${styles.removeButton}`}
              type="button"
              title="Eliminar pregunta"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Texto de la pregunta</label>
            <textarea
              placeholder="Escribe el texto de la pregunta..."
              value={question.text || ''}
              onChange={(e) => onChange({ ...question, text: e.target.value })}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <ImageEditor
              image={question.image}
              onChange={(imageState: ImageState) => onChange({ ...question, image: imageState })}
              label="Imagen de la pregunta"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={question.randomizeOptions || false}
                onChange={(e) => onChange({ ...question, randomizeOptions: e.target.checked })}
              />
              <span>Aleatorizar opciones</span>
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h6>Opciones de respuesta</h6>
              <button
                type="button"
                onClick={addOption}
                className={styles.addButton}
              >
                <FontAwesomeIcon icon={faPlus} />
                Añadir opción
              </button>
            </div>

            {(!question.options || question.options.length === 0) ? (
              <div className={styles.emptyState}>
                <p>No hay opciones de respuesta</p>
                <small>Añade al menos una opción</small>
              </div>
            ) : (
              <div className={styles.optionsList}>
                {question.options.map((option, idx) => (
                  <OptionEditor
                    key={option.id ?? `new-option-${idx}`}
                    option={option}
                    index={idx}
                    onChange={(updated) => updateOption(idx, updated)}
                    onRemove={() => removeOption(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
