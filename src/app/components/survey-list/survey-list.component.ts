import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { Survey } from '../../interfaces/survey.interface';

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
  surveys: Survey[] = [];
  loading: boolean = false;
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

  goToSurvey(survey: Survey) {
    const { id, participationId } = survey;
    this.router.navigate([`/survey/answer`, id, participationId]);
  }

  goToResults(survey: Survey) {
    const { id, visualizationId } = survey;
    this.router.navigate([`/survey/result`, id, visualizationId]);
  }
}
