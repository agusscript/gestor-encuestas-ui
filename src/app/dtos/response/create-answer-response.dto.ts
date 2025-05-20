import { Question } from "../../interfaces/question.interface";

export interface CreateAnswerResponseDto {
  id: number;
  text: string;
  selectedOptions: string[];
  question: Question;
}
