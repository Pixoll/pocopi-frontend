import React, { useState } from 'react';
import {ImageEditor} from "@/components/ModifyConfigPage/ImageEditor.tsx";
import {FormQuestionEditor} from "@/components/ModifyConfigPage/FormQuestionEditor.tsx";
import {QuestionEditor} from "@/components/ModifyConfigPage/QuestionEditor.tsx";
import styles from "@/styles/ModifyConfigPage/ModifyConfigPage.module.css";

import type {
  SingleConfigResponse,
  InformationCard,
  Faq,
  SelectOne,
  SelectMultiple,
  Slider,
  TextLong,
  TextShort,
  Question,
  Phase
}  from "@/api";
import {InformationCardEditor} from "@/components/ModifyConfigPage/InformationCardEditor.tsx";
import {FaqEditor} from "@/components/ModifyConfigPage/FaqEditor.tsx";

type ModifyConfigPageProps = {
  initialConfig: SingleConfigResponse;
  onSave?: (config: SingleConfigResponse) => void;
}

export const ModifyConfigPage: React.FC<ModifyConfigPageProps> = ({ initialConfig/*, onSave*/ }) => {
  const [config, setConfig] = useState<SingleConfigResponse>(initialConfig);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const addQuestion = (formType: 'preTestForm' | 'postTestForm') => {
    const newQuestion: SelectOne = {
      id: Date.now(),
      category: '',
      text: '',
      type: 'select-one',
      options: [],
      other: false
    };

    setConfig({
      ...config,
      [formType]: {
        ...config[formType],
        questions: [...config[formType].questions, newQuestion]
      }
    });
  };

  const updateQuestion = (
    formType: 'preTestForm' | 'postTestForm',
    index: number,
    updatedQuestion: SelectMultiple | SelectOne | Slider | TextLong | TextShort
  ) => {
    const newQuestions = [...config[formType].questions];
    newQuestions[index] = updatedQuestion;
    setConfig({
      ...config,
      [formType]: {
        ...config[formType],
        questions: newQuestions
      }
    });
  };

  const removeQuestion = (formType: 'preTestForm' | 'postTestForm', index: number) => {
    const newQuestions = config[formType].questions.filter((_, i) => i !== index);
    setConfig({
      ...config,
      [formType]: {
        ...config[formType],
        questions: newQuestions
      }
    });
  };

  const addPhase = (groupKey: string) => {
    const newPhase: Phase = {
      id: Date.now(),
      questions: []
    };

    setConfig({
      ...config,
      groups: {
        ...config.groups,
        [groupKey]: {
          ...config.groups[groupKey],
          protocol: {
            ...config.groups[groupKey].protocol,
            phases: [...(config.groups[groupKey].protocol.phases || []), newPhase]
          }
        }
      }
    });
  };

  const addProtocolQuestion = (groupKey: string, phaseIndex: number) => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      image: { url: '', alt: '' },
      options: []
    };

    const phases = [...config.groups[groupKey].protocol.phases];
    phases[phaseIndex] = {
      ...phases[phaseIndex],
      questions: [...phases[phaseIndex].questions, newQuestion]
    };

    setConfig({
      ...config,
      groups: {
        ...config.groups,
        [groupKey]: {
          ...config.groups[groupKey],
          protocol: {
            ...config.groups[groupKey].protocol,
            phases
          }
        }
      }
    });
  };

  const updateProtocolQuestion = (
    groupKey: string,
    phaseIndex: number,
    questionIndex: number,
    updatedQuestion: Question
  ) => {
    const phases = [...config.groups[groupKey].protocol.phases];
    const questions = [...phases[phaseIndex].questions];
    questions[questionIndex] = updatedQuestion;
    phases[phaseIndex] = { ...phases[phaseIndex], questions };

    setConfig({
      ...config,
      groups: {
        ...config.groups,
        [groupKey]: {
          ...config.groups[groupKey],
          protocol: {
            ...config.groups[groupKey].protocol,
            phases
          }
        }
      }
    });
  };

  const removeProtocolQuestion = (groupKey: string, phaseIndex: number, questionIndex: number) => {
    const phases = [...config.groups[groupKey].protocol.phases];
    const questions = phases[phaseIndex].questions.filter((_, i) => i !== questionIndex);
    phases[phaseIndex] = { ...phases[phaseIndex], questions };

    setConfig({
      ...config,
      groups: {
        ...config.groups,
        [groupKey]: {
          ...config.groups[groupKey],
          protocol: {
            ...config.groups[groupKey].protocol,
            phases
          }
        }
      }
    });
  };

  const removePhase = (groupKey: string, phaseIndex: number) => {
    const phases = config.groups[groupKey].protocol.phases.filter((_, i) => i !== phaseIndex);

    setConfig({
      ...config,
      groups: {
        ...config.groups,
        [groupKey]: {
          ...config.groups[groupKey],
          protocol: {
            ...config.groups[groupKey].protocol,
            phases
          }
        }
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className={styles.tabContent}>
            <h3>Información General</h3>

            <ImageEditor
              image={config.icon}
              onChange={(icon) => setConfig({ ...config, icon })}
              label="Icono principal"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Título</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className={styles.input}
                placeholder="Título de la configuración"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subtítulo</label>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className={styles.input}
                placeholder="Subtítulo"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className={styles.textarea}
                placeholder="Descripción"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={config.anonymous}
                  onChange={(e) => setConfig({ ...config, anonymous: e.target.checked })}
                />
                Anónimo
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Consentimiento Informado</label>
              <textarea
                value={config.informedConsent || ''}
                onChange={(e) => setConfig({ ...config, informedConsent: e.target.value })}
                className={styles.textarea}
                placeholder="Texto del consentimiento informado"
                rows={6}
              />
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3>Tarjetas de Información</h3>
              <button
                onClick={() => {
                  const newCard: InformationCard = {
                    title: '',
                    description: '',
                    color: 0
                  };
                  setConfig({
                    ...config,
                    informationCards: [...(config.informationCards || []), newCard]
                  });
                }}
                className={styles.addButton}
              >
                + Añadir tarjeta
              </button>
            </div>
            {config.informationCards?.map((card, index) => (
              <InformationCardEditor
                key={index}
                card={card}
                index={index}
                onChange={(updated) => {
                  const newCards = [...config.informationCards];
                  newCards[index] = updated;
                  setConfig({ ...config, informationCards: newCards });
                }}
                onRemove={() => {
                  const newCards = config.informationCards.filter((_, i) => i !== index);
                  setConfig({ ...config, informationCards: newCards });
                }}
              />
            ))}
          </div>
        );

      case 'faq':
        return (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3>Preguntas Frecuentes</h3>
              <button
                onClick={() => {
                  const newFaq: Faq = {
                    question: '',
                    answer: ''
                  };
                  setConfig({
                    ...config,
                    faq: [...(config.faq || []), newFaq]
                  });
                }}
                className={styles.addButton}
              >
                + Añadir FAQ
              </button>
            </div>
            {config.faq?.map((faq, index) => (
              <FaqEditor
                key={index}
                faq={faq}
                index={index}
                onChange={(updated) => {
                  const newFaqs = [...config.faq];
                  newFaqs[index] = updated;
                  setConfig({ ...config, faq: newFaqs });
                }}
                onRemove={() => {
                  const newFaqs = config.faq.filter((_, i) => i !== index);
                  setConfig({ ...config, faq: newFaqs });
                }}
              />
            ))}
          </div>
        );

      case 'preTestForm':
        return (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3>Formulario Pre-Test</h3>
              <button
                onClick={() => addQuestion('preTestForm')}
                className={styles.addButton}
              >
                + Añadir Pregunta
              </button>
            </div>

            {config.preTestForm?.questions?.length === 0 ? (
              <div className={styles.emptyState}>
                No hay preguntas. Haz clic en "Añadir Pregunta" para crear una.
              </div>
            ) : (
              <div className={styles.questionsContainer}>
                {config.preTestForm?.questions?.map((question, index) => (
                  <FormQuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onChange={(updatedQuestion) =>
                      updateQuestion('preTestForm', index, updatedQuestion as any)
                    }
                    onRemove={() => removeQuestion('preTestForm', index)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'postTestForm':
        return (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3>Formulario Post-Test</h3>
              <button
                onClick={() => addQuestion('postTestForm')}
                className={styles.addButton}
              >
                + Añadir Pregunta
              </button>
            </div>

            {config.postTestForm?.questions?.length === 0 ? (
              <div className={styles.emptyState}>
                No hay preguntas. Haz clic en "Añadir Pregunta" para crear una.
              </div>
            ) : (
              <div className={styles.questionsContainer}>
                {config.postTestForm?.questions?.map((question, index) => (
                  <FormQuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onChange={(updatedQuestion) =>
                      updateQuestion('postTestForm', index, updatedQuestion as any)
                    }
                    onRemove={() => removeQuestion('postTestForm', index)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'groups':
        return (
          <div className={styles.tabContent}>
            <h3>Grupos y Protocolos</h3>

            {/* Selector de grupo */}
            <div className={styles.groupSelector}>
              <label className={styles.label}>Seleccionar Grupo:</label>
              <select
                value={selectedGroup || ''}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Selecciona un grupo --</option>
                {Object.keys(config.groups || {}).map((key) => (
                  <option key={key} value={key}>
                    {key} - {config.groups[key].label}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroup && config.groups[selectedGroup] && (
              <div className={styles.groupDetail}>
                <div className={styles.groupCard}>
                  <h4>Configuración del Grupo: {selectedGroup}</h4>
                  <input
                    type="text"
                    placeholder="Label"
                    value={config.groups[selectedGroup].label || ''}
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        groups: {
                          ...config.groups,
                          [selectedGroup]: { ...config.groups[selectedGroup], label: e.target.value }
                        }
                      });
                    }}
                    className={styles.input}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Probabilidad"
                    value={config.groups[selectedGroup].probability || 0}
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        groups: {
                          ...config.groups,
                          [selectedGroup]: { ...config.groups[selectedGroup], probability: parseFloat(e.target.value) || 0 }
                        }
                      });
                    }}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Saludo"
                    value={config.groups[selectedGroup].greeting || ''}
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        groups: {
                          ...config.groups,
                          [selectedGroup]: { ...config.groups[selectedGroup], greeting: e.target.value }
                        }
                      });
                    }}
                    className={styles.textarea}
                  />
                  <div className={styles.protocolSection}>
                    <h5>Configuración del Protocolo</h5>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroup].protocol?.allowPreviousPhase}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            groups: {
                              ...config.groups,
                              [selectedGroup]: {
                                ...config.groups[selectedGroup],
                                protocol: {
                                  ...config.groups[selectedGroup].protocol,
                                  allowPreviousPhase: e.target.checked
                                }
                              }
                            }
                          });
                        }}
                      />
                      Permitir fase anterior
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroup].protocol?.allowPreviousQuestion}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            groups: {
                              ...config.groups,
                              [selectedGroup]: {
                                ...config.groups[selectedGroup],
                                protocol: {
                                  ...config.groups[selectedGroup].protocol,
                                  allowPreviousQuestion: e.target.checked
                                }
                              }
                            }
                          });
                        }}
                      />
                      Permitir pregunta anterior
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroup].protocol?.allowSkipQuestion}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            groups: {
                              ...config.groups,
                              [selectedGroup]: {
                                ...config.groups[selectedGroup],
                                protocol: {
                                  ...config.groups[selectedGroup].protocol,
                                  allowSkipQuestion: e.target.checked
                                }
                              }
                            }
                          });
                        }}
                      />
                      Permitir saltar pregunta
                    </label>
                  </div>
                </div>

                {/* Fases del Protocolo */}
                <div className={styles.phasesSection}>
                  <div className={styles.sectionHeader}>
                    <h4>Fases del Protocolo</h4>
                    <button
                      onClick={() => addPhase(selectedGroup)}
                      className={styles.addButton}
                    >
                      + Añadir Fase
                    </button>
                  </div>

                  {config.groups[selectedGroup].protocol.phases?.map((phase, phaseIndex) => (
                    <div key={phase.id} className={styles.phaseCard}>
                      <div className={styles.cardHeader}>
                        <h5>Fase {phaseIndex + 1}</h5>
                        <button
                          onClick={() => removePhase(selectedGroup, phaseIndex)}
                          className={styles.removeButton}
                        >
                          Eliminar Fase
                        </button>
                      </div>

                      <div className={styles.sectionHeader}>
                        <h6>Preguntas de la Fase</h6>
                        <button
                          onClick={() => addProtocolQuestion(selectedGroup, phaseIndex)}
                          className={styles.addButton}
                        >
                          + Añadir Pregunta
                        </button>
                      </div>

                      {phase.questions?.length === 0 ? (
                        <div className={styles.emptyState}>
                          No hay preguntas en esta fase.
                        </div>
                      ) : (
                        <div className={styles.questionsContainer}>
                          {phase.questions?.map((question, questionIndex) => (
                            <QuestionEditor
                              key={question.id}
                              question={question}
                              index={questionIndex}
                              onChange={(updated) =>
                                updateProtocolQuestion(selectedGroup, phaseIndex, questionIndex, updated)
                              }
                              onRemove={() =>
                                removeProtocolQuestion(selectedGroup, phaseIndex, questionIndex)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'translations':
        return (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3>Traducciones</h3>
              <button
                onClick={() => {
                  const key = prompt('Clave de traducción:');
                  if (key) {
                    setConfig({
                      ...config,
                      translations: {
                        ...config.translations,
                        [key]: ''
                      }
                    });
                  }
                }}
                className={styles.addButton}
              >
                + Añadir traducción
              </button>
            </div>
            <div className={styles.translationsGrid}>
              {Object.entries(config.translations || {}).map(([key, value]) => (
                <div key={key} className={styles.translationItem}>
                  <label className={styles.label}>{key}</label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        translations: {
                          ...config.translations,
                          [key]: e.target.value
                        }
                      });
                    }}
                    className={styles.input}
                  />
                  <button
                    onClick={() => {
                      const newTranslations = { ...config.translations };
                      delete newTranslations[key];
                      setConfig({ ...config, translations: newTranslations });
                    }}
                    className={styles.removeButton}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Editor de Configuración</h1>
        <button /*onClick={() => onSave(config)}*/ className={styles.saveButton}>
          Guardar Cambios
        </button>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'cards' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Tarjetas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'faq' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'preTestForm' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('preTestForm')}
        >
          Pre-Test
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'postTestForm' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('postTestForm')}
        >
          Post-Test
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'groups' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Grupos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'translations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('translations')}
        >
          Traducciones
        </button>
      </div>

      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
};
