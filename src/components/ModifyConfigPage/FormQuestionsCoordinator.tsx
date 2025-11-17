import { produce } from 'immer';
import { FormQuestionsManager } from '@/components/ModifyConfigPage/FormQuestionsManager.tsx';
import type { EditablePatchConfig, EditablePatchFormQuestion } from "@/utils/imageCollector.ts";

type FormQuestionsCoordinatorProps = {
  config: EditablePatchConfig;
  setConfig: (config: EditablePatchConfig) => void;
  formType: 'preTestForm' | 'postTestForm';
};

export function FormQuestionsCoordinator({ config, setConfig, formType }: FormQuestionsCoordinatorProps) {
  const form = formType === 'preTestForm' ? config.preTestForm : config.postTestForm;
  const questions = form?.questions || [];

  const handleQuestionsChange = (newQuestions: EditablePatchFormQuestion[]) => {
    setConfig(produce(config, (draft) => {
      if (formType === 'preTestForm') {
        if (!draft.preTestForm) {
          draft.preTestForm = { id: undefined, questions: [] };
        }
        draft.preTestForm.questions = newQuestions;
      } else {
        if (!draft.postTestForm) {
          draft.postTestForm = { id: undefined, questions: [] };
        }
        draft.postTestForm.questions = newQuestions;
      }
    }));
  };

  const handleCopyToOtherForm = (question: EditablePatchFormQuestion, targetForm: 'preTestForm' | 'postTestForm') => {
    setConfig(produce(config, (draft) => {
      if (targetForm === 'preTestForm') {
        if (!draft.preTestForm) {
          draft.preTestForm = { id: undefined, questions: [] };
        }
        draft.preTestForm.questions.push(question);
      } else {
        if (!draft.postTestForm) {
          draft.postTestForm = { id: undefined, questions: [] };
        }
        draft.postTestForm.questions.push(question);
      }
    }));
  };

  return (
    <FormQuestionsManager
      formType={formType}
      questions={questions}
      onChange={handleQuestionsChange}
      onCopyToOtherForm={handleCopyToOtherForm}
    />
  );
}
