import { QuestionType } from "../enums/question-type.enum";

export interface AnswerVisualization {
  label: string;
  answers: SingleAnswer[];
}

export interface SingleAnswer {
  question: string;
  type: QuestionType;
  response: string | undefined;
  selectedOptions: string[] | undefined;
}
