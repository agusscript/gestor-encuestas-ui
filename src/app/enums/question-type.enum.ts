export enum QuestionType {
  OPEN = 'open',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
}

export enum QuestionTypeLabel {
  OPEN = 'Pregunta Abierta',
  SINGLE_CHOICE = 'Elección Única',
  MULTIPLE_CHOICE = 'Elección Múltiple',
}

export const questionTypeOptions = [
  { label: QuestionTypeLabel.OPEN, value: QuestionType.OPEN },
  { label: QuestionTypeLabel.SINGLE_CHOICE, value: QuestionType.SINGLE_CHOICE },
  { label: QuestionTypeLabel.MULTIPLE_CHOICE, value: QuestionType.MULTIPLE_CHOICE },
];
