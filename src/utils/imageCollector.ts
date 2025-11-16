import type {
  FullConfig,
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

export type ImageState =
  | { type: 'unchanged'; value: Image | undefined }
  | { type: 'new'; value: File }
  | { type: 'deleted' };

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
  title?: string;
  questions: EditablePatchFormQuestion[];
};

export type EditablePatchQuestion = TestQuestionUpdate & {
  image?: ImageState;
  options: EditablePatchOption[];
};

export type EditablePatchPhase = Omit<TestPhaseUpdate, 'questions'> & {
  questions: EditablePatchQuestion[];
};

export type EditablePatchGroup = Omit<TestGroupUpdate, 'phases'> & {
  phases: EditablePatchPhase[];
};

export type EditablePatchInformationCard = InformationCardUpdate & {
  icon?: ImageState;
};

export type EditablePatchConfig = {
  icon?: ImageState | null;
  title: string;
  subtitle?: string | null;
  description: string;
  anonymous: boolean;
  informationCards: EditablePatchInformationCard[];
  informedConsent: string;
  faq: FrequentlyAskedQuestionUpdate[];
  preTestForm?: EditablePatchForm | null;
  postTestForm?: EditablePatchForm | null;
  groups: EditablePatchGroup[];
  translations: {
    [key: string]: string;
  };
};

const imageCache = new Map<string, File>();

function toImageState(image: Image | undefined | null): ImageState | undefined {
  if (!image) return undefined;
  return { type: 'unchanged', value: image };
}

function extractAllImageUrls(serverConfig: FullConfig): string[] {
  const urls: string[] = [];

  if (serverConfig.icon?.url) {
    urls.push(serverConfig.icon.url);
  }

  serverConfig.informationCards.forEach(card => {
    if (card.icon?.url) urls.push(card.icon.url);
  });

  [serverConfig.preTestForm, serverConfig.postTestForm].forEach(form => {
    if (!form) return;
    form.questions.forEach(q => {
      if (q.image?.url) urls.push(q.image.url);
      if ('options' in q && q.options) {
        q.options.forEach(opt => {
          if (opt.image?.url) urls.push(opt.image.url);
        });
      }
    });
  });

  serverConfig.groups.forEach(group => {
    group.phases.forEach(phase => {
      phase.questions.forEach(question => {
        if (question.image?.url) urls.push(question.image.url);
        question.options.forEach(option => {
          if (option.image?.url) urls.push(option.image.url);
        });
      });
    });
  });

  return urls;
}

export async function preloadImages(serverConfig: FullConfig): Promise<void> {
  const urls = extractAllImageUrls(serverConfig);
  const uniqueUrls = [...new Set(urls)];

  await Promise.all(uniqueUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return;
      }

      const urlParts = url.split("/");
      const blob = await response.blob();
      const file = new File([blob], urlParts[urlParts.length - 1] ?? "file", { type: blob.type });
      imageCache.set(url, file);
    } catch (error) {
      console.error(error);
    }
  }));
}

export function getImageFile(imageState: ImageState | undefined): File | undefined {
  if (!imageState || imageState.type === 'deleted') return undefined;

  if (imageState.type === 'unchanged') {
    if (imageState.value?.url && imageCache.has(imageState.value.url)) {
      return imageCache.get(imageState.value.url)!;
    }
    return undefined;
  }

  return imageState.value;
}

export function clearImageCache() {
  imageCache.clear();
}

export function toEditablePatchConfig(serverConfig: FullConfig): EditablePatchConfig {
  return {
    icon: toImageState(serverConfig.icon),
    title: serverConfig.title,
    subtitle: serverConfig.subtitle ?? "",
    description: serverConfig.description,
    anonymous: serverConfig.anonymous,
    informedConsent: serverConfig.informedConsent,

    informationCards: serverConfig.informationCards.map((card): EditablePatchInformationCard => ({
      id: card.id,
      title: card.title,
      description: card.description,
      color: card.color ?? 0,
      icon: toImageState(card.icon)
    })),

    faq: serverConfig.frequentlyAskedQuestion.map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer
    })),

    preTestForm: serverConfig.preTestForm ? {
      id: serverConfig.preTestForm.id,
      questions: serverConfig.preTestForm.questions.map((q): EditablePatchFormQuestion => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text ?? "",
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
                text: opt.text ?? "",
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
                text: opt.text ?? "",
                image: toImageState(opt.image)
              })),
              min: mq.min,
              max: mq.max,
              other: mq.other
            } as EditablePatchSelectMultiple;
          }
          case 'slider': {
            const sl = q as Slider;
            return {
              ...base,
              type: 'slider',
              min: sl.min,
              max: sl.max,
              step: sl.step,
              labels: sl.labels
            } as EditablePatchSlider;
          }
          case 'text-short': {
            const ts = q as TextShort;
            return {
              ...base,
              type: 'text-short',
              placeholder: ts.placeholder,
              minLength: ts.minLength,
              maxLength: ts.maxLength
            } as EditablePatchTextShort;
          }
          case 'text-long': {
            const tl = q as TextLong;
            return {
              ...base,
              type: 'text-long',
              placeholder: tl.placeholder,
              minLength: tl.minLength,
              maxLength: tl.maxLength
            } as EditablePatchTextLong;
          }
          default:
            throw new Error('Unknown question type');
        }
      })
    } : null,

    postTestForm: serverConfig.postTestForm ? {
      id: serverConfig.postTestForm.id,
      questions: serverConfig.postTestForm.questions.map((q): EditablePatchFormQuestion => {
        const base = {
          id: q.id,
          category: q.category,
          text: q.text ?? "",
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
                text: opt.text ?? "",
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
                text: opt.text ?? "",
                image: toImageState(opt.image)
              })),
              min: mq.min,
              max: mq.max,
              other: mq.other
            } as EditablePatchSelectMultiple;
          }
          case 'slider': {
            const sl = q as Slider;
            return {
              ...base,
              type: 'slider',
              min: sl.min,
              max: sl.max,
              step: sl.step,
              labels: sl.labels
            } as EditablePatchSlider;
          }
          case 'text-short': {
            const ts = q as TextShort;
            return {
              ...base,
              type: 'text-short',
              placeholder: ts.placeholder,
              minLength: ts.minLength,
              maxLength: ts.maxLength
            } as EditablePatchTextShort;
          }
          case 'text-long': {
            const tl = q as TextLong;
            return {
              ...base,
              type: 'text-long',
              placeholder: tl.placeholder,
              minLength: tl.minLength,
              maxLength: tl.maxLength
            } as EditablePatchTextLong;
          }
          default:
            throw new Error('Unknown question type');
        }
      })
    } : null,

    groups: serverConfig.groups.map((group): EditablePatchGroup => ({
      id: group.id,
      probability: group.probability,
      label: group.label,
      greeting: group.greeting ?? "",
      allowPreviousPhase: group.allowPreviousPhase,
      allowPreviousQuestion: group.allowPreviousQuestion,
      allowSkipQuestion: group.allowSkipQuestion,
      randomizePhases: group.randomizePhases,
      phases: group.phases.map((phase): EditablePatchPhase => ({
        id: phase.id,
        randomizeQuestions: phase.randomizeQuestions,
        questions: phase.questions.map((q): EditablePatchQuestion => ({
          id: q.id,
          text: q.text ?? "",
          image: toImageState(q.image),
          randomizeOptions: q.randomizeOptions,
          options: q.options.map((opt): EditablePatchOption => ({
            id: opt.id,
            text: opt.text ?? "",
            correct: opt.correct,
            image: toImageState(opt.image)
          }))
        }))
      }))
    })),

    translations: serverConfig.translations.reduce((acc, t) => {
      acc[t.key] = t.value ?? "";
      return acc;
    }, {} as { [key: string]: string })
  };
}

async function resolveImageToFile(imageState: ImageState | undefined | null): Promise<File> {
  if (!imageState) return new File([], ".png");

  switch (imageState.type) {
    case 'unchanged':
      if (imageState.value?.url && imageCache.has(imageState.value.url)) {
        return imageCache.get(imageState.value.url)!;
      }
      return new File([], ".png");

    case 'new':
      return imageState.value;

    case 'deleted':
      return new File([], ".png");
  }
}

async function extractFormImages(questions: EditablePatchFormQuestion[]): Promise<File[]> {
  const images: File[] = [];

  for (const question of questions) {
    images.push(await resolveImageToFile(question.image));

    if ('options' in question && question.options) {
      for (const option of question.options) {
        images.push(await resolveImageToFile(option.image));
      }
    }
  }

  return images;
}

async function extractGroupImages(groups: EditablePatchGroup[]): Promise<File[]> {
  const images: File[] = [];

  for (const group of groups) {
    if (!group.phases) continue;

    for (const phase of group.phases) {
      if (!phase.questions) continue;

      for (const question of phase.questions) {
        images.push(await resolveImageToFile(question.image));

        for (const option of question.options) {
          images.push(await resolveImageToFile(option.image));
        }
      }
    }
  }

  return images;
}

async function extractInformationCardImages(cards: EditablePatchInformationCard[]): Promise<File[]> {
  const images: File[] = [];
  for (const card of cards) {
    images.push(await resolveImageToFile(card.icon));
  }
  return images;
}

export function toPatchConfig(config: EditablePatchConfig): ConfigUpdate {
  return {
    title: config.title,
    subtitle: config.subtitle ?? "",
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

    preTestForm: config.preTestForm ? {
      id: config.preTestForm.id,
      title: config.preTestForm.title,
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
    } : undefined,

    postTestForm: config.postTestForm ? {
      id: config.postTestForm.id,
      title: config.postTestForm.title,
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
    } : undefined,

    groups: config.groups.map((group): TestGroupUpdate => ({
      id: group.id,
      probability: group.probability ?? 0,
      label: group.label,
      greeting: group.greeting,
      allowPreviousPhase: group.allowPreviousPhase,
      allowPreviousQuestion: group.allowPreviousQuestion,
      allowSkipQuestion: group.allowSkipQuestion,
      randomizePhases: group.randomizePhases,
      phases: group.phases.map((phase): TestPhaseUpdate => ({
        id: phase.id,
        randomizeQuestions: phase.randomizeQuestions,
        questions: phase.questions.map((q): TestQuestionUpdate => ({
          id: q.id,
          text: q.text,
          randomizeOptions: q.randomizeOptions,
          options: q.options.map((opt): TestOptionUpdate => ({
            id: opt.id,
            text: opt.text,
            correct: opt.correct
          }))
        }))
      }))
    })),

    translations: config.translations
  };
}

export async function buildPatchRequest(config: EditablePatchConfig): Promise<ConfigUpdateWithFiles> {
  const [
    appIcon,
    preTestFormImages,
    postTestFormImages,
    groupImages,
    informationCardImages
  ] = await Promise.all([
    resolveImageToFile(config.icon),
    extractFormImages(config.preTestForm?.questions ?? []),
    extractFormImages(config.postTestForm?.questions ?? []),
    extractGroupImages(config.groups),
    extractInformationCardImages(config.informationCards)
  ]);

  return {
    icon: appIcon,
    preTestFormImages,
    postTestFormImages,
    groupImages,
    informationCardImages,
    payload: toPatchConfig(config)
  };
}
