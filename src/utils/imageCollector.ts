import type {
  Config,
  SelectOne,
  SelectMultiple,
  Slider,
  TextShort,
  TextLong,
  ConfigUpdateWithFiles,
  ConfigUpdate,
  FormOptionUpdate,
  TestOptionUpdate,
  SelectOneUpdate,
  SelectMultipleUpdate,
  SliderUpdate,
  TextShortUpdate,
  TextLongUpdate,
  TestQuestionUpdate,
  TestPhaseUpdate,
  TestGroupUpdate,
  InformationCardUpdate,
  FrequentlyAskedQuestionUpdate,
  Image
} from "@/api";

//para trackear cambios en el editor

export type ImageState =
  | { type: 'unchanged'; value: Image | undefined } // no cambios
  | { type: 'new'; value: File } // nueva o reemplazo
  | { type: 'deleted' }; // eliminada

export type EditablePatchFormOption = FormOptionUpdate & {
  image?: ImageState;
};

export type EditablePatchOption = TestOptionUpdate & {
  image?: ImageState;
};

export type EditablePatchSelectOne = SelectOneUpdate & {
  image?: ImageState;
  options: EditablePatchFormOption[];
};

export type EditablePatchSelectMultiple = SelectMultipleUpdate & {
  image?: ImageState;
  options: EditablePatchFormOption[];
};

export type EditablePatchSlider = SliderUpdate & {
  image?: ImageState;
};

export type EditablePatchTextShort = TextShortUpdate & {
  image?: ImageState;
};

export type EditablePatchTextLong = TextLongUpdate & {
  image?: ImageState;
};

export type EditablePatchFormQuestion =
  | EditablePatchSelectOne
  | EditablePatchSelectMultiple
  | EditablePatchSlider
  | EditablePatchTextShort
  | EditablePatchTextLong;

export type EditablePatchForm = {
  id?: number;
  questions: EditablePatchFormQuestion[];
};

export type EditablePatchQuestion = TestQuestionUpdate & {
  image?: ImageState;
  options: EditablePatchOption[];
};

export type EditablePatchPhase = Omit<TestPhaseUpdate, 'questions'> & {
  questions: EditablePatchQuestion[];
};

export type EditablePatchProtocol = {
  id?: number;
  label: string;
  allowPreviousPhase: boolean;
  allowPreviousQuestion: boolean;
  allowSkipQuestion: boolean;
  phases: EditablePatchPhase[];
};

export type EditablePatchGroup = Omit<TestQuestionUpdate, 'protocol'> & {
  protocol: EditablePatchProtocol;
};

export type EditablePatchInformationCard = InformationCardUpdate & {
  icon?: ImageState;
};

export type EditablePatchConfig = {
  version: number;
  icon?: ImageState;
  title: string;
  subtitle: string;
  description: string;
  anonymous: boolean;
  informationCards: EditablePatchInformationCard[];
  informedConsent: string;
  faq: FrequentlyAskedQuestionUpdate[];
  preTestForm: EditablePatchForm;
  postTestForm: EditablePatchForm;
  groups: {
    [key: string]: EditablePatchGroup;
  };
  translations: {
    [key: string]: string;
  };
};

function createEmptyFile(): File {
  return new File([], '', { type: 'application/octet-stream' });
}

function toImageState(image: Image | undefined): ImageState | undefined {
  if (!image) return undefined;
  return { type: 'unchanged', value: image };
}

export function toEditablePatchConfig(serverConfig: Config): EditablePatchConfig {
  return {
    version: serverConfig.id,
    icon: toImageState(serverConfig.icon),
    title: serverConfig.title,
    subtitle: serverConfig.subtitle,
    description: serverConfig.description,
    anonymous: serverConfig.anonymous,
    informedConsent: serverConfig.informedConsent,

    informationCards: serverConfig.informationCards.map((card): EditablePatchInformationCard => ({
      id: card.id,
      title: card.title,
      description: card.description,
      color: card.color,
      icon: toImageState(card.icon)
    })),

    faq: serverConfig.frequentlyAskedQuestion.map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer
    })),

    preTestForm: {
      id: serverConfig.preTestForm.id,
      questions: serverConfig.preTestForm.questions.map((q): EditablePatchFormQuestion => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text,
          image: toImageState(q.image)
        };

        switch (q.type) {
          case 'select-one': {
            const sq = q as SelectOne;
            return {
              ...base,
              type: 'select-one',
              options: sq.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                image: toImageState(opt.image)
              })),
              other: sq.other
            } as EditablePatchSelectOne;
          }
          case 'select-multiple': {
            const mq = q as SelectMultiple;
            return {
              ...base,
              type: 'select-multiple',
              options: mq.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                image: toImageState(opt.image)
              })),
              min: mq.min,
              max: mq.max,
              other: mq.other
            } as EditablePatchSelectMultiple;
          }
          case 'slider':
            return {
              ...base,
              type: 'slider',
              placeholder: (q as Slider).placeholder,
              min: (q as Slider).min,
              max: (q as Slider).max,
              step: (q as Slider).step,
              labels: (q as Slider).labels
            } as EditablePatchSlider;
          case 'text-short':
            return {
              ...base,
              type: 'text-short',
              placeholder: (q as TextShort).placeholder,
              minLength: (q as TextShort).minLength,
              maxLength: (q as TextShort).maxLength
            } as EditablePatchTextShort;
          case 'text-long':
            return {
              ...base,
              type: 'text-long',
              placeholder: (q as TextLong).placeholder,
              minLength: (q as TextLong).minLength,
              maxLength: (q as TextLong).maxLength
            } as EditablePatchTextLong;
          default:
            throw new Error('Unknown question type');
        }
      })
    },

    postTestForm: {
      id: serverConfig.postTestForm.id,
      questions: serverConfig.postTestForm.questions.map((q): EditablePatchFormQuestion => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text,
          image: toImageState(q.image)
        };

        switch (q.type) {
          case 'select-one': {
            const sq = q as SelectOne;
            return {
              ...base,
              type: 'select-one',
              options: sq.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                image: toImageState(opt.image)
              })),
              other: sq.other
            } as EditablePatchSelectOne;
          }
          case 'select-multiple': {
            const mq = q as SelectMultiple;
            return {
              ...base,
              type: 'select-multiple',
              options: mq.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                image: toImageState(opt.image)
              })),
              min: mq.min,
              max: mq.max,
              other: mq.other
            } as EditablePatchSelectMultiple;
          }
          case 'slider':
            return {
              ...base,
              type: 'slider',
              placeholder: (q as Slider).placeholder,
              min: (q as Slider).min,
              max: (q as Slider).max,
              step: (q as Slider).step,
              labels: (q as Slider).labels
            } as EditablePatchSlider;
          case 'text-short':
            return {
              ...base,
              type: 'text-short',
              placeholder: (q as TextShort).placeholder,
              minLength: (q as TextShort).minLength,
              maxLength: (q as TextShort).maxLength
            } as EditablePatchTextShort;
          case 'text-long':
            return {
              ...base,
              type: 'text-long',
              placeholder: (q as TextLong).placeholder,
              minLength: (q as TextLong).minLength,
              maxLength: (q as TextLong).maxLength
            } as EditablePatchTextLong;
          default:
            throw new Error('Unknown question type');
        }
      })
    },

    groups: Object.keys(serverConfig.groups).reduce((acc, key) => {
      const group = serverConfig.groups[key];
      acc[key] = {
        id: group.id,
        probability: group.probability,
        label: group.label,
        greeting: group.greeting,
        protocol: {
          id: group.protocol.id,
          label: group.protocol.label,
          allowPreviousPhase: group.protocol.allowPreviousPhase,
          allowPreviousQuestion: group.protocol.allowPreviousQuestion,
          allowSkipQuestion: group.protocol.allowSkipQuestion,
          phases: group.protocol.phases.map((phase): EditablePatchPhase => ({
            id: phase.id,
            questions: phase.questions.map((q): EditablePatchQuestion => ({
              id: q.id,
              text: q.text,
              image: toImageState(q.image),
              options: q.options.map((opt): EditablePatchOption => ({
                id: opt.id,
                text: opt.text,
                correct: opt.correct,
                image: toImageState(opt.image)
              }))
            }))
          }))
        }
      };
      return acc;
    }, {} as { [key: string]: EditablePatchGroup }),

    translations: serverConfig.translations
  };
}

function resolveImageToFile(imageState: ImageState | undefined): File | undefined {
  if (!imageState) return undefined;

  switch (imageState.type) {
    case 'unchanged':
      return undefined;
    case 'new':
      return imageState.value;
    case 'deleted':
      return new File([], '', { type: 'application/octet-stream' });
  }
}

function extractFormImages(questions: EditablePatchFormQuestion[]): Record<string, File> {
  const changes: Record<string, File> = {};
  let index = 0;

  for (const question of questions) {
    const questionFile = resolveImageToFile(question.image);
    if (questionFile !== undefined) {
      if (questionFile.size === 0) {
        changes[index.toString()] = createEmptyFile();
      } else {
        changes[index.toString()] = questionFile;
      }
    }
    index++;

    if ('options' in question && question.options) {
      for (const option of question.options) {
        const optionFile = resolveImageToFile(option.image);
        if (optionFile !== undefined) {
          if (optionFile.size === 0) {
            changes[index.toString()] = createEmptyFile();
          } else {
            changes[index.toString()] = optionFile;
          }
        }
        index++;
      }
    }
  }

  return changes;
}

function extractGroupImages(groups: { [key: string]: EditablePatchGroup }): Record<string, File> {
  const changes: Record<string, File> = {};
  const groupKeys = Object.keys(groups).sort();
  let index = 0;

  for (const groupKey of groupKeys) {
    const group = groups[groupKey];
    if (!group.protocol?.phases) continue;

    for (const phase of group.protocol.phases) {
      if (!phase.questions) continue;

      for (const question of phase.questions) {
        const questionFile = resolveImageToFile(question.image);
        if (questionFile !== undefined) {
          if (questionFile.size === 0) {
            changes[index.toString()] = createEmptyFile();
          } else {
            changes[index.toString()] = questionFile;
          }
        }
        index++;

        for (const option of question.options) {
          const optionFile = resolveImageToFile(option.image);
          if (optionFile !== undefined) {
            if (optionFile.size === 0) {
              changes[index.toString()] = createEmptyFile();
            } else {
              changes[index.toString()] = optionFile;
            }
          }
          index++;
        }
      }
    }
  }

  return changes;
}

function extractInformationCardImages(cards: EditablePatchInformationCard[]): Record<string, File> {
  const changes: Record<string, File> = {};

  cards.forEach((card, index) => {
    const file = resolveImageToFile(card.icon);
    if (file !== undefined) {
      if (file.size === 0) {
        changes[index.toString()] = createEmptyFile();
      } else {
        changes[index.toString()] = file;
      }
    }
  });

  return changes;
}

export function toPatchLastConfig(config: EditablePatchConfig): ConfigUpdate {
  return {
    version: config.version,
    title: config.title,
    subtitle: config.subtitle,
    description: config.description,
    anonymous: config.anonymous,
    informedConsent: config.informedConsent,

    informationCards: config.informationCards.map((card): InformationCardUpdate => ({
      id: card.id,
      title: card.title,
      description: card.description,
      color: card.color
    })),

    faq: config.faq,

    preTestForm: {
      id: config.preTestForm.id,
      questions: config.preTestForm.questions.map((q): any => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text,
          type: q.type
        };

        switch (q.type) {
          case 'select-one':
            return {
              ...base,
              options: (q as EditablePatchSelectOne).options.map((opt): FormOptionUpdate => ({
                id: opt.id,
                text: opt.text
              })),
              other: (q as EditablePatchSelectOne).other
            };
          case 'select-multiple':
            return {
              ...base,
              options: (q as EditablePatchSelectMultiple).options.map((opt): FormOptionUpdate => ({
                id: opt.id,
                text: opt.text
              })),
              min: (q as EditablePatchSelectMultiple).min,
              max: (q as EditablePatchSelectMultiple).max,
              other: (q as EditablePatchSelectMultiple).other
            };
          case 'slider':
            return {
              ...base,
              placeholder: (q as EditablePatchSlider).placeholder,
              min: (q as EditablePatchSlider).min,
              max: (q as EditablePatchSlider).max,
              step: (q as EditablePatchSlider).step,
              labels: (q as EditablePatchSlider).labels
            };
          case 'text-short':
            return {
              ...base,
              placeholder: (q as EditablePatchTextShort).placeholder,
              minLength: (q as EditablePatchTextShort).minLength,
              maxLength: (q as EditablePatchTextShort).maxLength
            };
          case 'text-long':
            return {
              ...base,
              placeholder: (q as EditablePatchTextLong).placeholder,
              minLength: (q as EditablePatchTextLong).minLength,
              maxLength: (q as EditablePatchTextLong).maxLength
            };
        }
      })
    },

    postTestForm: {
      id: config.postTestForm.id,
      questions: config.postTestForm.questions.map((q): any => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text,
          type: q.type
        };

        switch (q.type) {
          case 'select-one':
            return {
              ...base,
              options: (q as EditablePatchSelectOne).options.map((opt): FormOptionUpdate => ({
                id: opt.id,
                text: opt.text
              })),
              other: (q as EditablePatchSelectOne).other
            };
          case 'select-multiple':
            return {
              ...base,
              options: (q as EditablePatchSelectMultiple).options.map((opt): FormOptionUpdate => ({
                id: opt.id,
                text: opt.text
              })),
              min: (q as EditablePatchSelectMultiple).min,
              max: (q as EditablePatchSelectMultiple).max,
              other: (q as EditablePatchSelectMultiple).other
            };
          case 'slider':
            return {
              ...base,
              placeholder: (q as EditablePatchSlider).placeholder,
              min: (q as EditablePatchSlider).min,
              max: (q as EditablePatchSlider).max,
              step: (q as EditablePatchSlider).step,
              labels: (q as EditablePatchSlider).labels
            };
          case 'text-short':
            return {
              ...base,
              placeholder: (q as EditablePatchTextShort).placeholder,
              minLength: (q as EditablePatchTextShort).minLength,
              maxLength: (q as EditablePatchTextShort).maxLength
            };
          case 'text-long':
            return {
              ...base,
              placeholder: (q as EditablePatchTextLong).placeholder,
              minLength: (q as EditablePatchTextLong).minLength,
              maxLength: (q as EditablePatchTextLong).maxLength
            };
        }
      })
    },

    groups: Object.keys(config.groups).reduce((acc, key) => {
      const group = config.groups[key];
      acc[key] = {
        id: group.id,
        probability: group.probability ?? 0,
        label: group.label,
        greeting: group.greeting,
        protocol: group.protocol ? {
          id: group.protocol.id,
          label: group.protocol.label,
          allowPreviousPhase: group.protocol.allowPreviousPhase,
          allowPreviousQuestion: group.protocol.allowPreviousQuestion,
          allowSkipQuestion: group.protocol.allowSkipQuestion,
          phases: group.protocol.phases.map((phase): TestPhaseUpdate => ({
            id: phase.id,
            questions: phase.questions.map((q): TestQuestionUpdate => ({
              id: q.id,
              text: q.text,
              options: q.options.map((opt): TestOptionUpdate => ({
                id: opt.id,
                text: opt.text,
                correct: opt.correct
              }))
            }))
          }))
        } : undefined
      } as TestGroupUpdate;
      return acc;
    }, {} as { [key: string]: TestGroupUpdate }),

    translations: config.translations
  };
}

export function buildPatchRequest(config: EditablePatchConfig): ConfigUpdateWithFiles {
  const appIcon = resolveImageToFile(config.icon);

  return {
    appIcon: appIcon && appIcon.size > 0 ? appIcon : undefined,
    preTestFormQuestionOptionsFiles: extractFormImages(config.preTestForm.questions),
    postTestFormQuestionOptionsFiles: extractFormImages(config.postTestForm.questions),
    groupQuestionOptionsFiles: extractGroupImages(config.groups),
    informationCardFiles: extractInformationCardImages(config.informationCards),
    updateLastConfig: toPatchLastConfig(config)
  };
}