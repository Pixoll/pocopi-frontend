import { useState, useEffect } from 'react';
import type { Protocol, Phase, Question } from '@/api';
import styles from '@/styles/ModifyConfigPage/ProtocolEditor.module.css';
import { QuestionEditor } from '@/components/ModifyConfigPage/QuestionEditor.tsx';

type ProtocolEditorProps = {
  protocol: Protocol;
  onChange: (protocol: Protocol) => void;
};

export function ProtocolEditor({ protocol, onChange }: ProtocolEditorProps) {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);

  useEffect(() => {
    const phasesLength = protocol.phases?.length || 0;

    if (phasesLength === 0) {
      setSelectedPhaseIndex(null);
      return;
    }
    if (selectedPhaseIndex !== null && selectedPhaseIndex >= phasesLength) {
      setSelectedPhaseIndex(null);
    }
  }, [protocol.phases?.length, selectedPhaseIndex]);

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now(),
      questions: []
    };
    const newPhases = [...(protocol.phases || []), newPhase];
    onChange({
      ...protocol,
      phases: newPhases
    });
    setSelectedPhaseIndex(newPhases.length - 1);
  };

  const removePhase = (phaseIndex: number) => {
    const newPhases = protocol.phases.filter((_, i) => i !== phaseIndex);
    onChange({ ...protocol, phases: newPhases });

    if (selectedPhaseIndex === phaseIndex) {
      setSelectedPhaseIndex(newPhases.length > 0 ? Math.max(0, phaseIndex - 1) : null);
    } else if (selectedPhaseIndex !== null && selectedPhaseIndex > phaseIndex) {
      setSelectedPhaseIndex(selectedPhaseIndex - 1);
    }
  };

  const addQuestion = (phaseIndex: number) => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      image: { url: '', alt: '' },
      options: []
    };
    const newPhases = [...protocol.phases];
    newPhases[phaseIndex].questions = [
      ...(newPhases[phaseIndex].questions || []),
      newQuestion
    ];
    onChange({ ...protocol, phases: newPhases });
  };

  const updateQuestion = (phaseIndex: number, questionIndex: number, question: Question) => {
    const newPhases = [...protocol.phases];
    newPhases[phaseIndex].questions[questionIndex] = question;
    onChange({ ...protocol, phases: newPhases });
  };

  const removeQuestion = (phaseIndex: number, questionIndex: number) => {
    const newPhases = [...protocol.phases];
    newPhases[phaseIndex].questions = newPhases[phaseIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    onChange({ ...protocol, phases: newPhases });
  };

  const selectedPhase = selectedPhaseIndex !== null && protocol.phases?.[selectedPhaseIndex]
    ? protocol.phases[selectedPhaseIndex]
    : null;

  return (
    <div className={styles.protocolEditor}>
      <div className={styles.protocolSettings}>
        <h5>Configuración general del protocolo</h5>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={protocol.allowPreviousPhase || false}
              onChange={(e) =>
                onChange({ ...protocol, allowPreviousPhase: e.target.checked })
              }
            />
            <span>Permitir volver a fase anterior</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={protocol.allowPreviousQuestion || false}
              onChange={(e) =>
                onChange({ ...protocol, allowPreviousQuestion: e.target.checked })
              }
            />
            <span>Permitir volver a pregunta anterior</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={protocol.allowSkipQuestion || false}
              onChange={(e) =>
                onChange({ ...protocol, allowSkipQuestion: e.target.checked })
              }
            />
            <span>Permitir saltar preguntas</span>
          </label>
        </div>
      </div>

      <div className={styles.protocolLayout}>
        <div className={styles.phasesSidebar}>
          <div className={styles.sidebarHeader}>
            <h5>Fases ({protocol.phases?.length || 0})</h5>
            <button onClick={addPhase} className={styles.addButton}>
              + Nueva Fase
            </button>
          </div>

          <div className={styles.phasesList}>
            {(!protocol.phases || protocol.phases.length === 0) ? (
              <div className={styles.emptyState}>
                <p>No hay fases creadas</p>
                <small>Crea una fase para comenzar</small>
              </div>
            ) : (
              protocol.phases.map((phase, index) => (
                <button
                  key={phase.id}
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
                <button
                  onClick={() => removePhase(selectedPhaseIndex!)}
                  className={styles.removeButton}
                >
                  Eliminar Fase
                </button>
              </div>

              <div className={styles.questionsSection}>
                <div className={styles.questionsSectionHeader}>
                  <h5>Preguntas</h5>
                  <button
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
                      <div key={question.id} className={styles.questionWrapper}>
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