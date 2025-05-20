export interface CreateAnswersDto {
  participationId: string;
  answers: CreateSingleAnswerDto[];
}

export interface CreateSingleAnswerDto {
  questionId: number;
  text?: string;
  selectedOptions?: string[];
}
