import { faCircleExclamation, faXmark, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/ErrorDisplay.module.css";
import type { ApiHttpError } from "@/api";
import { useEffect, useState } from "react";

type ErrorDisplayProps = {
  error: string | ApiHttpError | Error;
  onClose?: () => void;
  className?: string;
};

type GroupedError = {
  path: string;
  errors: Array<{ field: string; message: string }>;
};

type ParsedPath = {
  section: string;
  subsection: string;
  item: string;
  fieldName: string;
};

function parseFieldPath(field: string): ParsedPath {
  const patterns = {
    group: /groups\[(\d+)]/,
    phase: /phases\[(\d+)]/,
    question: /questions\[(\d+)]/,
    option: /options\[(\d+)]/,
    label: /labels\[(\d+)]/,
    informationCard: /informationCards\[(\d+)]/,
    faq: /frequentlyAskedQuestion\[(\d+)]/,
    preTestForm: /preTestForm\.questions\[(\d+)]/,
    postTestForm: /postTestForm\.questions\[(\d+)]/,
    translation: /translations\[(\d+)]/,
  };

  const fieldMatch = field.match(/\.([^.[\]]+)$/);
  const fieldName = fieldMatch ? fieldMatch[1] : field;

  let section = '';
  let subsection = '';
  let item = '';

  if (patterns.group.test(field)) {
    const groupMatch = field.match(patterns.group);
    section = groupMatch ? `Grupo ${parseInt(groupMatch[1]) + 1}` : '';

    const phaseMatch = field.match(patterns.phase);
    if (phaseMatch) {
      subsection = `Fase ${parseInt(phaseMatch[1]) + 1}`;
    }

    const questionMatch = field.match(patterns.question);
    const optionMatch = field.match(patterns.option);

    if (questionMatch) {
      item = `Pregunta ${parseInt(questionMatch[1]) + 1}`;
    } else if (optionMatch) {
      item = `Opción ${parseInt(optionMatch[1]) + 1}`;
    }
  }

  else if (patterns.preTestForm.test(field) || patterns.postTestForm.test(field)) {
    const isPreTest = patterns.preTestForm.test(field);
    section = isPreTest ? 'Pre-Test' : 'Post-Test';

    const match = field.match(isPreTest ? patterns.preTestForm : patterns.postTestForm);
    if (match) {
      subsection = `Pregunta ${parseInt(match[1]) + 1}`;
    }

    const optionMatch = field.match(patterns.option);
    const labelMatch = field.match(patterns.label);

    if (optionMatch) {
      item = `Opción ${parseInt(optionMatch[1]) + 1}`;
    } else if (labelMatch) {
      item = `Etiqueta ${parseInt(labelMatch[1]) + 1}`;
    }
  }

  else if (patterns.informationCard.test(field)) {
    section = 'Tarjetas de Información';
    const match = field.match(patterns.informationCard);
    if (match) {
      subsection = `Tarjeta ${parseInt(match[1]) + 1}`;
    }
  }

  else if (patterns.faq.test(field)) {
    section = 'FAQ';
    const match = field.match(patterns.faq);
    if (match) {
      subsection = `Pregunta ${parseInt(match[1]) + 1}`;
    }
  }

  else {
    section = 'General';
  }

  return {
    section,
    subsection,
    item,
    fieldName
  };
}

function groupErrors(errors: Array<{ field: string; message: string }>): GroupedError[] {
  const grouped = new Map<string, Array<{ field: string; message: string }>>();

  errors.forEach(error => {
    const parsed = parseFieldPath(error.field);
    const pathParts = [parsed.section, parsed.subsection, parsed.item].filter(Boolean);
    const path = pathParts.length > 0 ? pathParts.join(' → ') : 'General';

    if (!grouped.has(path)) {
      grouped.set(path, []);
    }
    grouped.get(path)!.push({ field: parsed.fieldName, message: error.message });
  });

  return Array.from(grouped.entries())
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([path, errors]) => ({ path, errors }));
}

const FIELD_TRANSLATIONS: Record<string, string> = {
  'title': 'Título',
  'subtitle': 'Subtítulo',
  'description': 'Descripción',
  'informedConsent': 'Consentimiento Informado',
  'icon': 'Icono',
  'anonymous': 'Anónimo',

  'text': 'Texto',
  'label': 'Etiqueta',
  'greeting': 'Saludo',
  'probability': 'Probabilidad',
  'color': 'Color',
  'correct': 'Correcta',
  'category': 'Categoría',
  'placeholder': 'Placeholder',
  'minLength': 'Longitud mínima',
  'maxLength': 'Longitud máxima',
  'min': 'Mínimo',
  'max': 'Máximo',
  'step': 'Incremento',
  'other': 'Opción "Otro"',

  'question': 'Pregunta',
  'answer': 'Respuesta',

  'options': 'Opciones',
  'labels': 'Etiquetas',
  'number': 'Número',

  'randomizeOptions': 'Aleatorizar opciones',
  'randomizeQuestions': 'Aleatorizar preguntas',
  'randomizePhases': 'Aleatorizar fases',
  'allowPreviousPhase': 'Permitir fase anterior',
  'allowPreviousQuestion': 'Permitir pregunta anterior',
  'allowSkipQuestion': 'Permitir saltar pregunta',
};

function translateFieldName(fieldName: string): string {
  return FIELD_TRANSLATIONS[fieldName] || fieldName;
}

export function ErrorDisplay({ error, onClose, className }: ErrorDisplayProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!error) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [error, onClose]);

  useEffect(() => {
    if (!error) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [error]);

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleAllGroups = (expand: boolean) => {
    if (expand && typeof error === "object" && error !== null && "errors" in error) {
      const apiError = error as ApiHttpError;
      if (apiError.errors) {
        const groupedErrors = groupErrors(apiError.errors);
        setExpandedGroups(new Set(groupedErrors.map((_, idx) => idx)));
      }
    } else {
      setExpandedGroups(new Set());
    }
  };

  if (!error) return null;

  const renderErrorContent = () => {
    if (typeof error === "string") {
      return <p className={styles.message}>{error}</p>;
    }

    if (error instanceof Error) {
      return <p className={styles.message}>{error.message}</p>;
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      const apiError = error as ApiHttpError;
      const groupedErrors = apiError.errors ? groupErrors(apiError.errors) : [];

      return (
        <>
          {apiError.code && (
            <div className={styles.codeTag}>Error {apiError.code}</div>
          )}

          {apiError.message && (
            <p className={styles.message}>{apiError.message}</p>
          )}

          {groupedErrors.length > 0 && (
            <>
              <div className={styles.errorsHeader}>
                <h4>Errores de validación ({apiError.errors?.length || 0})</h4>
                <div className={styles.toggleButtons}>
                  <button
                    type="button"
                    onClick={() => toggleAllGroups(true)}
                    className={styles.toggleButton}
                  >
                    Expandir todo
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAllGroups(false)}
                    className={styles.toggleButton}
                  >
                    Colapsar todo
                  </button>
                </div>
              </div>

              <div className={styles.errorsList}>
                {groupedErrors.map((group, idx) => (
                  <div key={idx} className={styles.errorGroup}>
                    <button
                      type="button"
                      className={styles.groupHeader}
                      onClick={() => toggleGroup(idx)}
                    >
                      <div className={styles.groupHeaderContent}>
                        <FontAwesomeIcon
                          icon={expandedGroups.has(idx) ? faChevronUp : faChevronDown}
                          className={styles.chevronIcon}
                        />
                        <span className={styles.groupPath}>{group.path}</span>
                        <span className={styles.errorCount}>
                          {group.errors.length} {group.errors.length === 1 ? 'error' : 'errores'}
                        </span>
                      </div>
                    </button>

                    {expandedGroups.has(idx) && (
                      <ul className={styles.groupErrors}>
                        {group.errors.map((fieldError, errorIdx) => (
                          <li key={errorIdx} className={styles.fieldError}>
                            <span className={styles.fieldName}>
                              {translateFieldName(fieldError.field)}:
                            </span>
                            <span className={styles.fieldMessage}>{fieldError.message}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    return <p className={styles.message}>{String(error)}</p>;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${className || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
          <h3>Error</h3>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Cerrar error"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        <div className={styles.modalContent}>
          {renderErrorContent()}
        </div>

        {onClose && (
          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButtonPrimary}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}