import { Question } from "../../interfaces/question.interface";

export interface SurveyParticipationResponseDto {
  id: number;
  participationId: string;
  visualizationId: string;
  title: string;
  questions: Question[];
}
