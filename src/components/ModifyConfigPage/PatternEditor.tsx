import React, { useEffect, useState } from 'react';
import type { Pattern, PatternUpdate } from '@/api';
import styles from '@/styles/ModifyConfigPage/ModifyConfigPage.module.css';

type PatternEditorProps = {
  pattern: PatternUpdate | null;
  availablePatterns: Pattern[];
  readOnly: boolean;
  onChange: (pattern: PatternUpdate | null) => void;
  onRemove: () => void;
};

export const PatternEditor: React.FC<PatternEditorProps> = ({
                                                              pattern,
                                                              availablePatterns,
                                                              readOnly,
                                                              onChange,
                                                              onRemove
                                                            }) => {
  const [isNewPattern, setIsNewPattern] = useState<boolean>(!pattern || !pattern.id);

  useEffect(() => {
    setIsNewPattern(!pattern || !pattern.id);
  }, [pattern]);

  const handlePatternSourceChange = (value: string) => {
    if (value === 'new') {
      setIsNewPattern(true);
      onChange({
        id: undefined,
        name: '',
        regex: ''
      });
    } else if (value === 'none') {
      setIsNewPattern(false);
      onChange(null);
    } else {
      const selectedId = parseInt(value);
      const selectedPattern = availablePatterns.find(p => p.id === selectedId);
      if (selectedPattern) {
        setIsNewPattern(false);
        onChange({
          id: selectedPattern.id,
          name: selectedPattern.name,
          regex: selectedPattern.regex
        });
      }
    }
  };

  const getSelectedValue = () => {
    if (!pattern) return 'none';
    if (!pattern.id) return 'new';
    return pattern.id.toString();
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4>Configuración de Patrón</h4>
        {!readOnly && (
          <button
            onClick={onRemove}
            className={styles.removeButton}
            type="button"
          >
            Quitar Patrón
          </button>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Fuente del Patrón</label>
        <select
          value={getSelectedValue()}
          onChange={(e) => handlePatternSourceChange(e.target.value)}
          className={styles.select}
          disabled={readOnly}
        >
          <option value="none">-- Sin patrón --</option>
          <option value="new">Crear nuevo patrón</option>
          {availablePatterns.length > 0 && (
            <optgroup label="Patrones existentes">
              {availablePatterns.map((p) => (
                <option key={p.id} value={p.id.toString()}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {pattern && (
        <>
          {isNewPattern && (
            <div className={styles.infoBox}>
              <small>
                Nuevo patrón que se guardará y se aplicará automáticamente
              </small>
            </div>
          )}

          {!isNewPattern && pattern.id && pattern.id > 0 && (
            <div className={styles.infoBox}>
              <small>
                Patrón existente "{pattern.name}". Se puede modificar o usar tal cual.
              </small>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nombre del Patrón
              {isNewPattern && <span className={styles.required}> *</span>}
            </label>
            <input
              type="text"
              value={pattern.name || ''}
              onChange={(e) => onChange({ ...pattern, name: e.target.value })}
              className={styles.input}
              placeholder="Ej: Email, DNI, RUT, etc."
              disabled={readOnly}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Expresión Regular (Regex)
              {isNewPattern && <span className={styles.required}> *</span>}
            </label>
            <input
              type="text"
              value={pattern.regex || ''}
              onChange={(e) => onChange({ ...pattern, regex: e.target.value })}
              className={styles.input}
              placeholder="Ej: ^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
              disabled={readOnly}
            />
            <small className={styles.helpText}>
              Define el patrón de validación para el nombre de usuario
            </small>
          </div>
        </>
      )}
    </div>
  );
};
