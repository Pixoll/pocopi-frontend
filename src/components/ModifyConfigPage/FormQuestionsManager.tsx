import {useState} from 'react';
import {FormQuestionEditor} from '@/components/ModifyConfigPage/FormQuestionEditor.tsx';
import {FormDestinationModal} from '@/components/ModifyConfigPage/FormDestinationModal.tsx';
import {ConfirmModal} from "@/components/ConfirmModal.tsx";
import type {
  EditablePatchFormQuestion,
  EditablePatchSelectOne,
  EditablePatchSelectMultiple,
  EditablePatchSlider,
  EditablePatchTextShort,
  EditablePatchTextLong,
  EditablePatchFormOption,
  ImageState
} from "@/utils/imageCollector.ts";
import {getImageFile} from '@/utils/imageCollector.ts';
import styles from "@/styles/ModifyConfigPage/FormQuestionsManager.module.css";

type FormQuestionsManagerProps = {
  formType: 'preTestForm' | 'postTestForm';
  questions: EditablePatchFormQuestion[];
  onChange: (questions: EditablePatchFormQuestion[]) => void;
  onCopyToOtherForm?: (question: EditablePatchFormQuestion, targetForm: 'preTestForm' | 'postTestForm') => void;
  readOnly: boolean;
};

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
  return {type: 'new', value: new File([file], uniqueName, {type: file.type})};
}

function cloneFormOption(option: EditablePatchFormOption): EditablePatchFormOption {
  return {
    id: undefined,
    text: option.text,
    image: cloneImageState(option.image)
  };
}

export function FormQuestionsManager({
                                       formType,
                                       questions,
                                       onChange,
                                       onCopyToOtherForm,
                                       readOnly,
                                     }: FormQuestionsManagerProps) {
  const [formClipboard, setFormClipboard] = useState<EditablePatchFormQuestion | null>(null);
  const [showFormDestinationModal, setShowFormDestinationModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const formTitle = formType === 'preTestForm' ? 'Formulario Pre-Test' : 'Formulario Post-Test';

  const cloneFormQuestion = (question: EditablePatchFormQuestion): EditablePatchFormQuestion => {
    const baseClone = {
      id: undefined,
      category: question.category,
      text: question.text,
      image: cloneImageState(question.image),
      type: question.type
    };

    switch (question.type) {
      case 'select-one': {
        const q = question as EditablePatchSelectOne;
        return {
          ...baseClone,
          type: 'select-one',
          options: q.options?.map(cloneFormOption) || [],
          other: q.other
        } as EditablePatchSelectOne;
      }
      case 'select-multiple': {
        const q = question as EditablePatchSelectMultiple;
        return {
          ...baseClone,
          type: 'select-multiple',
          options: q.options?.map(cloneFormOption) || [],
          min: q.min,
          max: q.max,
          other: q.other
        } as EditablePatchSelectMultiple;
      }
      case 'slider': {
        const q = question as EditablePatchSlider;
        return {
          ...baseClone,
          type: 'slider',
          min: q.min,
          max: q.max,
          step: q.step,
          labels: q.labels?.map(l => ({...l})) || []
        } as EditablePatchSlider;
      }
      case 'text-short': {
        const q = question as EditablePatchTextShort;
        return {
          ...baseClone,
          type: 'text-short',
          placeholder: q.placeholder,
          minLength: q.minLength,
          maxLength: q.maxLength
        } as EditablePatchTextShort;
      }
      case 'text-long': {
        const q = question as EditablePatchTextLong;
        return {
          ...baseClone,
          type: 'text-long',
          placeholder: q.placeholder,
          minLength: q.minLength,
          maxLength: q.maxLength
        } as EditablePatchTextLong;
      }
      default:
        return baseClone as EditablePatchFormQuestion;
    }
  };

  const addQuestion = () => {
    const newQuestion: EditablePatchFormQuestion = {
      id: undefined,
      category: '',
      text: '',
      image: undefined,
      type: 'select-one',
      options: [],
      other: false
    } as EditablePatchSelectOne;

    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: EditablePatchFormQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onChange(newQuestions);
    setShowDeleteConfirm(false);
    setPendingDeleteIndex(null);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const clonedQuestion = cloneFormQuestion(questionToDuplicate);
    const newQuestions = [
      ...questions.slice(0, index + 1),
      clonedQuestion,
      ...questions.slice(index + 1)
    ];
    onChange(newQuestions);
  };

  const copyQuestion = (index: number) => {
    const questionToCopy = questions[index];
    const clonedQuestion = cloneFormQuestion(questionToCopy);
    setFormClipboard(clonedQuestion);
    setShowFormDestinationModal(true);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= questions.length) return;

    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[toIndex]] = [newQuestions[toIndex], newQuestions[index]];
    onChange(newQuestions);
  };

  const handleDeleteClick = (index: number) => {
    setPendingDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const handlePasteToOtherForm = (targetForm: 'preTestForm' | 'postTestForm') => {
    if (formClipboard && onCopyToOtherForm) {
      onCopyToOtherForm(formClipboard, targetForm);
    }
    setShowFormDestinationModal(false);
    setFormClipboard(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{formTitle}</h3>
        <button onClick={addQuestion} className={styles.addButton}>
          + Añadir Pregunta
        </button>
      </div>

      {!questions || questions.length === 0 ? (
        <div className={styles.emptyState}>
          No hay preguntas. Haz clic en "Añadir Pregunta" para crear una.
        </div>
      ) : (
        <div className={styles.questionsContainer}>
          {questions.map((question, index) => (
            <FormQuestionEditor
              key={question.id ?? `question-${index}`}
              question={question}
              index={index}
              onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
              onRemove={() => handleDeleteClick(index)}
              onDuplicate={() => duplicateQuestion(index)}
              onCopy={() => copyQuestion(index)}
              onMoveUp={index > 0 ? () => moveQuestion(index, 'up') : undefined}
              onMoveDown={index < questions.length - 1 ? () => moveQuestion(index, 'down') : undefined}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {readOnly && (
        <FormDestinationModal
          isOpen={showFormDestinationModal}
          onClose={() => {
            setShowFormDestinationModal(false);
            setFormClipboard(null);
          }}
          onConfirm={handlePasteToOtherForm}
          title="Copiar pregunta a..."
          currentForm={formType}
          questionToPaste={formClipboard}
        />
      )}
      {readOnly && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setPendingDeleteIndex(null);
          }}
          onConfirm={() => {
            if (pendingDeleteIndex !== null) {
              removeQuestion(pendingDeleteIndex);
            }
          }}
          title="Confirmar Eliminación"
          message="¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer."
        />
      )}
    </div>
  );
}
