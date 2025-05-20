export interface RawSurveyAnswer {
  participationId: string;
  answers: RawAnswer[];
}

export interface RawAnswer {
  questionId: number;
  response: string | string[];
}
