import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { CreateSurveyResponseDto } from '../../dtos/response/create-survey-response.dto';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    LoadingComponent,
    ErrorMessageComponent
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.css'
})
export class SurveyListComponent implements OnInit {
  surveys: CreateSurveyResponseDto[] = [];
  loading = false;
  error: string | null = null;

  private surveyService = inject(SurveyService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.surveyService.findAll().subscribe({
      next: (data) => {
        this.surveys = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando encuestas';
        this.loading = false;
      }
    });
  }

  goToSurvey(survey: CreateSurveyResponseDto) {
    const { id, participationId, visualizationId } = survey;
    this.router.navigate([`/survey/answer`, id, participationId]);
  }

  goToResults(survey: CreateSurveyResponseDto) {
    const { id, participationId, visualizationId } = survey;
    this.router.navigate([`/survey/result`, id, visualizationId]);
  }
}
