import type {
  EditablePatchPhase,
  EditablePatchQuestion,
  EditablePatchOption,
  ImageState
} from '@/utils/imageCollector.ts';
import { getImageFile } from '@/utils/imageCollector.ts';

let fileCounter = 0;

function generateUniqueFileName(): string {
  return `${Date.now()}_${++fileCounter}.png`;
}

function cloneImageState(image: ImageState | undefined): ImageState | undefined {
  if (!image) return undefined;

  if (image.type === 'deleted') return undefined;

  const file = image.type === 'unchanged' ? getImageFile(image) : image.value;
  if (!file) return undefined;

  const uniqueName = generateUniqueFileName();
  return { type: 'new', value: new File([file], uniqueName, { type: file.type }) };
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
