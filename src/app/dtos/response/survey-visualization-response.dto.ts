import { QuestionType } from "../../enums/question-type.enum";
import { Answer } from "../../interfaces/answer.interface";

export interface SurveyVisualizationResponseDto {
  id: number;
  participationId: string;
  visualizationId: string;
  title: string;
  questions: QuestionResponseDto[];
}

export interface QuestionResponseDto {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  answers?: Answer[];
}
