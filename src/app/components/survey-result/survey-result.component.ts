import { QuestionResponseDto, SurveyVisualizationResponseDto } from '../../dtos/response/survey-visualization-response.dto';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../../services/survey.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AnswerVisualization } from '../../interfaces/answer-visualization.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-survey-result',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './survey-result.component.html',
  styleUrl: './survey-result.component.css',
})
export class SurveyResultComponent implements OnInit {
  survey: SurveyVisualizationResponseDto | null = null;
  groupedAnswers: AnswerVisualization[] = [];
  expandedCards: boolean[] = [];

  surveyService = inject(SurveyService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    const visualizationId = this.route.snapshot.paramMap.get('visualizationId');

    if (visualizationId) {
      this.surveyService.findOneByVisualizationId(visualizationId).subscribe({
        next: (data) => {
          this.survey = data;
          this.groupAnswersByIndex(data.questions);
        },
        error: () => (this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los resultados'
        }))
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de visualización inválido'
      });
    }

    if (this.groupedAnswers) {
      this.expandedCards = new Array(this.groupedAnswers.length).fill(false);
    }
  }

  toggleCard(index: number) {
    this.expandedCards[index] = !this.expandedCards[index];
  }

  private groupAnswersByIndex(questions: QuestionResponseDto[]) {
    const responseCount = questions[0]?.answers?.length || 0;
    const grouped: AnswerVisualization[] = [];

    for (let i = 0; i < responseCount; i++) {
      const answers = questions.map((q) => {
        const answer = q.answers?.[i];
        return {
          question: q.text,
          type: q.type,
          response: answer?.text,
          selectedOptions: answer?.selectedOptions
        };
      });

      grouped.push({
        label: `Respuesta #${i + 1}`,
        answers
      });
    }

    this.groupedAnswers = grouped;
  }

  get totalResponses(): number {
    return this.groupedAnswers.length;
  }

  redirectToStatisticPage() {
    const visualizationId = this.survey?.visualizationId;

    if (!visualizationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de visualización inválido'
      });
      return;
    }

    this.router.navigate([
      '/survey/statistic',
      this.survey?.id,
      visualizationId
    ]);
  }
}
