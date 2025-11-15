import React, {useEffect, useState} from 'react';
import {produce} from 'immer'
import {
  toEditablePatchConfig,
  type EditablePatchConfig,
  type EditablePatchSelectOne,
  type EditablePatchFormQuestion,
  type EditablePatchInformationCard,
  type EditablePatchGroup,
  buildPatchRequest,
  preloadImages,
  clearImageCache
} from "@/utils/imageCollector.ts";
import {ImageEditor} from "@/components/ModifyConfigPage/ImageEditor.tsx";
import {FormQuestionEditor} from "@/components/ModifyConfigPage/FormQuestionEditor.tsx";
import {InformationCardEditor} from "@/components/ModifyConfigPage/InformationCardEditor.tsx";
import {FaqEditor} from "@/components/ModifyConfigPage/FaqEditor.tsx";
import styles from "@/styles/ModifyConfigPage/ModifyConfigPage.module.css";

import api, {
  type FrequentlyAskedQuestionUpdate,
  type FullConfig,
} from "@/api";
import {ProtocolEditor} from "@/components/ModifyConfigPage/ProtocolEditor.tsx";
import {LoadingPage} from "@/pages/LoadingPage.tsx";
import {SavePopup} from "@/components/SavePopup.tsx";

type ModifyConfigPageProps = {
  token: string;
  onSave?: (config: FullConfig) => void;
}

export const ModifyLatestConfig: React.FC<ModifyConfigPageProps> = ({ token/*, onSave*/}) => {
  const [config, setConfig] = useState<EditablePatchConfig | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');

  async function getConfig(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await api.getLastestConfigAsAdmin({auth:token});
      if (response.data) {
        await preloadImages(response.data);
        setConfig(toEditablePatchConfig(response.data));

        document.title = response.data.title ?? "";
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getConfig();
    return () => {
      clearImageCache();
    };
  }, []);

  if (isLoading || !config) {
    return <LoadingPage message="Cargando configuración..." />;
  }

  const addQuestion = (formType: 'preTestForm' | 'postTestForm') => {
    const newQuestion: EditablePatchSelectOne = {
      id: undefined,
      category: '',
      text: '',
      type: 'select-one',
      options: [],
      other: false
    };

    setConfig(produce(config, draft => {
      if (!draft[formType]) {
        draft[formType] = { questions: [] };
      }
      draft[formType]!.questions.push(newQuestion);
    }));
  };

  const handleSave = async () => {
    setSaveStatus('loading');

    try {
      const patchRequest = await buildPatchRequest(config);
      const { data, error } = await api.updateLatestConfig({
        auth: token,
        body: patchRequest
      });

      if (error) {
        console.log(error);
        setSaveStatus('error');
        setSaveMessage('Error al guardar los cambios. Por favor, intenta de nuevo.');
        return;
      }

      if (data) {
        setSaveStatus('success');
        setSaveMessage('Configuración guardada exitosamente');
        await getConfig();
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setSaveMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    }
  };

  const handleClosePopup = () => {
    setSaveStatus(null);
    setSaveMessage('');
  };

  const updateQuestion = (
    formType: 'preTestForm' | 'postTestForm',
    index: number,
    updatedQuestion: EditablePatchFormQuestion
  ) => {
    setConfig((currentConfig) =>
      produce(currentConfig, (draft) => {
        if (draft) {
          draft[formType]!.questions[index] = updatedQuestion;
        }
      })
    );
  };

  const removeQuestion = (formType: 'preTestForm' | 'postTestForm', index: number) => {
    setConfig((currentConfig) => produce(
      currentConfig, (draft) => {
        if (draft) {
          draft[formType]!.questions = draft[formType]!.questions.filter((_, i) => i !== index);
        }
      }
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className={styles.tabContent}>
            <h3>Información General</h3>

            <ImageEditor
              image={config.icon}
              onChange={(imageState) => {
                setConfig(produce(config, (draft) => {
                  draft.icon = imageState;
                }));
              }}
              label="Icono principal"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Título</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => setConfig({...config, title: e.target.value})}
                className={styles.input}
                placeholder="Título de la configuración"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subtítulo</label>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => setConfig({...config, subtitle: e.target.value})}
                className={styles.input}
                placeholder="Subtítulo"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({...config, description: e.target.value})}
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
                  onChange={(e) => setConfig({...config, anonymous: e.target.checked})}
                />
                Anónimo
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Consentimiento Informado</label>
              <textarea
                value={config.informedConsent || ''}
                onChange={(e) => setConfig({...config, informedConsent: e.target.value})}
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
                  const newCard: EditablePatchInformationCard = {
                    id: undefined,
                    title: '',
                    description: '',
                    color: 0,
                    icon: undefined
                  };
                  setConfig(produce(config, (draft) => {
                    draft.informationCards.push(newCard);
                  }));
                }}
                className={styles.addButton}
              >
                + Añadir tarjeta
              </button>
            </div>
            {config.informationCards?.map((card, index) => (
              <InformationCardEditor
                key={card.id ?? `new-card-${index}`}
                card={card}
                index={index}
                onChange={(updated) => {
                  setConfig(produce(config, (draft) => {
                    draft.informationCards[index] = updated;
                  }));
                }}
                onRemove={() => {
                  setConfig(produce(config, (draft) => {
                    draft.informationCards = draft.informationCards.filter((_, i) => i !== index);
                  }));
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
                  const newFaq: FrequentlyAskedQuestionUpdate = {
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
                  setConfig({...config, faq: newFaqs});
                }}
                onRemove={() => {
                  const newFaqs = config.faq.filter((_, i) => i !== index);
                  setConfig({...config, faq: newFaqs});
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

            {!config.preTestForm || config.preTestForm.questions?.length === 0 ? (
              <div className={styles.emptyState}>
                No hay preguntas. Haz clic en "Añadir Pregunta" para crear una.
              </div>
            ) : (
              <div className={styles.questionsContainer}>
                {config.preTestForm.questions.map((question, index) => (
                  <FormQuestionEditor
                    key={question.id ?? `question-${index}`}
                    question={question}
                    index={index}
                    onChange={(updatedQuestion) =>
                      updateQuestion('preTestForm', index, updatedQuestion as EditablePatchFormQuestion)
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

            {!config.postTestForm || config.postTestForm.questions?.length === 0 ? (
              <div className={styles.emptyState}>
                No hay preguntas. Haz clic en "Añadir Pregunta" para crear una.
              </div>
            ) : (
              <div className={styles.questionsContainer}>
                {config.postTestForm.questions.map((question, index) => (
                  <FormQuestionEditor
                    key={question.id ?? `question-${index}`}
                    question={question}
                    index={index}
                    onChange={(updatedQuestion) =>
                      updateQuestion('postTestForm', index, updatedQuestion as  EditablePatchFormQuestion)
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
            <div className={styles.sectionHeader}>
              <h3>Grupos y Protocolos</h3>
              <button
                onClick={() => {
                  const newGroup: EditablePatchGroup = {
                    id: undefined,
                    probability: 0,
                    label: 'Nuevo Grupo',
                    greeting: '',
                    allowPreviousPhase: false,
                    allowPreviousQuestion: false,
                    allowSkipQuestion: false,
                    randomizePhases: false,
                    phases: []
                  };
                  setConfig(produce(config, (draft) => {
                    draft.groups.push(newGroup);
                    setSelectedGroupIndex(draft.groups.length - 1);
                  }));
                }}
                className={styles.addButton}
              >
                + Añadir Grupo
              </button>
            </div>

            <div className={styles.groupSelector}>
              <label className={styles.label}>Seleccionar Grupo:</label>
              <select
                value={selectedGroupIndex !== null ? selectedGroupIndex : ''}
                onChange={(e) => setSelectedGroupIndex(e.target.value ? parseInt(e.target.value) : null)}
                className={styles.select}
              >
                <option value="">-- Selecciona un grupo --</option>
                {config.groups?.map((group, index) => (
                  <option key={index} value={index}>
                    {group.label || `Grupo ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroupIndex !== null && config.groups[selectedGroupIndex] && (
              <div className={styles.groupDetail}>
                <div className={styles.groupCard}>
                  <h4>Configuración del Grupo: {config.groups[selectedGroupIndex].label}</h4>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Label</label>
                    <input
                      type="text"
                      placeholder="Label del grupo"
                      value={config.groups[selectedGroupIndex].label || ''}
                      onChange={(e) => {
                        setConfig(produce(config, (draft) => {
                          draft.groups[selectedGroupIndex].label = e.target.value;
                        }));
                      }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Probabilidad</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Probabilidad"
                      value={config.groups[selectedGroupIndex].probability || 0}
                      onChange={(e) => {
                        setConfig(produce(config, (draft) => {
                          draft.groups[selectedGroupIndex].probability = parseFloat(e.target.value) || 0;
                        }));
                      }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Saludo</label>
                    <textarea
                      placeholder="Saludo"
                      value={config.groups[selectedGroupIndex].greeting || ''}
                      onChange={(e) => {
                        setConfig(produce(config, (draft) => {
                          draft.groups[selectedGroupIndex].greeting = e.target.value;
                        }));
                      }}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroupIndex].allowPreviousPhase}
                        onChange={(e) => {
                          setConfig(produce(config, (draft) => {
                            draft.groups[selectedGroupIndex].allowPreviousPhase = e.target.checked;
                          }));
                        }}
                      />
                      Permitir fase anterior
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroupIndex].allowPreviousQuestion}
                        onChange={(e) => {
                          setConfig(produce(config, (draft) => {
                            draft.groups[selectedGroupIndex].allowPreviousQuestion = e.target.checked;
                          }));
                        }}
                      />
                      Permitir pregunta anterior
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroupIndex].allowSkipQuestion}
                        onChange={(e) => {
                          setConfig(produce(config, (draft) => {
                            draft.groups[selectedGroupIndex].allowSkipQuestion = e.target.checked;
                          }));
                        }}
                      />
                      Permitir saltar pregunta
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={config.groups[selectedGroupIndex].randomizePhases}
                        onChange={(e) => {
                          setConfig(produce(config, (draft) => {
                            draft.groups[selectedGroupIndex].randomizePhases = e.target.checked;
                          }));
                        }}
                      />
                      Aleatorizar fases
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar este grupo?')) {
                        setConfig(produce(config, (draft) => {
                          draft.groups = draft.groups.filter((_, i) => i !== selectedGroupIndex);
                        }));
                        setSelectedGroupIndex(null);
                      }
                    }}
                    className={styles.removeButton}
                  >
                    Eliminar Grupo
                  </button>
                </div>

                <ProtocolEditor
                  key={selectedGroupIndex}
                  phases={config.groups[selectedGroupIndex].phases}
                  onChange={(phases) => {
                    setConfig(produce(config, (draft) => {
                      draft.groups[selectedGroupIndex].phases = phases;
                    }));
                  }}
                  allGroups={config.groups}
                  onCrossGroupPaste={(item, targetGroupIndex, targetPhaseIndex) => {
                    setConfig(produce(config, (draft) => {
                      if (item?.type === 'phase') {
                        draft.groups[targetGroupIndex].phases.push(item.data);
                      } else if (item?.type === 'question' && targetPhaseIndex !== undefined) {
                        draft.groups[targetGroupIndex].phases[targetPhaseIndex].questions.push(item.data);
                      }
                    }));
                  }}
                />
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
                      const newTranslations = {...config.translations};
                      delete newTranslations[key];
                      setConfig({...config, translations: newTranslations});
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
      <SavePopup
        status={saveStatus}
        message={saveMessage}
        onClose={handleClosePopup}
      />
      <header className={styles.header}>
        <h1>Editor de Configuración</h1>
        <button onClick={() => handleSave()} className={styles.saveButton}>
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