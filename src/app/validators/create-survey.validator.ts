import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormArray,
} from '@angular/forms';

export const atLeastOneQuestionValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const questions = control.get('questions') as FormArray;
  if (!questions || questions.length === 0) {
    return { noQuestions: true };
  }
  return null;
};

export const atLeastTwoOptionsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const questions = control.get('questions');

  if (!questions || !(questions.value instanceof Array)) {
    return { invalidQuestions: true };
  }

  const questionArray = questions.value;

  if (questionArray.length === 0) {
    return { noQuestions: true };
  }

  for (let i = 0; i < questionArray.length; i++) {
    const question = questionArray[i];
    const isOpenType = question.type === 'open';

    if (!isOpenType) {
      const options = question.options || [];
      if (options.length < 2) {
        return { notEnoughOptions: true };
      }
    }
  }

  return null;
};
