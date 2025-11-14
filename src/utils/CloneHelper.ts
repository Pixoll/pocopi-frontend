import type {
  EditablePatchPhase,
  EditablePatchQuestion,
  EditablePatchOption,
  ImageState
} from '@/utils/imageCollector.ts';

function cloneImageState(image: ImageState | undefined): ImageState | undefined {
  if (!image) return undefined;

  if (image.type === 'unchanged') {
    return { type: 'unchanged', value: undefined };
  }

  return { ...image };
}

export function cloneOption(option: EditablePatchOption): EditablePatchOption {
  return {
    text: option.text,
    correct: option.correct,
    image: cloneImageState(option.image),
    id: undefined
  };
}

export function cloneQuestion(question: EditablePatchQuestion): EditablePatchQuestion {
  return {
    text: question.text,
    randomizeOptions: question.randomizeOptions,
    image: cloneImageState(question.image),
    options: question.options.map(cloneOption),
    id: undefined
  };
}

export function clonePhase(phase: EditablePatchPhase): EditablePatchPhase {
  return {
    randomizeQuestions: phase.randomizeQuestions,
    questions: phase.questions.map(cloneQuestion),
    id: undefined
  };
}