import { Question } from "../../interfaces/question.interface";

export interface CreateSurveyDto {
  title: string;
  questions: Question[];
}
