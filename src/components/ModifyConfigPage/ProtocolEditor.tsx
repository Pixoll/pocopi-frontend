import { useState, useEffect } from 'react';
import styles from '@/styles/ModifyConfigPage/ProtocolEditor.module.css';
import { QuestionEditor } from '@/components/ModifyConfigPage/QuestionEditor.tsx';
import { DestinationModal } from '@/components/ModifyConfigPage/DestinationModal.tsx';
import { clonePhase, cloneQuestion } from '@/utils/CloneHelper.ts';
import type { EditablePatchPhase, EditablePatchQuestion, EditablePatchGroup } from "@/utils/imageCollector.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faArrowUp, faArrowDown, faPaste } from '@fortawesome/free-solid-svg-icons';

type ClipboardItem =
  | { type: 'phase'; data: EditablePatchPhase }
  | { type: 'question'; data: EditablePatchQuestion }
  | null;

type ProtocolEditorProps = {
  phases: EditablePatchPhase[];
  onChange: (phases: EditablePatchPhase[]) => void;
  allGroups?: EditablePatchGroup[];
  onCrossGroupPaste?: (item: ClipboardItem, targetGroupIndex: number, targetPhaseIndex?: number) => void;
};

export function ProtocolEditor({ phases, onChange, allGroups, onCrossGroupPaste }: ProtocolEditorProps) {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardItem>(null);
  const [showDestinationModal, setShowDestinationModal] = useState(false);

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

  const duplicatePhase = (phaseIndex: number) => {
    const phaseToDuplicate = phases[phaseIndex];
    const clonedPhase = clonePhase(phaseToDuplicate);
    const newPhases = [
      ...phases.slice(0, phaseIndex + 1),
      clonedPhase,
      ...phases.slice(phaseIndex + 1)
    ];
    onChange(newPhases);
    setSelectedPhaseIndex(phaseIndex + 1);
  };

  const copyPhase = (phaseIndex: number) => {
    const phaseToCopy = phases[phaseIndex];
    const clonedPhase = clonePhase(phaseToCopy);
    setClipboard({ type: 'phase', data: clonedPhase });
  };

  const pastePhase = () => {
    if (!clipboard || clipboard.type !== 'phase') return;

    if (allGroups && onCrossGroupPaste) {
      setShowDestinationModal(true);
    } else {
      const newPhases = [...phases, clipboard.data];
      onChange(newPhases);
      setSelectedPhaseIndex(newPhases.length - 1);
    }
  };

  const movePhase = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= phases.length) return;

    const newPhases = [...phases];
    [newPhases[fromIndex], newPhases[toIndex]] = [newPhases[toIndex], newPhases[fromIndex]];
    onChange(newPhases);
    setSelectedPhaseIndex(toIndex);
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

  const duplicateQuestion = (phaseIndex: number, questionIndex: number) => {
    const questionToDuplicate = phases[phaseIndex].questions[questionIndex];
    const clonedQuestion = cloneQuestion(questionToDuplicate);

    const newPhases = phases.map((phase, idx) => {
      if (idx === phaseIndex) {
        const newQuestions = [
          ...phase.questions.slice(0, questionIndex + 1),
          clonedQuestion,
          ...phase.questions.slice(questionIndex + 1)
        ];
        return { ...phase, questions: newQuestions };
      }
      return phase;
    });

    onChange(newPhases);
  };

  const copyQuestion = (phaseIndex: number, questionIndex: number) => {
    const questionToCopy = phases[phaseIndex].questions[questionIndex];
    const clonedQuestion = cloneQuestion(questionToCopy);
    setClipboard({ type: 'question', data: clonedQuestion });
  };

  const pasteQuestion = (phaseIndex: number) => {
    if (!clipboard || clipboard.type !== 'question') return;

    if (allGroups && onCrossGroupPaste) {
      setShowDestinationModal(true);
    } else {
      const newPhases = phases.map((phase, idx) => {
        if (idx === phaseIndex) {
          return {
            ...phase,
            questions: [...phase.questions, clipboard.data]
          };
        }
        return phase;
      });
      onChange(newPhases);
    }
  };

  const moveQuestion = (phaseIndex: number, questionIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;
    const phase = phases[phaseIndex];

    if (toIndex < 0 || toIndex >= phase.questions.length) return;

    const newQuestions = [...phase.questions];
    [newQuestions[questionIndex], newQuestions[toIndex]] = [newQuestions[toIndex], newQuestions[questionIndex]];

    const newPhases = phases.map((p, idx) => {
      if (idx === phaseIndex) {
        return { ...p, questions: newQuestions };
      }
      return p;
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

  const handleDestinationConfirm = (groupIndex: number, phaseIndex?: number) => {
    if (!clipboard || !onCrossGroupPaste) return;
    onCrossGroupPaste(clipboard, groupIndex, phaseIndex);
    setClipboard(null);
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
            <div className={styles.sidebarActions}>
              {clipboard?.type === 'phase' && (
                <button
                  onClick={pastePhase}
                  className={styles.pasteButton}
                  type="button"
                  title="Pegar fase"
                >
                  <FontAwesomeIcon icon={faPaste} />
                </button>
              )}
              <button onClick={addPhase} className={styles.addButton} type="button">
                + Nueva Fase
              </button>
            </div>
          </div>

          <div className={styles.phasesList}>
            {(!phases || phases.length === 0) ? (
              <div className={styles.emptyState}>
                <p>No hay fases creadas</p>
                <small>Crea una fase para comenzar</small>
              </div>
            ) : (
              phases.map((phase, index) => (
                <div
                  key={phase.id ?? `new-phase-${index}`}
                  className={`${styles.phaseItem} ${
                    selectedPhaseIndex === index ? styles.active : ''
                  }`}
                >
                  <button
                    type="button"
                    className={styles.phaseItemButton}
                    onClick={() => setSelectedPhaseIndex(index)}
                  >
                    <div className={styles.phaseItemContent}>
                      <span className={styles.phaseNumber}>Fase {index + 1}</span>
                      <span className={styles.questionCount}>
                        {phase.questions?.length || 0} preguntas
                      </span>
                    </div>
                  </button>
                  <div className={styles.phaseItemActions}>
                    <button
                      type="button"
                      onClick={() => movePhase(index, 'up')}
                      disabled={index === 0}
                      className={styles.iconButton}
                      title="Mover arriba"
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhase(index, 'down')}
                      disabled={index === phases.length - 1}
                      className={styles.iconButton}
                      title="Mover abajo"
                    >
                      <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyPhase(index)}
                      className={styles.iconButton}
                      title="Copiar fase"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePhase(index)}
                      className={styles.iconButton}
                      title="Duplicar fase"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      <FontAwesomeIcon icon={faCopy} className={styles.duplicateIcon} />
                    </button>
                  </div>
                </div>
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
                  <div className={styles.questionsActions}>
                    {clipboard?.type === 'question' && (
                      <button
                        type="button"
                        onClick={() => pasteQuestion(selectedPhaseIndex!)}
                        className={styles.pasteButton}
                        title="Pegar pregunta"
                      >
                        <FontAwesomeIcon icon={faPaste} /> Pegar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => addQuestion(selectedPhaseIndex!)}
                      className={styles.addButton}
                    >
                      + Añadir Pregunta
                    </button>
                  </div>
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
                          onDuplicate={() => duplicateQuestion(selectedPhaseIndex!, questionIndex)}
                          onCopy={() => copyQuestion(selectedPhaseIndex!, questionIndex)}
                          onMoveUp={questionIndex > 0 ? () => moveQuestion(selectedPhaseIndex!, questionIndex, 'up') : undefined}
                          onMoveDown={questionIndex < selectedPhase.questions.length - 1 ? () => moveQuestion(selectedPhaseIndex!, questionIndex, 'down') : undefined}
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

      {allGroups && (
        <DestinationModal
          isOpen={showDestinationModal}
          onClose={() => setShowDestinationModal(false)}
          onConfirm={handleDestinationConfirm}
          groups={allGroups}
          title={clipboard?.type === 'phase' ? 'Pegar Fase en...' : 'Pegar Pregunta en...'}
          needsPhaseSelection={clipboard?.type === 'question'}
        />
      )}
    </div>
  );
}
