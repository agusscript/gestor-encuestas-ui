import { Question } from "./question.interface"

export interface Survey {
  id: number;
  title: string;
  participationId: string;
  visualizationId: string;
  questions: Question[];
}
