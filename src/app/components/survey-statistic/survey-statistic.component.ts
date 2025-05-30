import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  QuestionResponseDto,
  SurveyVisualizationResponseDto
} from '../../dtos/response/survey-visualization-response.dto';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SurveyService } from '../../services/survey.service';
import { QuestionType } from '../../enums/question-type.enum';
import { ChartData, OptionStatistic, QuestionStatistics } from '../../interfaces/statistics.interface';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-survey-statistics',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    LoadingComponent
  ],
  templateUrl: './survey-statistic.component.html',
  styleUrl: './survey-statistic.component.css'
})
export class SurveyStatisticComponent implements OnInit {
  survey: SurveyVisualizationResponseDto | null = null;
  questionStatistics: QuestionStatistics[] = [];
  totalResponses: number = 0;

  surveyService = inject(SurveyService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);

  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
  };

  ngOnInit(): void {
    const visualizationId = this.route.snapshot.paramMap.get('visualizationId');

    if (!visualizationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de visualización inválido'
      });
      return;
    }

    this.surveyService.findOneByVisualizationId(visualizationId).subscribe({
      next: (data) => {
        this.survey = data;
        this.processStatistics(data);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las estadísticas'
        });
      }
    });
  }

  private processStatistics(survey: SurveyVisualizationResponseDto): void {
    this.totalResponses = survey.questions[0]?.answers?.length || 0;
    this.questionStatistics = survey.questions.map(question =>
      this.calculateQuestionStatistics(question)
    );
  }

  private calculateQuestionStatistics(question: QuestionResponseDto): QuestionStatistics {
    const totalAnswers = question.answers?.length || 0;

    if (question.type !== QuestionType.OPEN) {
      return this.calculateChoiceStatistics(question, totalAnswers);
    }

    return this.calculateOpenStatistics(question, totalAnswers);
  }

  private calculateChoiceStatistics(
    question: QuestionResponseDto,
    totalAnswers: number
  ): QuestionStatistics {
    const optionCounts = new Map<string, number>();

    question.answers?.forEach(answer => {
      if (answer.selectedOptions && answer.selectedOptions.length > 0) {
        answer.selectedOptions.forEach(option => {
          optionCounts.set(option, (optionCounts.get(option) || 0) + 1);
        });
      }
    });

    const options: OptionStatistic[] = Array.from(optionCounts.entries()).map(
      ([option, count]) => ({
        option,
        count,
        percentage: totalAnswers > 0 ? (count / totalAnswers) * 100 : 0
      }));

    options.sort((a, b) => b.count - a.count);

    return {
      question: question.text,
      type: question.type,
      totalResponses: totalAnswers,
      options
    };
  }

  private calculateOpenStatistics(
    question: QuestionResponseDto,
    totalAnswers: number
  ): QuestionStatistics {
    const textResponses = question.answers
      ?.filter(answer => answer.text && answer.text.trim() !== '')
      .map(answer => answer.text!) || [];

    return {
      question: question.text,
      type: question.type,
      totalResponses: totalAnswers,
      textResponses,
      responseRate: totalAnswers > 0 ? (textResponses.length / totalAnswers) * 100 : 0
    };
  }

  getBarChartData(statistics: QuestionStatistics): ChartData {
    if (!statistics.options) return { labels: [], datasets: [] };

    return {
      labels: statistics.options.map(opt => opt.option),
      datasets: [{
        label: 'Respuestas',
        data: statistics.options.map(opt => opt.count),
        backgroundColor: [
          '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
          '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
        ],
      }]
    };
  }

  getPieChartData(statistics: QuestionStatistics): ChartData {
    if (!statistics.options) return { labels: [], datasets: [] };

    const isMultipleChoice = statistics.type === 'multiple_choice';

    return {
      labels: statistics.options.map(opt =>
        isMultipleChoice
          ? `${opt.option} (${opt.count} respuestas)`
          : `${opt.option} (${opt.percentage.toFixed(1)}%)`
      ),
      datasets: [{
        data: statistics.options.map(opt => opt.count),
        backgroundColor: [
          '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
          '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
        ],
        hoverBackgroundColor: [
          '#5dade2', '#ec7063', '#58d68d', '#f7dc6f',
          '#bb8fce', '#5dbeaa', '#566573', '#f0b27a'
        ]
      }]
    };
  }
}
