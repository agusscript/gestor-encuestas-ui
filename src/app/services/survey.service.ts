import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SurveyParticipationResponseDto } from '../dtos/response/survey-participation-response.dto';
import { SurveyVisualizationResponseDto } from '../dtos/response/survey-visualization-response.dto';
import { CreateSurveyDto } from '../dtos/request/create-survey.dto';
import { CreateSurveyResponseDto } from '../dtos/response/create-survey-response.dto';
import { CreateAnswersDto } from '../dtos/request/create-answers.dto';
import { CreateAnswerResponseDto } from '../dtos/response/create-answer-response.dto';
import { Survey } from '../interfaces/survey.interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private apiUrl = '/api/v1';
  private http = inject(HttpClient);

  findAll(): Observable<Survey[]> {
    return this.http.get<Survey[]>(
      `${this.apiUrl}/survey`
    );
  }

  findOneByParticipationId(id: string): Observable<SurveyParticipationResponseDto> {
    return this.http.get<SurveyParticipationResponseDto>(
      `${this.apiUrl}/survey/participation/${id}`
    );
  }

  findOneByVisualizationId(id: string): Observable<SurveyVisualizationResponseDto> {
    return this.http.get<SurveyVisualizationResponseDto>(
      `${this.apiUrl}/survey/visualization/${id}`
    );
  }

  create(data: CreateSurveyDto): Observable<CreateSurveyResponseDto> {
    return this.http.post<CreateSurveyResponseDto>(
      `${this.apiUrl}/survey`, data
    );
  }

  submitAnswers(data: CreateAnswersDto): Observable<CreateAnswerResponseDto[]> {
    return this.http.post<CreateAnswerResponseDto[]>(
      `${this.apiUrl}/answer`, data
    );
  }
}
