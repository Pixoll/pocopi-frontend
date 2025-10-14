import { useState } from 'react';
import type { SliderLabel } from "@/api";
import type {
  EditablePatchFormQuestion,
  EditablePatchSelectOne,
  EditablePatchSelectMultiple,
  EditablePatchSlider,
  EditablePatchTextShort,
  EditablePatchTextLong,
  EditablePatchFormOption,
  ImageState
} from "@/utils/imageCollector.ts";
import styles from "@/styles/ModifyConfigPage/FormQuestionEditor.module.css";
import { ImageEditor } from "@/components/ModifyConfigPage/ImageEditor.tsx";

type FormQuestionEditorProps = {
  question: EditablePatchFormQuestion;
  index: number;
  onChange: (question: EditablePatchFormQuestion) => void;
  onRemove: () => void;
}

export function FormQuestionEditor({ question, index, onChange, onRemove }: FormQuestionEditorProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const hasOptions = question.type === 'select-one' || question.type === 'select-multiple';
  const hasLabels = question.type === 'slider';

  const handleAddOption = () => {
    if (!hasOptions) return;
    const currentOptions = (question as EditablePatchSelectOne | EditablePatchSelectMultiple).options || [];
    const newOption: EditablePatchFormOption = {
      id: undefined,
      text: '',
      image: undefined
    };
    onChange({
      ...question,
      options: [...currentOptions, newOption]
    } as EditablePatchFormQuestion);
  };

  const handleOptionChange = (optionIndex: number, field: keyof EditablePatchFormOption, value: unknown) => {
    if (!hasOptions) return;
    const currentOptions = [...(question as EditablePatchSelectOne | EditablePatchSelectMultiple).options];
    currentOptions[optionIndex] = { ...currentOptions[optionIndex], [field]: value };
    onChange({ ...question, options: currentOptions } as EditablePatchFormQuestion);
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (!hasOptions) return;
    const currentOptions = (question as EditablePatchSelectOne | EditablePatchSelectMultiple).options.filter((_, i) => i !== optionIndex);
    onChange({ ...question, options: currentOptions } as EditablePatchFormQuestion);
  };

  const handleAddLabel = () => {
    if (!hasLabels) return;
    const currentLabels = (question as EditablePatchSlider).labels || [];
    const newLabel: SliderLabel = {
      number: 0,
      label: '',
    };
    onChange({
      ...question,
      labels: [...currentLabels, newLabel]
    } as EditablePatchFormQuestion);
  };

  const handleLabelChange = (labelIndex: number, field: keyof SliderLabel, value: unknown) => {
    if (!hasLabels) return;
    const currentLabels = [...(question as EditablePatchSlider).labels];
    currentLabels[labelIndex] = { ...currentLabels[labelIndex], [field]: value };
    onChange({ ...question, labels: currentLabels } as EditablePatchFormQuestion);
  };

  const handleRemoveLabel = (labelIndex: number) => {
    if (!hasLabels) return;
    const currentLabels = (question as EditablePatchSlider).labels.filter((_, i) => i !== labelIndex);
    onChange({ ...question, labels: currentLabels } as EditablePatchFormQuestion);
  };

  const renderTypeSpecificFields = () => {
    switch (question.type) {
      case 'select-multiple': {
        const smq = question as EditablePatchSelectMultiple;
        return (
          <>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Mínimo de selecciones</label>
                <input
                  type="number"
                  placeholder="0"
                  value={smq.min || 0}
                  onChange={(e) => onChange({ ...question, min: parseInt(e.target.value) || 0 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Máximo de selecciones</label>
                <input
                  type="number"
                  placeholder="0"
                  value={smq.max || 0}
                  onChange={(e) => onChange({ ...question, max: parseInt(e.target.value) || 0 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
            </div>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={smq.other}
                onChange={(e) => onChange({ ...question, other: e.target.checked } as EditablePatchFormQuestion)}
              />
              Permitir opción "Otro"
            </label>
          </>
        );
      }
      case 'select-one': {
        const soq = question as EditablePatchSelectOne;
        return (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={soq.other}
              onChange={(e) => onChange({ ...question, other: e.target.checked } as EditablePatchFormQuestion)}
            />
            Permitir opción "Otro"
          </label>
        );
      }
      case 'slider': {
        const slq = question as EditablePatchSlider;
        return (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Placeholder</label>
              <input
                type="text"
                placeholder="Ej: Selecciona un valor"
                value={slq.placeholder || ''}
                onChange={(e) => onChange({ ...question, placeholder: e.target.value } as EditablePatchFormQuestion)}
                className={styles.input}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Valor mínimo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={slq.min || 0}
                  onChange={(e) => onChange({ ...question, min: parseInt(e.target.value) || 0 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Valor máximo</label>
                <input
                  type="number"
                  placeholder="100"
                  value={slq.max || 100}
                  onChange={(e) => onChange({ ...question, max: parseInt(e.target.value) || 100 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Incremento</label>
                <input
                  type="number"
                  placeholder="1"
                  value={slq.step || 1}
                  onChange={(e) => onChange({ ...question, step: parseInt(e.target.value) || 1 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.sliderPreview}>
              <span className={styles.previewLabel}>Vista previa:</span>
              <input
                type="range"
                min={slq.min}
                max={slq.max}
                step={slq.step}
                disabled
                className={styles.sliderDemo}
              />
              <div className={styles.sliderValues}>
                <span>{slq.min}</span>
                <span>{slq.max}</span>
              </div>
            </div>
          </>
        );
      }
      case 'text-long':
      case 'text-short': {
        const tq = question as EditablePatchTextLong | EditablePatchTextShort;
        return (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Placeholder</label>
              <input
                type="text"
                placeholder="Ej: Escribe tu respuesta aquí"
                value={tq.placeholder || ''}
                onChange={(e) => onChange({ ...question, placeholder: e.target.value } as EditablePatchFormQuestion)}
                className={styles.input}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Longitud mínima</label>
                <input
                  type="number"
                  placeholder="0"
                  value={tq.minLength || 0}
                  onChange={(e) => onChange({ ...question, minLength: parseInt(e.target.value) || 0 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Longitud máxima</label>
                <input
                  type="number"
                  placeholder="0"
                  value={tq.maxLength || 0}
                  onChange={(e) => onChange({ ...question, maxLength: parseInt(e.target.value) || 0 } as EditablePatchFormQuestion)}
                  className={styles.input}
                />
              </div>
            </div>
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
        <button type="button" onClick={onRemove} className={styles.removeButton}>
          ✕
        </button>
      </div>

      <ImageEditor
        image={question.image}
        onChange={(imageState: ImageState) => {
          onChange({ ...question, image: imageState } as EditablePatchFormQuestion);
        }}
        label="Imagen de la pregunta"
        compact={true}
      />

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Categoría</label>
        <input
          type="text"
          placeholder="Ej: Información personal"
          value={question.category || ''}
          onChange={(e) => onChange({ ...question, category: e.target.value } as EditablePatchFormQuestion)}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Texto de la pregunta</label>
        <textarea
          placeholder="Escribe tu pregunta aquí..."
          value={question.text || ''}
          onChange={(e) => onChange({ ...question, text: e.target.value } as EditablePatchFormQuestion)}
          className={styles.textarea}
          rows={2}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Tipo de pregunta</label>
        <select
          value={question.type}
          onChange={(e) => {
            const baseQuestion = {
              id: question.id,
              category: question.category,
              text: question.text,
              image: question.image
            };

            let newQuestion: EditablePatchFormQuestion;
            switch (e.target.value) {
              case 'select-one':
                newQuestion = { ...baseQuestion, type: 'select-one', options: [], other: false } as EditablePatchSelectOne;
                break;
              case 'select-multiple':
                newQuestion = { ...baseQuestion, type: 'select-multiple', options: [], min: 0, max: 0, other: false } as EditablePatchSelectMultiple;
                break;
              case 'slider':
                newQuestion = { ...baseQuestion, type: 'slider', placeholder: '', min: 0, max: 100, step: 1, labels: [] } as EditablePatchSlider;
                break;
              case 'text-short':
                newQuestion = { ...baseQuestion, type: 'text-short', placeholder: '', minLength: 0, maxLength: 100 } as EditablePatchTextShort;
                break;
              case 'text-long':
                newQuestion = { ...baseQuestion, type: 'text-long', placeholder: '', minLength: 0, maxLength: 1000 } as EditablePatchTextLong;
                break;
              default:
                return;
            }
            onChange(newQuestion);
          }}
          className={styles.select}
        >
          <option value="select-one">Selección única</option>
          <option value="select-multiple">Selección múltiple</option>
          <option value="slider">Deslizador</option>
          <option value="text-short">Texto corto</option>
          <option value="text-long">Texto largo</option>
        </select>
      </div>

      {renderTypeSpecificFields()}

      {hasOptions && (
        <div className={styles.optionsSection}>
          <div className={styles.optionsHeader}>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className={`${styles.arrow} ${showOptions ? styles.arrowExpanded : ''}`}>▼</span>
              <span>Opciones ({(question as EditablePatchSelectOne | EditablePatchSelectMultiple).options?.length || 0})</span>
            </button>
            <button type="button" onClick={handleAddOption} className={styles.addButton}>
              + Agregar opción
            </button>
          </div>

          {showOptions && (
            <div className={styles.optionsList}>
              {(question as EditablePatchSelectOne | EditablePatchSelectMultiple).options?.map((option, optionIndex) => (
                <div key={option.id ?? `new-option-${optionIndex}`} className={styles.optionCard}>
                  <div className={styles.optionHeader}>
                    <span className={styles.optionNumber}>Opción {optionIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(optionIndex)}
                      className={styles.removeOptionButton}
                    >
                      ✕
                    </button>
                  </div>

                  <ImageEditor
                    onChange={(imageState: ImageState) => {
                      handleOptionChange(optionIndex, 'image', imageState);
                    }}
                    label=""
                    compact={true}
                  />

                  <input
                    type="text"
                    placeholder="Texto de la opción"
                    value={option.text || ''}
                    onChange={(e) => handleOptionChange(optionIndex, 'text', e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasLabels && (
        <div className={styles.labelsSection}>
          <div className={styles.labelsHeader}>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setShowLabels(!showLabels)}
            >
              <span className={`${styles.arrow} ${showLabels ? styles.arrowExpanded : ''}`}>▼</span>
              <span>Etiquetas del slider ({(question as EditablePatchSlider).labels?.length || 0})</span>
            </button>
            <button type="button" onClick={handleAddLabel} className={styles.addButton}>
              + Agregar etiqueta
            </button>
          </div>

          {showLabels && (
            <div className={styles.labelsList}>
              {(question as EditablePatchSlider).labels?.map((label, labelIndex) => (
                <div key={labelIndex} className={styles.labelCard}>
                  <input
                    type="number"
                    placeholder="Valor"
                    value={label.number}
                    onChange={(e) => handleLabelChange(labelIndex, 'number', parseInt(e.target.value) || 0)}
                    className={styles.labelNumberInput}
                  />
                  <input
                    type="text"
                    placeholder="Etiqueta"
                    value={label.label}
                    onChange={(e) => handleLabelChange(labelIndex, 'label', e.target.value)}
                    className={styles.labelTextInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(labelIndex)}
                    className={styles.removeLabelButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}