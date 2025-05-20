import { QuestionType } from "../enums/question-type.enum";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
}
