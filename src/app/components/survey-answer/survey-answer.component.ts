import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SurveyService } from '../../services/survey.service';
import { Survey } from '../../interfaces/survey.interface';
import { RawAnswer, RawSurveyAnswer } from '../../interfaces/raw-survey-answer.interface';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { CreateAnswersDto } from '../../dtos/request/create-answers.dto';
import { QuestionType } from '../../enums/question-type.enum';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-survey-answer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    ButtonModule,
    ErrorMessageComponent
  ],
  templateUrl: './survey-answer.component.html',
  styleUrl: './survey-answer.component.css'
})
export class SurveyAnswerComponent implements OnInit {
  answersForm!: FormGroup;
  survey: Survey | null = null;

  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  surveyService = inject(SurveyService);
  messageService = inject(MessageService);
  router = inject(Router);

  participationId = this.route.snapshot.paramMap.get('participationId') ?? '';

  constructor() {
    this.answersForm = this.formBuilder.group({
      participationId: this.participationId,
      answers: this.formBuilder.array([]),
    });
  }

  get answers(): FormArray {
    return this.answersForm.get('answers') as FormArray;
  }

  ngOnInit(): void {
    if (!this.participationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de encuesta no encontrado',
      })
      this.router.navigate(['/']);
      return;
    }

    this.surveyService.findOneByParticipationId(this.participationId).subscribe({
      next: (survey) => {
        this.survey = survey;

        survey.questions.forEach((question: Question) => {
          let responseControl;

          if (question.type === QuestionType.MULTIPLE_CHOICE) {
            responseControl = this.formBuilder.control([], Validators.required);
          } else {
            responseControl = this.formBuilder.control('', Validators.required);
          }

          this.answers.push(
            this.formBuilder.group({
              questionId: [question.id],
              response: responseControl,
            })
          );
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la encuesta',
        })
      },
    });
  }

  onSubmit(): void {
    this.answersForm.markAllAsTouched();

    if (this.answersForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor revisa los campos requeridos de la encuesta',
      });
      return;
    }

    const payload: CreateAnswersDto = this.mapAnswersPayload();

    this.surveyService.submitAnswers(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Encuesta respondida',
          detail: 'Las respuestas se guardaron correctamente',
        });

        this.answersForm.reset();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron guardar las respuestas',
        });
        console.error('Error al responder encuesta:', err);
      },
    });
  }

  private mapAnswersPayload(): CreateAnswersDto {
    const raw: RawSurveyAnswer = this.answersForm.value;

    const mappedAnswers = (raw.answers as RawAnswer[]).map((answer, index) => {
      const question = this.survey?.questions[index];
      if (!question) return null;

      if (question.type !== 'open') {
        return {
          questionId: answer.questionId,
          selectedOptions: Array.isArray(answer.response)
            ? answer.response
            : [answer.response],
        };
      }

      return {
        questionId: answer.questionId,
        text: answer.response as string,
      };
    }).filter(a => a !== null);

    return {
      participationId: raw.participationId,
      answers: mappedAnswers,
    };
  }
}
