import { useState, useEffect } from 'react';
import styles from '@/styles/ModifyConfigPage/ProtocolEditor.module.css';
import { QuestionEditor } from '@/components/ModifyConfigPage/QuestionEditor.tsx';
import type {EditablePatchPhase, EditablePatchQuestion} from "@/utils/imageCollector.ts";

type ProtocolEditorProps = {
  phases: EditablePatchPhase[];
  onChange: (phases: EditablePatchPhase[]) => void;
};

export function ProtocolEditor({ phases, onChange }: ProtocolEditorProps) {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);

  useEffect(() => {
    const phasesLength = phases?.length || 0;

    if (phasesLength === 0) {
      setSelectedPhaseIndex(null);
      return;
    }
    if (selectedPhaseIndex !== null && selectedPhaseIndex >= phasesLength) {
      setSelectedPhaseIndex(null);
    }
  }, [phases?.length, selectedPhaseIndex]);

  const addPhase = () => {
    const newPhase: EditablePatchPhase = {
      id: undefined,
      randomizeQuestions: false,
      questions: []
    };
    const newPhases = [...(phases || []), newPhase];
    onChange(newPhases);
    setSelectedPhaseIndex(newPhases.length - 1);
  };

  const removePhase = (phaseIndex: number) => {
    const newPhases = phases.filter((_, i) => i !== phaseIndex);
    onChange(newPhases);

    if (selectedPhaseIndex === phaseIndex) {
      setSelectedPhaseIndex(newPhases.length > 0 ? Math.max(0, phaseIndex - 1) : null);
    } else if (selectedPhaseIndex !== null && selectedPhaseIndex > phaseIndex) {
      setSelectedPhaseIndex(selectedPhaseIndex - 1);
    }
  };

  const updatePhase = (phaseIndex: number, updates: Partial<EditablePatchPhase>) => {
    const newPhases = phases.map((phase, idx) => {
      if (idx === phaseIndex) {
        return { ...phase, ...updates };
      }
      return phase;
    });
    onChange(newPhases);
  };

  const addQuestion = (phaseIndex: number) => {
    const newQuestion: EditablePatchQuestion = {
      id: undefined,
      text: '',
      image: undefined,
      randomizeOptions: false,
      options: []
    };

    const newPhases = phases.map((phase, idx) => {
      if (idx === phaseIndex) {
        return {
          ...phase,
          questions: [...(phase.questions || []), newQuestion]
        };
      }
      return phase;
    });

    onChange(newPhases);
  };

  const updateQuestion = (phaseIndex: number, questionIndex: number, question: EditablePatchQuestion) => {
    const newPhases = phases.map((phase, idx) => {
      if (idx === phaseIndex) {
        const newQuestions = [...phase.questions];
        newQuestions[questionIndex] = question;
        return {
          ...phase,
          questions: newQuestions
        };
      }
      return phase;
    });

    onChange(newPhases);
  };

  const removeQuestion = (phaseIndex: number, questionIndex: number) => {
    const newPhases = phases.map((phase, idx) => {
      if (idx === phaseIndex) {
        return {
          ...phase,
          questions: phase.questions.filter((_, i) => i !== questionIndex)
        };
      }
      return phase;
    });

    onChange(newPhases);
  };

  const selectedPhase = selectedPhaseIndex !== null && phases?.[selectedPhaseIndex]
    ? phases[selectedPhaseIndex]
    : null;

  return (
    <div className={styles.protocolEditor}>
      <div className={styles.protocolLayout}>
        <div className={styles.phasesSidebar}>
          <div className={styles.sidebarHeader}>
            <h5>Fases ({phases?.length || 0})</h5>
            <button onClick={addPhase} className={styles.addButton} type="button">
              + Nueva Fase
            </button>
          </div>

          <div className={styles.phasesList}>
            {(!phases || phases.length === 0) ? (
              <div className={styles.emptyState}>
                <p>No hay fases creadas</p>
                <small>Crea una fase para comenzar</small>
              </div>
            ) : (
              phases.map((phase, index) => (
                <button
                  key={phase.id ?? `new-phase-${index}`}
                  type="button"
                  className={`${styles.phaseItem} ${
                    selectedPhaseIndex === index ? styles.active : ''
                  }`}
                  onClick={() => setSelectedPhaseIndex(index)}
                >
                  <div className={styles.phaseItemContent}>
                    <span className={styles.phaseNumber}>Fase {index + 1}</span>
                    <span className={styles.questionCount}>
                      {phase.questions?.length || 0} preguntas
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={styles.phaseContent}>
          {!selectedPhase ? (
            <div className={styles.noSelection}>
              <p>Selecciona una fase para editarla</p>
              <small>o crea una nueva fase para comenzar</small>
            </div>
          ) : (
            <div className={styles.phaseEditor}>
              <div className={styles.phaseHeader}>
                <div>
                  <h4>Fase {selectedPhaseIndex! + 1}</h4>
                  <p className={styles.phaseSubtitle}>
                    {selectedPhase.questions?.length || 0} preguntas
                  </p>
                </div>
                <div className={styles.phaseHeaderActions}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedPhase.randomizeQuestions || false}
                      onChange={(e) =>
                        updatePhase(selectedPhaseIndex!, { randomizeQuestions: e.target.checked })
                      }
                    />
                    <span>Aleatorizar preguntas</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removePhase(selectedPhaseIndex!)}
                    className={styles.removeButton}
                  >
                    Eliminar Fase
                  </button>
                </div>
              </div>

              <div className={styles.questionsSection}>
                <div className={styles.questionsSectionHeader}>
                  <h5>Preguntas</h5>
                  <button
                    type="button"
                    onClick={() => addQuestion(selectedPhaseIndex!)}
                    className={styles.addButton}
                  >
                    + Añadir Pregunta
                  </button>
                </div>

                {(!selectedPhase.questions || selectedPhase.questions.length === 0) ? (
                  <div className={styles.emptyState}>
                    <p>No hay preguntas en esta fase</p>
                    <small>Añade preguntas para comenzar</small>
                  </div>
                ) : (
                  <div className={styles.questionsList}>
                    {selectedPhase.questions.map((question, questionIndex) => (
                      <div key={question.id ?? `new-question-${questionIndex}`} className={styles.questionWrapper}>
                        <QuestionEditor
                          question={question}
                          index={questionIndex}
                          onChange={(updated) =>
                            updateQuestion(selectedPhaseIndex!, questionIndex, updated)
                          }
                          onRemove={() =>
                            removeQuestion(selectedPhaseIndex!, questionIndex)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}